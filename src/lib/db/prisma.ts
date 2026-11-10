import { PrismaClient } from "@prisma/client";
import { env } from "@/env";
import { computeBlindIndex, encryptPii } from "@/lib/security/crypto";
import type { ValidatedAppointment } from "@/lib/validation/appointment";

export const RETENTION_DAYS = 90;

const globalForPrisma = globalThis as unknown as {
  prismaInstance?: PrismaClient;
};

/**
 * Returns a singleton PrismaClient instance.
 */
export function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prismaInstance) {
    globalForPrisma.prismaInstance = new PrismaClient({
      log: ["error"]
    });
  }
  return globalForPrisma.prismaInstance;
}

/**
 * Persists an appointment request ONLY when `ENABLE_DB_STORAGE === "true"`.
 * Encrypts the normalized E.164 phone number with AES-256-GCM and stores an
 * HMAC-SHA256 blind index alongside a 90-day `expiresAt` timestamp.
 */
export async function saveEncryptedAppointment(
  appointment: ValidatedAppointment
): Promise<{ stored: boolean; recordId?: string }> {
  if (env.ENABLE_DB_STORAGE !== "true") {
    return { stored: false };
  }

  const prisma = getPrismaClient();
  const encryptedPhone = encryptPii(appointment.phone);
  const phoneBlindIndex = computeBlindIndex(appointment.phone);

  const now = new Date();
  const expiresAt = new Date(
    now.getTime() + RETENTION_DAYS * 24 * 60 * 60 * 1000
  );

  const [yStr, mStr, dStr] = appointment.preferredDate.split("-");
  const preferredDateUtc = new Date(
    Date.UTC(Number(yStr), Number(mStr) - 1, Number(dStr))
  );

  const created = await prisma.appointmentRequest.create({
    data: {
      fullName: appointment.fullName,
      encryptedPhone,
      phoneBlindIndex,
      location: appointment.location,
      preferredDate: preferredDateUtc,
      reason: appointment.reason || null,
      locale: appointment.locale,
      expiresAt
    },
    select: {
      id: true
    }
  });

  return {
    stored: true,
    recordId: created.id
  };
}

/**
 * Purges all appointment records that have exceeded the 90-day retention window.
 * Safe to invoke from `/api/cron/retention`.
 */
export async function purgeExpiredAppointments(
  retentionDays: number = RETENTION_DAYS
): Promise<{ deletedCount: number; mode: "database" | "stateless" }> {
  if (env.ENABLE_DB_STORAGE !== "true") {
    return {
      deletedCount: 0,
      mode: "stateless"
    };
  }

  const prisma = getPrismaClient();
  const now = new Date();
  const cutoffDate = new Date(
    now.getTime() - retentionDays * 24 * 60 * 60 * 1000
  );

  const result = await prisma.appointmentRequest.deleteMany({
    where: {
      OR: [
        {
          expiresAt: {
            lte: now
          }
        },
        {
          createdAt: {
            lte: cutoffDate
          }
        }
      ]
    }
  });

  return {
    deletedCount: result.count,
    mode: "database"
  };
}
