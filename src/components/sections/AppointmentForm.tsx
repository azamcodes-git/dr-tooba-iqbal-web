"use client";

import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarCheck,
  CheckCircle2,
  Info,
  MessageCircle,
  ShieldAlert
} from "lucide-react";
import {
  getScheduleMismatchNotice,
  type ClinicLocationId
} from "@/content/locations";
import { buildWhatsAppUrl } from "@/content/site";
import { getMessages, localize, type Locale } from "@/i18n";

interface AppointmentFormProps {
  locale: Locale;
  defaultLocation?: ClinicLocationId;
}

interface ApiSuccessResponse {
  ok: true;
  whatsappUrl: string;
  scheduleNotice?: {
    en: string;
    ur: string;
  } | null;
}

interface ApiErrorResponse {
  ok: false;
  error: string;
  issues?: Array<{ field: string; message: string }>;
}

function getDateBounds(): { minDate: string; maxDate: string } {
  const now = new Date();
  const pktNow = new Date(now.getTime() + 5 * 60 * 60 * 1000);
  const minDate = pktNow.toISOString().slice(0, 10);

  const maxPkt = new Date(pktNow.getTime() + 60 * 24 * 60 * 60 * 1000);
  const maxDate = maxPkt.toISOString().slice(0, 10);

  return { minDate, maxDate };
}

