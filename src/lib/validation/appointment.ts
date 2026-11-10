import { z } from "zod";
import {
  getLocationById,
  getScheduleMismatchNotice,
  type ClinicLocationId
} from "@/content/locations";
import { buildWhatsAppUrl } from "@/content/site";
import { sanitizePlainText } from "@/lib/security/sanitize";

export const MAX_BODY_BYTES = 4096;

/**
 * Permits English alphabets, Urdu/Arabic script characters, spaces, periods,
 * apostrophes, and hyphens. Rejects HTML brackets, numbers, and symbols.
 */
const FULL_NAME_REGEX =
  /^[A-Za-z\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF\s.'-]+$/;

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Normalizes a Pakistani mobile or landline phone number into strict E.164 (`+92...`).
 *
 * Accepted input examples:
 * - `0310-1777649` -> `+923101777649`
 * - `03101777649` -> `+923101777649`
 * - `+92 310 1777649` -> `+923101777649`
 * - `00923101777649` -> `+923101777649`
 * - `0336-6038107` -> `+923366038107`
 * - `061-1234567` -> `+92611234567`
 *
 * Returns `null` if the phone number is not a valid Pakistani phone number.
 */
export function normalizePakistaniPhone(raw: string): string | null {
  const stripped = raw.replace(/[\s\-().]/g, "").trim();

  if (!stripped) {
    return null;
  }

  let candidate = stripped;

  if (candidate.startsWith("0092")) {
    candidate = `+92${candidate.slice(4)}`;
  } else if (candidate.startsWith("92") && candidate.length >= 11 && candidate.length <= 12) {
    candidate = `+${candidate}`;
  } else if (candidate.startsWith("0") && candidate.length >= 10 && candidate.length <= 11) {
    candidate = `+92${candidate.slice(1)}`;
  }

  // Validate Pakistani E.164: +92 followed by 9 or 10 digits starting with 2–9 (most commonly +923XXXXXXXXX mobile)
  if (!/^\+92[2-9]\d{8,9}$/.test(candidate)) {
    return null;
  }

  // If it starts with +923 (mobile), enforce exact 10 subscriber digits (+923XXXXXXXXX = 13 chars)
  if (candidate.startsWith("+923") && candidate.length !== 13) {
    return null;
  }

  return candidate;
}

/**
 * Returns today's date in Pakistan Standard Time (`Asia/Karachi`, UTC+5) as `YYYY-MM-DD`.
 */
export function getPakistanTodayIso(referenceNow: Date = new Date()): string {
  // PKT is always UTC + 5 hours (no daylight saving)
  const pktMs = referenceNow.getTime() + 5 * 60 * 60 * 1000;
  const pktDate = new Date(pktMs);
  const year = pktDate.getUTCFullYear();
  const month = String(pktDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(pktDate.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Checks whether `isoDate` (`YYYY-MM-DD`) is a real calendar date between
 * `today` (inclusive) and `today + 60 days` (inclusive) in Pakistan Standard Time.
 */
export function isDateWithinBookingWindow(
  isoDate: string,
  referenceNow: Date = new Date()
): { valid: boolean; reason?: "format" | "past" | "too_far" } {
  if (!ISO_DATE_REGEX.test(isoDate)) {
    return { valid: false, reason: "format" };
  }

  const [yStr, mStr, dStr] = isoDate.split("-");
  const year = Number(yStr);
  const month = Number(mStr);
  const day = Number(dStr);

  const parsedUtc = new Date(Date.UTC(year, month - 1, day));
  if (
    Number.isNaN(parsedUtc.getTime()) ||
    parsedUtc.getUTCFullYear() !== year ||
    parsedUtc.getUTCMonth() + 1 !== month ||
    parsedUtc.getUTCDate() !== day
  ) {
    return { valid: false, reason: "format" };
  }

  const todayIso = getPakistanTodayIso(referenceNow);
  const [tyStr, tmStr, tdStr] = todayIso.split("-");
  const todayUtc = new Date(
    Date.UTC(Number(tyStr), Number(tmStr) - 1, Number(tdStr))
  );

  const diffDays = Math.round(
    (parsedUtc.getTime() - todayUtc.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) {
    return { valid: false, reason: "past" };
  }
  if (diffDays > 60) {
    return { valid: false, reason: "too_far" };
  }

  return { valid: true };
}

/**
 * Strict Zod schema for appointment requests (`src/lib/validation/appointment.ts`).
 */
export const appointmentSchema = z.object({
  fullName: z
    .string()
    .transform((val) => sanitizePlainText(val))
    .pipe(
      z
        .string()
        .min(2, "Full name must be at least 2 characters")
        .max(80, "Full name must not exceed 80 characters")
        .regex(
          FULL_NAME_REGEX,
          "Full name may only contain English or Urdu letters, spaces, periods, and hyphens"
        )
    ),
  phone: z
    .string()
    .trim()
    .min(10, "Please enter a valid Pakistani phone number")
    .max(20, "Phone number is too long")
    .transform((val, ctx) => {
      const normalized = normalizePakistaniPhone(val);
      if (!normalized) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Please enter a valid Pakistani phone number (e.g., 0310-1777649 or +923101777649)"
        });
        return z.NEVER;
      }
      return normalized;
    }),
  location: z.enum(["multan", "khangarh"], {
    errorMap: () => ({
      message: "Please select either the Multan or Khangarh clinic"
    })
  }),
  preferredDate: z
    .string()
    .trim()
    .superRefine((val, ctx) => {
      const check = isDateWithinBookingWindow(val);
      if (!check.valid) {
        if (check.reason === "past") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Preferred date cannot be in the past"
          });
        } else if (check.reason === "too_far") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Preferred date must be within the next 60 days"
          });
        } else {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Preferred date must be a valid YYYY-MM-DD date"
          });
        }
      }
    }),
  reason: z
    .string()
    .optional()
    .default("")
    .transform((val) => sanitizePlainText(val ?? ""))
    .pipe(
      z
        .string()
        .max(
          300,
          "Brief reason must not exceed 300 characters. Do not include detailed medical history."
        )
    ),
  website_url: z.string().optional().default(""),
  cfTurnstileToken: z
    .string()
    .trim()
    .min(1, "Security verification token is required"),
  locale: z.enum(["en", "ur"]).optional().default("en")
});

