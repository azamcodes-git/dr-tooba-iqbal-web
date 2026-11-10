import React from "react";
import type { Metadata } from "next";
import { env } from "@/env";
import { getAllServicesFaqs } from "@/content/services";
import { ServiceAccordion } from "@/components/sections/ServiceAccordion";
import {
  JsonLd,
  buildBreadcrumbSchema,
  buildFaqPageSchema
} from "@/components/seo/JsonLd";
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
    title: t.services.pageHeading,
    description: t.services.pageSubheading,
    alternates: {
      canonical: `${baseUrl}/${locale}/services`,
      languages: {
        en: `${baseUrl}/en/services`,
        ur: `${baseUrl}/ur/services`
      }
    }
  };
}

export default function ServicesPage({
  params
}: {
  params: { locale: string };
}) {
  const locale: Locale = resolveLocale(params.locale);
  const t = getMessages(locale);

  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: t.nav.home, path: `/${locale}` },
      { name: t.nav.services, path: `/${locale}/services` }
    ],
    locale
  );

  const faqSchema = buildFaqPageSchema(getAllServicesFaqs(), locale);

  return (
    <div className="py-10 sm:py-14 lg:py-16">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-plum">
            {t.services.pageEyebrow}
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-brand-plum sm:text-4xl">
            {t.services.pageHeading}
          </h1>
          <p className="mt-3 text-base text-ink-muted sm:text-lg">
            {t.services.pageSubheading}
          </p>
        </div>

        <ServiceAccordion locale={locale} />
      </div>
    </div>
  );
}
