import React from "react";
import Link from "next/link";
import { Clock, MapPin, Phone, MessageCircle } from "lucide-react";
import { clinicLocations } from "@/content/locations";
import { getMessages, localePath, localize, type Locale } from "@/i18n";

interface QuickInfoBarProps {
  locale: Locale;
}

export function QuickInfoBar({ locale }: QuickInfoBarProps) {
  const t = getMessages(locale);

  return (
    <section
      aria-label={t.quickInfo.sectionLabel}
      className="border-b border-brand-rose/40 bg-white py-6 shadow-sm"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
          {clinicLocations.map((clinic) => (
            <div
              key={clinic.id}
              className="flex flex-col justify-between rounded-2xl border border-brand-rose bg-card-tint/60 p-5 transition-shadow hover:shadow-card sm:flex-row sm:items-center sm:gap-4"
            >
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-plum">
                  <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{localize(clinic.city, locale)}</span>
                </div>
                <h2 className="font-heading text-lg font-bold text-brand-plum">
                  {localize(clinic.name, locale)}
                </h2>
                <p className="text-sm text-ink">
                  {localize(clinic.address, locale)}
                </p>
                <p className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted">
                  <Clock className="h-4 w-4 shrink-0 text-brand-plum" aria-hidden="true" />
                  <span>
                    {localize(clinic.daysSummary, locale)} •{" "}
                    {localize(clinic.hoursSummary, locale)}
                  </span>
                </p>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2.5 sm:mt-0 sm: shrink-0 sm:flex-col sm:items-stretch">
                <a
                  href={clinic.phoneTel}
                  className="min-h-tap inline-flex items-center justify-center gap-2 rounded-xl bg-brand-plum px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-plum-hover"
                >
                  <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span dir="ltr">{clinic.phoneDisplay}</span>
                </a>

                <div className="flex items-center gap-2">
                  <a
                    href={clinic.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-tap inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-whatsapp px-3.5 py-2 text-xs font-bold text-whatsapp-ink transition-colors hover:bg-whatsapp-hover"
                  >
                    <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{t.quickInfo.whatsappNow}</span>
                  </a>

                  <Link
                    href={`${localePath(locale, "/contact")}#${clinic.id}`}
                    className="min-h-tap inline-flex flex-1 items-center justify-center rounded-xl border border-brand-plum bg-white px-3.5 py-2 text-xs font-semibold text-brand-plum transition-colors hover:bg-card-tint"
                  >
                    {t.quickInfo.viewMap}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
