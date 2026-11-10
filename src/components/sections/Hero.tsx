import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, MessageCircle, ShieldCheck, MapPin, Stethoscope } from "lucide-react";
import { buildWhatsAppUrl, siteConfig } from "@/content/site";
import { getMessages, localePath, type Locale } from "@/i18n";

interface HeroProps {
  locale: Locale;
}

export function Hero({ locale }: HeroProps) {
  const t = getMessages(locale);
  const whatsappHref = buildWhatsAppUrl(undefined, locale);

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-brand-rose/40 bg-gradient-to-b from-card-tint/80 via-canvas to-canvas py-10 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Text & CTAs Column */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-rose bg-white px-4 py-1.5 text-sm font-medium text-brand-plum shadow-sm">
              <Stethoscope className="h-4 w-4 shrink-0 text-brand-plum" aria-hidden="true" />
              <span>{t.hero.badge}</span>
            </div>

            <h1
              id="hero-heading"
              className="mt-5 font-heading text-3xl font-bold tracking-tight text-brand-plum sm:text-4xl lg:text-5xl lg:leading-[1.18]"
            >
              {t.hero.heading}
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-ink sm:text-xl">
              {t.hero.subheading}
            </p>

            {/* Primary & Secondary CTAs (48px+ tap targets & WCAG AAA WhatsApp contrast) */}
            <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
              <a
                href="#book-appointment"
                className="btn-primary gap-2.5 text-center"
              >
                <CalendarCheck className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span>{t.hero.primaryCta}</span>
              </a>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp gap-2.5 text-center"
              >
                <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span>{t.hero.secondaryCta}</span>
              </a>
            </div>

            {/* Clinical Trust Signals */}
            <ul className="mt-8 grid grid-cols-1 gap-3 border-t border-brand-rose/40 pt-6 text-sm text-ink-muted sm:grid-cols-3">
              <li className="flex items-start gap-2.5">
                <ShieldCheck
                  className="mt-0.5 h-5 w-5 shrink-0 text-brand-plum"
                  aria-hidden="true"
                />
                <span>{t.hero.trustPoints.confidential}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin
                  className="mt-0.5 h-5 w-5 shrink-0 text-brand-plum"
                  aria-hidden="true"
                />
                <span>{t.hero.trustPoints.locations}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Stethoscope
                  className="mt-0.5 h-5 w-5 shrink-0 text-brand-plum"
                  aria-hidden="true"
                />
                <span>{t.hero.trustPoints.evidenceBased}</span>
              </li>
            </ul>
          </div>

          {/* Clinical Portrait Illustration Column (Priority LCP) */}
          <div className="mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
            <div className="relative overflow-hidden rounded-3xl border-2 border-brand-rose bg-white p-3 shadow-card">
              <Image
                src="/images/doctor-placeholder.svg"
                alt={t.hero.imageAlt}
                width={560}
                height={620}
                priority
                unoptimized
                className="h-auto w-full rounded-2xl"
              />
              <div className="mt-3 flex items-center justify-between rounded-xl bg-card-tint px-4 py-3 text-xs font-medium text-ink">
                <span>
                  {locale === "ur"
                    ? `${siteConfig.doctorName.ur} (${siteConfig.credentials})`
                    : `${siteConfig.doctorName.en} (${siteConfig.credentials})`}
                </span>
                <Link
                  href={localePath(locale, "/about")}
                  className="font-semibold text-brand-plum underline underline-offset-4 hover:text-brand-plum-hover"
                >
                  {locale === "ur" ? "مکمل تعارف" : "View Profile"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
