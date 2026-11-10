import React from "react";
import {
  CalendarCheck,
  Clock,
  ExternalLink,
  MapPin,
  MessageCircle,
  Phone
} from "lucide-react";
import { clinicLocations } from "@/content/locations";
import { getMessages, localize, type Locale } from "@/i18n";

interface ClinicCardsProps {
  locale: Locale;
  showMapEmbeds?: boolean;
  bookingAnchorHref?: string;
}

export function ClinicCards({
  locale,
  showMapEmbeds = true,
  bookingAnchorHref = "#book-appointment"
}: ClinicCardsProps) {
  const t = getMessages(locale);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {clinicLocations.map((clinic) => (
        <article
          key={clinic.id}
          id={clinic.id}
          className="scroll-mt-24 flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-brand-rose bg-white shadow-card"
        >
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-rose bg-card-tint px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-plum">
                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{localize(clinic.city, locale)}</span>
              </span>
              <span className="rounded-full bg-brand-plum px-3.5 py-1 text-xs font-semibold text-white">
                {localize(clinic.daysSummary, locale)}
              </span>
            </div>

            <h2 className="mt-4 font-heading text-2xl font-bold text-brand-plum">
              {localize(clinic.name, locale)}
            </h2>

            <dl className="mt-6 space-y-4 text-sm">
              <div className="flex items-start gap-3 rounded-xl bg-card-tint/60 p-4">
                <MapPin
                  className="mt-0.5 h-5 w-5 shrink-0 text-brand-plum"
                  aria-hidden="true"
                />
                <div>
                  <dt className="font-semibold text-brand-plum">
                    {t.clinics.addressLabel}
                  </dt>
                  <dd className="mt-1 text-ink">
                    {localize(clinic.address, locale)}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-card-tint/60 p-4">
                <Clock
                  className="mt-0.5 h-5 w-5 shrink-0 text-brand-plum"
                  aria-hidden="true"
                />
                <div>
                  <dt className="font-semibold text-brand-plum">
                    {t.clinics.timingsLabel}
                  </dt>
                  <dd className="mt-1 font-medium text-ink">
                    {localize(clinic.timings, locale)}
                  </dd>
                  <dd className="mt-0.5 text-xs text-ink-muted">
                    {localize(clinic.hoursSummary, locale)}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-card-tint/60 p-4">
                <Phone
                  className="mt-0.5 h-5 w-5 shrink-0 text-brand-plum"
                  aria-hidden="true"
                />
                <div>
                  <dt className="font-semibold text-brand-plum">
                    {t.clinics.phoneLabel}
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={clinic.phoneTel}
                      dir="ltr"
                      className="font-heading text-base font-bold text-brand-plum underline underline-offset-4 hover:text-brand-plum-hover"
                    >
                      {clinic.phoneDisplay}
                    </a>
                  </dd>
                </div>
              </div>
            </dl>

            {/* Action Buttons (48px+ tap targets) */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <a
                href={clinic.phoneTel}
                className="btn-primary gap-2 text-sm"
              >
                <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  {t.clinics.callButton} ({clinic.phoneDisplay})
                </span>
              </a>

              <a
                href={clinic.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp gap-2 text-sm"
              >
                <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{t.clinics.whatsappButton}</span>
              </a>

              <a
                href={bookingAnchorHref}
                className="btn-outline gap-2 text-sm"
              >
                <CalendarCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{t.clinics.bookAtLocation}</span>
              </a>

              <a
                href={clinic.mapDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-tap inline-flex items-center justify-center gap-2 rounded-xl border border-brand-rose bg-canvas px-4 py-3 text-sm font-semibold text-ink transition-colors hover:bg-card-tint"
              >
                <span>{t.clinics.directionsButton}</span>
                <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Lazy-Loaded Google Maps Iframe */}
          {showMapEmbeds && (
            <div className="border-t border-brand-rose bg-card-tint">
              <iframe
                src={clinic.mapEmbedUrl}
                title={localize(clinic.mapTitle, locale)}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-64 w-full border-0"
                allowFullScreen={false}
              />
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
