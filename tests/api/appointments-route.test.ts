import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it } from "vitest";
import { GET, POST } from "@/app/api/appointments/route";
import { POST as cronRetentionPOST } from "@/app/api/cron/retention/route";
import { env } from "@/env";
import { resetInMemoryRateLimit } from "@/lib/security/rate-limit";
import {
  MAX_BODY_BYTES,
  getPakistanTodayIso
} from "@/lib/validation/appointment";

function createAppointmentRequest(
  body: unknown,
  overrides?: {
    origin?: string;
    contentType?: string;
    ip?: string;
  }
): NextRequest {
  const rawBody = typeof body === "string" ? body : JSON.stringify(body);
  const headers = new Headers({
    "content-type": overrides?.contentType ?? "application/json",
    origin: overrides?.origin ?? "http://localhost:3000",
    host: "localhost:3000",
    "x-forwarded-for": overrides?.ip ?? "203.0.113.10"
  });

  return new NextRequest("http://localhost:3000/api/appointments", {
    method: "POST",
    headers,
    body: rawBody
  });
}

describe("POST /api/appointments Security & Validation Controls", () => {
  beforeEach(() => {
    resetInMemoryRateLimit();
  });

  it("rejects GET requests with 405 Method Not Allowed", async () => {
    const res = await GET();
    expect(res.status).toBe(405);
    expect(res.headers.get("Allow")).toBe("POST");
  });

  it("rejects non-JSON Content-Type with 415", async () => {
    const req = createAppointmentRequest("plain text", {
      contentType: "text/plain"
    });
    const res = await POST(req);
    expect(res.status).toBe(415);
  });

  it("rejects payloads larger than 4096 bytes with 413", async () => {
    const oversizedPayload = {
      fullName: "Ayesha Bibi",
      phone: "0310-1777649",
      location: "multan",
      preferredDate: getPakistanTodayIso(),
      reason: "X".repeat(MAX_BODY_BYTES + 100),
      cfTurnstileToken: "XXXX.DUMMY.TOKEN.XXXX"
    };
    const req = createAppointmentRequest(oversizedPayload);
    const res = await POST(req);
    expect(res.status).toBe(413);
  });

  it("rejects cross-origin CSRF requests with 403 Forbidden", async () => {
    const req = createAppointmentRequest(
      {
        fullName: "Ayesha Bibi",
        phone: "0310-1777649",
        location: "multan",
        preferredDate: getPakistanTodayIso(),
        reason: "Routine checkup",
        cfTurnstileToken: "XXXX.DUMMY.TOKEN.XXXX"
      },
      { origin: "https://malicious-site.example.com" }
    );
    const res = await POST(req);
    expect(res.status).toBe(403);
  });

  it("silently returns 200 OK when honeypot website_url is populated", async () => {
    const req = createAppointmentRequest({
      fullName: "Spam Bot",
      phone: "invalid-phone-ignored-for-honeypot",
      location: "multan",
      preferredDate: "1999-01-01",
      website_url: "https://spambot.example.com",
      cfTurnstileToken: "XXXX.DUMMY.TOKEN.XXXX"
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = (await res.json()) as { ok: boolean; whatsappUrl: string };
    expect(json.ok).toBe(true);
    expect(json.whatsappUrl).toContain("https://wa.me/923101777649");
  });

  it("rejects invalid form payload (e.g. invalid Pakistani phone or past date) with 400 and field issues", async () => {
    const req = createAppointmentRequest({
      fullName: "A",
      phone: "12345",
      location: "multan",
      preferredDate: "2020-01-01",
      reason: "Checkup",
      website_url: "",
      cfTurnstileToken: "XXXX.DUMMY.TOKEN.XXXX"
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = (await res.json()) as {
      ok: boolean;
      issues?: Array<{ field: string; message: string }>;
    };
    expect(json.ok).toBe(false);
    expect(Array.isArray(json.issues)).toBe(true);
    expect(json.issues!.length).toBeGreaterThanOrEqual(2);
  });

  it("rejects invalid Cloudflare Turnstile tokens with 400", async () => {
    const req = createAppointmentRequest({
      fullName: "Ayesha Bibi",
      phone: "0310-1777649",
      location: "multan",
      preferredDate: getPakistanTodayIso(),
      reason: "PCOS consultation",
      website_url: "",
      cfTurnstileToken: "INVALID_TURNSTILE_TOKEN"
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("accepts a valid appointment request and returns a pre-filled WhatsApp summary link", async () => {
    const todayIso = getPakistanTodayIso();
    const req = createAppointmentRequest({
      fullName: "Ayesha Bibi",
      phone: "0310-1777649",
      location: "multan",
      preferredDate: todayIso,
      reason: "Routine antenatal checkup",
      website_url: "",
      cfTurnstileToken: "XXXX.DUMMY.TOKEN.XXXX",
      locale: "en"
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = (await res.json()) as { ok: boolean; whatsappUrl: string };
    expect(json.ok).toBe(true);
    expect(json.whatsappUrl).toContain("https://wa.me/923101777649?text=");
    expect(decodeURIComponent(json.whatsappUrl)).toContain("+923101777649");
  });

  it("enforces per-IP rate limiting (max 5 requests per 10 minutes, 6th returns 429)", async () => {
    const todayIso = getPakistanTodayIso();
    const testIp = "198.51.100.77";

    for (let i = 1; i <= 5; i += 1) {
      const req = createAppointmentRequest(
        {
          fullName: "Ayesha Bibi",
          phone: "0310-1777649",
          location: "multan",
          preferredDate: todayIso,
          reason: `Attempt ${i}`,
          website_url: "",
          cfTurnstileToken: "XXXX.DUMMY.TOKEN.XXXX"
        },
        { ip: testIp }
      );
      const res = await POST(req);
      expect(res.status).toBe(200);
    }

    const sixthReq = createAppointmentRequest(
      {
        fullName: "Ayesha Bibi",
        phone: "0310-1777649",
        location: "multan",
        preferredDate: todayIso,
        reason: "Attempt 6",
        website_url: "",
        cfTurnstileToken: "XXXX.DUMMY.TOKEN.XXXX"
      },
      { ip: testIp }
    );
    const sixthRes = await POST(sixthReq);
    expect(sixthRes.status).toBe(429);
    expect(Number(sixthRes.headers.get("Retry-After"))).toBeGreaterThan(0);
  });
});

describe("POST /api/cron/retention Endpoint", () => {
  it("rejects requests without a valid Bearer CRON_SECRET token with 401", async () => {
    const unauthorizedReq = new NextRequest(
      "http://localhost:3000/api/cron/retention",
      {
        method: "POST",
        headers: {
          authorization: "Bearer wrong-secret-token"
        }
      }
    );
    const res = await cronRetentionPOST(unauthorizedReq);
    expect(res.status).toBe(401);
  });

  it("executes 90-day retention check when valid CRON_SECRET Bearer token is supplied", async () => {
    const authorizedReq = new NextRequest(
      "http://localhost:3000/api/cron/retention",
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${env.CRON_SECRET}`
        }
      }
    );
    const res = await cronRetentionPOST(authorizedReq);
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      ok: boolean;
      retentionDays: number;
    };
    expect(json.ok).toBe(true);
    expect(json.retentionDays).toBe(90);
  });
});
