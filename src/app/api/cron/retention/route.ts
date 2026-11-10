import { NextRequest, NextResponse } from "next/server";
import { env } from "@/env";
import { purgeExpiredAppointments, RETENTION_DAYS } from "@/lib/db/prisma";
import { timingSafeEqualStrings } from "@/lib/security/crypto";

/**
 * Extracts and verifies the `Authorization: Bearer <CRON_SECRET>` header
 * using constant-time comparison.
 */
function isAuthorizedCronRequest(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }

  const providedToken = authHeader.slice("Bearer ".length).trim();
  if (!providedToken || !env.CRON_SECRET) {
    return false;
  }

  return timingSafeEqualStrings(providedToken, env.CRON_SECRET);
}

/**
 * 90-Day PII Auto-Deletion Cron Endpoint (`POST /api/cron/retention`)
 *
 * Triggered daily by `.github/workflows/cleanup-retention.yml` or platform cron
 * to enforce the 90-day maximum retention policy for stored appointment requests.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Unauthorized"
      },
      { status: 401 }
    );
  }

  try {
    const result = await purgeExpiredAppointments(RETENTION_DAYS);

    return NextResponse.json(
      {
        ok: true,
        mode: result.mode,
        deletedCount: result.deletedCount,
        retentionDays: RETENTION_DAYS,
        executedAt: new Date().toISOString()
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0"
        }
      }
    );
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Retention cleanup failed"
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  return POST(request);
}