export function AppointmentForm({
  locale,
  defaultLocation = "multan"
}: AppointmentFormProps) {
  const t = getMessages(locale);
  const { minDate, maxDate } = useMemo(() => getDateBounds(), []);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState<ClinicLocationId>(defaultLocation);
  const [preferredDate, setPreferredDate] = useState(minDate);
  const [reason, setReason] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [cfTurnstileToken] = useState("XXXX.DUMMY.TOKEN.XXXX");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldIssues, setFieldIssues] = useState<Record<string, string>>({});
  const [submittedWhatsappUrl, setSubmittedWhatsappUrl] = useState<string | null>(
    null
  );

  // Live schedule notice when Monday is picked for Multan or Tue–Sat is picked for Khangarh
  const scheduleWarning = useMemo(() => {
    if (!preferredDate) {
      return null;
    }
    return getScheduleMismatchNotice(location, preferredDate);
  }, [location, preferredDate]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setFieldIssues({});

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fullName,
          phone,
          location,
          preferredDate,
          reason,
          website_url: websiteUrl,
          cfTurnstileToken,
          locale
        })
      });

      if (response.status === 429) {
        setErrorMessage(t.bookingForm.errorRateLimit);
        setIsSubmitting(false);
        return;
      }

      const data = (await response.json()) as
        | ApiSuccessResponse
        | ApiErrorResponse;

      if (!response.ok || !data.ok) {
        const errData = data as ApiErrorResponse;
        if (errData.issues && errData.issues.length > 0) {
          const issueMap: Record<string, string> = {};
          for (const item of errData.issues) {
            issueMap[item.field] = item.message;
          }
          setFieldIssues(issueMap);
        }
        setErrorMessage(errData.error || t.bookingForm.errorGeneric);
        setIsSubmitting(false);
        return;
      }

      setSubmittedWhatsappUrl(data.whatsappUrl);
      setIsSubmitting(false);
    } catch {
      setErrorMessage(t.bookingForm.errorGeneric);
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    setSubmittedWhatsappUrl(null);
    setErrorMessage(null);
    setFieldIssues({});
    setReason("");
  }

  return (
    <div className="rounded-3xl border-2 border-brand-rose bg-white p-6 shadow-card sm:p-8 lg:p-10">
      <div className="border-b border-brand-rose/50 pb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-plum">
          {t.bookingForm.eyebrow}
        </p>
        <h2 className="mt-1.5 font-heading text-2xl font-bold text-brand-plum sm:text-3xl">
          {t.bookingForm.heading}
        </h2>
        <p className="mt-2 text-sm text-ink-muted sm:text-base">
          {t.bookingForm.subheading}
        </p>
      </div>

      {submittedWhatsappUrl ? (
        <div
          role="status"
          aria-live="polite"
          data-testid="booking-confirmation"
          className="mt-8 rounded-2xl border-2 border-whatsapp bg-card-tint/60 p-6 sm:p-8"
        >
          <div className="flex items-start gap-3.5">
            <CheckCircle2
              className="mt-0.5 h-7 w-7 shrink-0 text-brand-plum"
              aria-hidden="true"
            />
            <div>
              <h3 className="font-heading text-xl font-bold text-brand-plum">
                {t.bookingForm.successTitle}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink sm:text-base">
                {t.bookingForm.successBody}
              </p>

              {scheduleWarning && (
                <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-brand-rose bg-white p-3.5 text-xs text-ink">
                  <Info
                    className="mt-0.5 h-4 w-4 shrink-0 text-brand-plum"
                    aria-hidden="true"
                  />
                  <span>{localize(scheduleWarning, locale)}</span>
                </div>
              )}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href={submittedWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="whatsapp-summary-link"
                  className="btn-whatsapp gap-2.5 text-center"
                >
                  <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span>{t.bookingForm.whatsappSummaryButton}</span>
                </a>

                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-outline text-sm"
                >
                  {t.bookingForm.bookAnotherButton}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-6 space-y-6"
          aria-label={t.bookingForm.heading}
        >
          {errorMessage && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border-2 border-brand-plum bg-card-tint p-4 text-sm text-ink"
            >
              <AlertTriangle
                className="mt-0.5 h-5 w-5 shrink-0 text-brand-plum"
                aria-hidden="true"
              />
              <div>
                <p className="font-semibold text-brand-plum">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Hidden Honeypot Trap (`website_url`) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden opacity-0"
          >
            <label htmlFor="website_url">Website URL (Do not fill)</label>
            <input
              id="website_url"
              name="website_url"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* 1. Patient Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-semibold text-ink"
              >
                {t.bookingForm.fullNameLabel} <span className="text-brand-plum">*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                minLength={2}
                maxLength={80}
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t.bookingForm.fullNamePlaceholder}
                aria-invalid={Boolean(fieldIssues.fullName)}
                aria-describedby={
                  fieldIssues.fullName ? "fullName-error" : undefined
                }
                className="min-h-tap mt-1.5 block w-full rounded-xl border border-brand-rose bg-canvas px-4 py-3 text-base text-ink placeholder:text-ink-muted/60 focus:border-brand-plum focus:bg-white"
              />
              {fieldIssues.fullName && (
                <p
                  id="fullName-error"
                  className="mt-1.5 text-xs font-medium text-brand-plum"
                >
                  {fieldIssues.fullName}
                </p>
              )}
            </div>

            {/* 2. Pakistani Phone Number */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-semibold text-ink"
              >
                {t.bookingForm.phoneLabel} <span className="text-brand-plum">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                dir="ltr"
                required
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.bookingForm.phonePlaceholder}
                aria-invalid={Boolean(fieldIssues.phone)}
                aria-describedby={
                  fieldIssues.phone ? "phone-error" : "phone-help"
                }
                className="min-h-tap mt-1.5 block w-full rounded-xl border border-brand-rose bg-canvas px-4 py-3 text-base text-ink placeholder:text-ink-muted/60 focus:border-brand-plum focus:bg-white"
              />
              <p id="phone-help" className="mt-1 text-xs text-ink-muted">
                {t.bookingForm.phoneHelp}
              </p>
              {fieldIssues.phone && (
                <p
                  id="phone-error"
                  className="mt-1 text-xs font-medium text-brand-plum"
                >
                  {fieldIssues.phone}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* 3. Clinic Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-semibold text-ink"
              >
                {t.bookingForm.locationLabel} <span className="text-brand-plum">*</span>
              </label>
              <select
                id="location"
                name="location"
                required
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value as ClinicLocationId)
                }
                className="min-h-tap mt-1.5 block w-full rounded-xl border border-brand-rose bg-canvas px-4 py-3 text-base text-ink focus:border-brand-plum focus:bg-white"
              >
                <option value="multan">{t.bookingForm.locationMultan}</option>
                <option value="khangarh">
                  {t.bookingForm.locationKhangarh}
                </option>
              </select>
            </div>

            {/* 4. Preferred Appointment Date */}
            <div>
              <label
                htmlFor="preferredDate"
                className="block text-sm font-semibold text-ink"
              >
                {t.bookingForm.preferredDateLabel}{" "}
                <span className="text-brand-plum">*</span>
              </label>
              <input
                id="preferredDate"
                name="preferredDate"
                type="date"
                dir="ltr"
                required
                min={minDate}
                max={maxDate}
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                aria-invalid={Boolean(fieldIssues.preferredDate)}
                aria-describedby={
                  fieldIssues.preferredDate ? "preferredDate-error" : undefined
                }
                className="min-h-tap mt-1.5 block w-full rounded-xl border border-brand-rose bg-canvas px-4 py-3 text-base text-ink focus:border-brand-plum focus:bg-white"
              />
              {fieldIssues.preferredDate && (
                <p
                  id="preferredDate-error"
                  className="mt-1.5 text-xs font-medium text-brand-plum"
                >
                  {fieldIssues.preferredDate}
                </p>
              )}
            </div>
          </div>

          {/* Live Schedule Day Warning (Multan vs. Khangarh days) */}
          {scheduleWarning && (
            <div
              role="note"
              data-testid="schedule-mismatch-warning"
              className="flex items-start gap-3 rounded-xl border border-brand-rose bg-card-tint p-4 text-xs leading-relaxed text-ink sm:text-sm"
            >
              <Info
                className="mt-0.5 h-5 w-5 shrink-0 text-brand-plum"
                aria-hidden="true"
              />
              <span>{localize(scheduleWarning, locale)}</span>
            </div>
          )}

          {/* 5. Brief Reason + Mandatory Privacy Warning Box */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="reason"
                className="block text-sm font-semibold text-ink"
              >
                {t.bookingForm.reasonLabel}
              </label>
              <span className="text-xs text-ink-muted" dir="ltr">
                {reason.length}/300
              </span>
            </div>

            <div className="mt-2 flex items-start gap-2.5 rounded-xl border border-brand-rose bg-card-tint/80 p-3.5 text-xs leading-relaxed text-ink">
              <ShieldAlert
                className="mt-0.5 h-4 w-4 shrink-0 text-brand-plum"
                aria-hidden="true"
              />
              <p>
                <strong className="font-bold text-brand-plum">
                  {t.bookingForm.privacyWarningTitle}
                </strong>{" "}
                {t.bookingForm.privacyWarningBody}
              </p>
            </div>

            <textarea
              id="reason"
              name="reason"
              rows={3}
              maxLength={300}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t.bookingForm.reasonPlaceholder}
              aria-invalid={Boolean(fieldIssues.reason)}
              className="mt-2 block w-full rounded-xl border border-brand-rose bg-canvas px-4 py-3 text-base text-ink placeholder:text-ink-muted/60 focus:border-brand-plum focus:bg-white"
            />
            {fieldIssues.reason && (
              <p className="mt-1 text-xs font-medium text-brand-plum">
                {fieldIssues.reason}
              </p>
            )}
          </div>

          <input
            type="hidden"
            name="cfTurnstileToken"
            value={cfTurnstileToken}
          />

          <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={isSubmitting}
              data-testid="submit-appointment-btn"
              className="btn-primary w-full gap-2.5 sm:w-auto"
            >
              <CalendarCheck className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>
                {isSubmitting
                  ? t.bookingForm.submittingButton
                  : t.bookingForm.submitButton}
              </span>
            </button>

            <a
              href={buildWhatsAppUrl(undefined, locale)}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-tap inline-flex items-center justify-center gap-2 text-sm font-semibold text-brand-plum underline underline-offset-4 hover:text-brand-plum-hover"
            >
              <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{t.bookingForm.directWhatsappAlternative}</span>
            </a>
          </div>
        </form>
      )}
    </div>
  );
}
