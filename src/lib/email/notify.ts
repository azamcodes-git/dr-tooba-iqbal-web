import nodemailer from "nodemailer";
import { Resend } from "resend";
import { env } from "@/env";
import { getLocationById } from "@/content/locations";
import {
  escapeHtml,
  sanitizePlainText,
  stripHeaderInjection
} from "@/lib/security/sanitize";
import type { ValidatedAppointment } from "@/lib/validation/appointment";

export interface NotificationTemplates {
  subject: string;
  text: string;
  html: string;
}

export interface NotificationDispatchResult {
  delivered: boolean;
  provider: "resend" | "smtp" | "simulated";
}

/**
 * Builds header-injection-safe subject, plain-text body, and strictly HTML-escaped
 * email body for a validated appointment request.
 */
export function buildAppointmentEmailContent(
  appointment: ValidatedAppointment
): NotificationTemplates {
  const clinic = getLocationById(appointment.location);
  const safeNameHeader = stripHeaderInjection(appointment.fullName);
  const safeLocationHeader = stripHeaderInjection(clinic.city.en);
  const safeDateHeader = stripHeaderInjection(appointment.preferredDate);

  const subject = `[Appointment Request] ${safeLocationHeader} (${safeDateHeader}) — ${safeNameHeader}`;

  const cleanNameText = sanitizePlainText(appointment.fullName);
  const cleanPhoneText = sanitizePlainText(appointment.phone);
  const cleanLocationText = sanitizePlainText(clinic.name.en);
  const cleanDateText = sanitizePlainText(appointment.preferredDate);
  const cleanReasonText = appointment.reason
    ? sanitizePlainText(appointment.reason)
    : "Not specified";

  const text = [
    "NEW CLINIC APPOINTMENT REQUEST — DR. TOOBA IQBAL (MBBS, MCPS)",
    "=============================================================",
    `Patient Name   : ${cleanNameText}`,
    `Phone (E.164)  : ${cleanPhoneText}`,
    `Clinic         : ${cleanLocationText}`,
    `Preferred Date : ${cleanDateText}`,
    `Brief Reason   : ${cleanReasonText}`,
    `Locale         : ${appointment.locale}`,
    "-------------------------------------------------------------",
    "Privacy Notice : Automatic 90-day retention policy applies."
  ].join("\n");

  const escapedName = escapeHtml(cleanNameText);
  const escapedPhone = escapeHtml(cleanPhoneText);
  const escapedLocation = escapeHtml(cleanLocationText);
  const escapedDate = escapeHtml(cleanDateText);
  const escapedReason = escapeHtml(cleanReasonText);
  const escapedLocale = escapeHtml(appointment.locale);

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:24px;background-color:#FDF6F8;font-family:system-ui,-apple-system,sans-serif;color:#2D1524;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;background-color:#FFFFFF;border:1px solid #D88BA9;border-radius:12px;overflow:hidden;">
      <tr>
        <td style="background-color:#6B1D4F;color:#FFFFFF;padding:18px 24px;">
          <h1 style="margin:0;font-size:18px;font-weight:700;">New Clinic Appointment Request</h1>
          <p style="margin:4px 0 0;font-size:13px;opacity:0.9;">Dr. Tooba Iqbal (MBBS, MCPS) • Multan &amp; Khangarh</p>
        </td>
      </tr>
      <tr>
        <td style="padding:24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="8" style="border-collapse:collapse;font-size:14px;">
            <tr style="border-bottom:1px solid #F9EBF1;">
              <td style="font-weight:600;color:#5C3A4D;width:36%;">Patient Name</td>
              <td style="color:#2D1524;">${escapedName}</td>
            </tr>
            <tr style="border-bottom:1px solid #F9EBF1;">
              <td style="font-weight:600;color:#5C3A4D;">Phone (E.164)</td>
              <td style="color:#2D1524;"><a href="tel:${escapedPhone}" style="color:#6B1D4F;text-decoration:underline;">${escapedPhone}</a></td>
            </tr>
            <tr style="border-bottom:1px solid #F9EBF1;">
              <td style="font-weight:600;color:#5C3A4D;">Selected Clinic</td>
              <td style="color:#2D1524;">${escapedLocation}</td>
            </tr>
            <tr style="border-bottom:1px solid #F9EBF1;">
              <td style="font-weight:600;color:#5C3A4D;">Preferred Date</td>
              <td style="color:#2D1524;">${escapedDate}</td>
            </tr>
            <tr style="border-bottom:1px solid #F9EBF1;">
              <td style="font-weight:600;color:#5C3A4D;">Brief Reason</td>
              <td style="color:#2D1524;">${escapedReason}</td>
            </tr>
            <tr>
              <td style="font-weight:600;color:#5C3A4D;">Language</td>
              <td style="color:#2D1524;">${escapedLocale.toUpperCase()}</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="background-color:#F9EBF1;padding:12px 24px;font-size:12px;color:#5C3A4D;">
          Confidential scheduling notification. Please delete this message once the appointment has been completed (90-day maximum retention policy).
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, text, html };
}

/**
 * Dispatches the clinic appointment notification via Resend or SMTP fallback.
 * Never logs patient PII.
 */
export async function sendAppointmentNotification(
  appointment: ValidatedAppointment
): Promise<NotificationDispatchResult> {
  const { subject, text, html } = buildAppointmentEmailContent(appointment);
  const safeFrom = stripHeaderInjection(env.NOTIFY_EMAIL_FROM);
  const safeTo = stripHeaderInjection(env.NOTIFY_EMAIL_TO);

  if (env.RESEND_API_KEY && env.RESEND_API_KEY.trim().length > 0) {
    const resend = new Resend(env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: safeFrom,
      to: [safeTo],
      subject,
      text,
      html
    });
    if (error) {
      throw new Error("Transactional email dispatch via Resend failed");
    }
    return {
      delivered: true,
      provider: "resend"
    };
  }

  if (env.SMTP_HOST && env.SMTP_HOST.trim().length > 0) {
    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth:
        env.SMTP_USER && env.SMTP_PASS
          ? {
              user: env.SMTP_USER,
              pass: env.SMTP_PASS
            }
          : undefined
    });

    await transporter.sendMail({
      from: safeFrom,
      to: safeTo,
      subject,
      text,
      html
    });

    return {
      delivered: true,
      provider: "smtp"
    };
  }

  // Local development / CI fallback when external email credentials are omitted
  return {
    delivered: true,
    provider: "simulated"
  };
}
