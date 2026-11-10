import React from "react";
import type { Metadata } from "next";
import { env } from "@/env";
import { AppointmentForm } from "@/components/sections/AppointmentForm";
import { ClinicCards } from "@/components/sections/ClinicCards";
import { JsonLd, buildBreadcrumbSchema } from "@/components/seo/JsonLd";
import { getMessages, resolveLocale, type Locale } from "@/i18n";

export function generateMetadata({
  params
}: {
  params: { locale: string };
}): Metadata {
  const locale = resolveLocale(params.locale);
  const t = getMessages(locale);
  const baseUrl = env.NEXT_PUBLIC_SITE_URL;

  return {
    title: t.clinics.heading,
    description: t.clinics.subheading,
    alternates: {
      canonical: `${baseUrl}/${locale}/contact`,
      languages: {
        en: `${baseUrl}/en/contact`,
        ur: `${baseUrl}/ur/contact`
      }
    }
  };
}

export default function ContactPage({
  params
}: {
  params: { locale: string };
}) {
  const locale: Locale = resolveLocale(params.locale);
  const t = getMessages(locale);

  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: t.nav.home, path: `/${locale}` },
      { name: t.nav.contact, path: `/${locale}/contact` }
    ],
    locale
  );

  return (
    <div className="py-10 sm:py-14 lg:py-16">
      <JsonLd data={breadcrumbSchema} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-plum">
            {t.clinics.eyebrow}
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-brand-plum sm:text-4xl">
            {t.clinics.heading}
          </h1>
          <p className="mt-3 text-base text-ink-muted sm:text-lg">
            {t.clinics.subheading}
          </p>
        </div>

        {/* Multan & Khangarh Side-by-Side Clinic Cards with Lazy Google Maps */}
        <ClinicCards
          locale={locale}
          showMapEmbeds={true}
          bookingAnchorHref="#book-appointment"
        />

        {/* Embedded Appointment Request Form */}
        <section
          id="book-appointment"
          aria-label={t.bookingForm.heading}
          className="mt-14 scroll-mt-24"
        >
          <div className="mx-auto max-w-4xl">
            <AppointmentForm locale={locale} />
          </div>
        </section>
      </div>
    </div>
  );
}