export type AppointmentInput = z.input<typeof appointmentSchema>;
export type ValidatedAppointment = z.output<typeof appointmentSchema>;

/**
 * Helper returning optional day-of-week schedule warning alongside validated booking.
 */
export function evaluateClinicDayWarning(
  location: ClinicLocationId,
  preferredDate: string
) {
  return getScheduleMismatchNotice(location, preferredDate);
}

/**
 * Builds the pre-filled WhatsApp summary link returned on successful booking.
 */
export function buildBookingWhatsAppSummaryUrl(
  appointment: Pick<
    ValidatedAppointment,
    "fullName" | "phone" | "location" | "preferredDate" | "reason" | "locale"
  >
): string {
  const clinic = getLocationById(appointment.location);
  const clinicLabel =
    appointment.locale === "ur" ? clinic.name.ur : clinic.name.en;

  const lines =
    appointment.locale === "ur"
      ? [
          "السلام علیکم، میں نے ویب سائٹ پر اپائنٹمنٹ کی درخواست جمع کروائی ہے:",
          `• نام: ${appointment.fullName}`,
          `• فون: ${appointment.phone}`,
          `• کلینک: ${clinicLabel}`,
          `• پسندیدہ تاریخ: ${appointment.preferredDate}`,
          appointment.reason ? `• مختصر وجہ: ${appointment.reason}` : null
        ]
      : [
          "Assalam-o-Alaikum, I have submitted an appointment request on the clinic website:",
          `• Patient Name: ${appointment.fullName}`,
          `• Phone: ${appointment.phone}`,
          `• Clinic: ${clinicLabel}`,
          `• Preferred Date: ${appointment.preferredDate}`,
          appointment.reason ? `• Brief Reason: ${appointment.reason}` : null
        ];

  const message = lines.filter(Boolean).join("\n");
  return buildWhatsAppUrl(message, appointment.locale);
}
