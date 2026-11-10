import { NextRequest, NextResponse } from "next/server";
import { env } from "@/env";
import { buildWhatsAppUrl } from "@/content/site";
import { saveEncryptedAppointment } from "@/lib/db/prisma";
import { sendAppointmentNotification } from "@/lib/email/notify";
import { checkAppointmentRateLimit } from "@/lib/security/rate-limit";
import { verifyTurnstileToken } from "@/lib/security/turnstile";
import {
  MAX_BODY_BYTES,
  appointmentSchema,
  buildBookingWhatsAppSummaryUrl,
  evaluateClinicDayWarning
} from "@/lib/validation/appointment";

/**
 * Extracts client IP safely from standard reverse-proxy headers.
 */
function extractClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) {
      return firstIp;
    }
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) {
    return realIp;
  }
  return "127.0.0.1";
}

/**
 * Verifies CSRF Origin header matches the request Host or configured NEXT_PUBLIC_SITE_URL.
 */
function isValidCsrfOrigin(request: NextRequest): boolean {
  const originHeader = request.headers.get("origin");
  if (!originHeader) {
    return false;
  }

  try {
    const originUrl = new URL(originHeader);
    const hostHeader =
      request.headers.get("x-forwarded-host") ?? request.headers.get("host");

    if (hostHeader && originUrl.host.toLowerCase() === hostHeader.toLowerCase()) {
      return true;
    }

    const configuredSiteUrl = new URL(env.NEXT_PUBLIC_SITE_URL);
    if (originUrl.origin.toLowerCase() === configuredSiteUrl.origin.toLowerCase()) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Hardened `POST /api/appointments` Route Handler
 *
 * Security Controls:
 * 1. Content-Type (`application/json`) & raw body size (`<= 4096 bytes`) enforcement.
 * 2. Strict CSRF `Origin` verification against `Host` / `NEXT_PUBLIC_SITE_URL`.
 * 3. Per-IP sliding-window rate limiting (5 req / 10 min / IP) with `Retry-After`.
 * 4. Silent `200 OK` honeypot trap (`website_url`) so automated bots cannot adapt.
 * 5. Cloudflare Turnstile server-side verification (`siteverify`).
 * 6. Strict Zod schema validation & Pakistani E.164 phone normalization.
 * 7. Header injection & HTML escaping prior to email dispatch + optional AES-256-GCM DB storage.
 * 8. Zero PII logging and generic error envelopes with zero stack traces.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Content-Type check
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return NextResponse.json(
        {
          ok: false,
          error: "Unsupported Content-Type. Expected application/json."
        },
        { status: 415 }
      );
    }

    // Check Content-Length header early if present
    const contentLengthHeader = request.headers.get("content-length");
    if (contentLengthHeader) {
      const declaredBytes = Number(contentLengthHeader);
      if (!Number.isNaN(declaredBytes) && declaredBytes > MAX_BODY_BYTES) {
        return NextResponse.json(
          {
            ok: false,
            error: "Request payload exceeds the 4096-byte security limit."
          },
          { status: 413 }
        );
      }
    }

    // 2. CSRF Origin verification
    if (!isValidCsrfOrigin(request)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Forbidden: Cross-origin request rejected."
        },
        { status: 403 }
      );
    }

    // 3. Per-IP Rate Limiting (5 requests per 10 minutes)
    const clientIp = extractClientIp(request);
    const rateLimit = await checkAppointmentRateLimit(clientIp);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Too many appointment requests from this connection. Please wait before trying again."
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds),
            "X-RateLimit-Limit": String(rateLimit.limit),
            "X-RateLimit-Remaining": "0"
          }
        }
      );
    }

    // Read raw body and enforce actual byte size <= 4096 bytes
    const rawBodyText = await request.text();
    const actualByteLength = Buffer.byteLength(rawBodyText, "utf8");
    if (actualByteLength > MAX_BODY_BYTES) {
      return NextResponse.json(
        {
          ok: false,
          error: "Request payload exceeds the 4096-byte security limit."
        },
        { status: 413 }
      );
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(rawBodyText);
    } catch {
      return NextResponse.json(
        {
          ok: false,
          error: "Malformed JSON request body."
        },
        { status: 400 }
      );
    }

    if (!parsedJson || typeof parsedJson !== "object" || Array.isArray(parsedJson)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid request payload object."
        },
        { status: 400 }
      );
    }

    const recordPayload = parsedJson as Record<string, unknown>;

    // 4. Honeypot Check (`website_url`):
    // If non-empty, silently return 200 OK without dispatching email or writing to DB.
    if (
      typeof recordPayload.website_url === "string" &&
      recordPayload.website_url.trim().length > 0
    ) {
      return NextResponse.json(
        {
          ok: true,
          whatsappUrl: buildWhatsAppUrl(),
          scheduleNotice: null
        },
        { status: 200 }
      );
    }

    // 5. Strict Zod Validation (validates structure, dates, and normalizes phone to E.164)
    const validation = appointmentSchema.safeParse(recordPayload);
    if (!validation.success) {
      const fieldErrors = validation.error.issues.map((issue) => ({
        field: issue.path.join(".") || "form",
        message: issue.message
      }));
      return NextResponse.json(
        {
          ok: false,
          error: "Please review the highlighted form fields.",
          issues: fieldErrors
        },
        { status: 400 }
      );
    }

    const validatedBooking = validation.data;

    // 6. Cloudflare Turnstile Server-Side Verification
    const turnstileCheck = await verifyTurnstileToken(
      validatedBooking.cfTurnstileToken,
      clientIp
    );
    if (!turnstileCheck.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Security verification failed. Please refresh and try again."
        },
        { status: 400 }
      );
    }

    // 7. Dual-Mode Storage & Notification
    await sendAppointmentNotification(validatedBooking);

    if (env.ENABLE_DB_STORAGE === "true") {
      await saveEncryptedAppointment(validatedBooking);
    }

    const scheduleNotice = evaluateClinicDayWarning(
      validatedBooking.location,
      validatedBooking.preferredDate
    );

    const whatsappUrl = buildBookingWhatsAppSummaryUrl(validatedBooking);

    return NextResponse.json(
      {
        ok: true,
        whatsappUrl,
        scheduleNotice
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0"
        }
      }
    );
  } catch {
    // 8. Zero PII Logging & Generic 500 Envelope
    return NextResponse.json(
      {
        ok: false,
        error:
          "Unable to process appointment request at this time. Please contact the clinic via WhatsApp."
      },
      { status: 500 }
    );
  }
}

function methodNotAllowedResponse(): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      error: "Method Not Allowed. Use POST."
    },
    {
      status: 405,
      headers: {
        Allow: "POST"
      }
    }
  );
}

export async function GET(): Promise<NextResponse> {
  return methodNotAllowedResponse();
}

export async function PUT(): Promise<NextResponse> {
  return methodNotAllowedResponse();
}

export async function DELETE(): Promise<NextResponse> {
  return methodNotAllowedResponse();
}

export async function PATCH(): Promise<NextResponse> {
  return methodNotAllowedResponse();
}
