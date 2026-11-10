import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarCheck,
  CheckCircle2,
  MessageCircle,
  Stethoscope
} from "lucide-react";
import { env } from "@/env";
import { clinicalServices, getServiceBySlug } from "@/content/services";
import { buildWhatsAppUrl } from "@/content/site";
import { AppointmentForm } from "@/components/sections/AppointmentForm";
import {
  JsonLd,
  buildBreadcrumbSchema,
  buildFaqPageSchema
} from "@/components/seo/JsonLd";
import {
  getMessages,
  localePath,
  locales,
  localize,
  resolveLocale,
  type Locale
} from "@/i18n";

export function generateStaticParams() {
  const params: Array<{ locale: string; slug: string }> = [];
  for (const locale of locales) {
    for (const service of clinicalServices) {
      params.push({ locale, slug: service.slug });
    }
  }
  return params;
}

export function generateMetadata({
  params
}: {
  params: { locale: string; slug: string };
}): Metadata {
  const locale = resolveLocale(params.locale);
  const service = getServiceBySlug(params.slug);
  if (!service) {
    return {};
  }

  const baseUrl = env.NEXT_PUBLIC_SITE_URL;

  return {
    title: localize(service.seoTitle, locale),
    description: localize(service.seoDescription, locale),
    alternates: {
      canonical: `${baseUrl}/${locale}/services/${service.slug}`,
      languages: {
        en: `${baseUrl}/en/services/${service.slug}`,
        ur: `${baseUrl}/ur/services/${service.slug}`
      }
    }
  };
}

export default function ServiceDetailPage({
  params
}: {
  params: { locale: string; slug: string };
}) {
  const locale: Locale = resolveLocale(params.locale);
  const service = getServiceBySlug(params.slug);

  if (!service) {
    notFound();
  }

  const t = getMessages(locale);
  const whatsappHref = buildWhatsAppUrl(
    localize(service.whatsappInquiryText, locale),
    locale
  );

  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: t.nav.home, path: `/${locale}` },
      { name: t.nav.services, path: `/${locale}/services` },
      {
        name: localize(service.title, locale),
        path: `/${locale}/services/${service.slug}`
      }
    ],
    locale
  );

  const faqSchema = buildFaqPageSchema(service.faqs, locale);

  return (
    <div className="py-10 sm:py-14 lg:py-16">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Link
          href={localePath(locale, "/services")}
          className="min-h-tap inline-flex items-center gap-2 text-sm font-semibold text-brand-plum hover:underline"
        >
          <ArrowLeft
            className="h-4 w-4 shrink-0 rtl:rotate-180"
            aria-hidden="true"
          />
          <span>{t.services.backToServices}</span>
        </Link>

        <article className="mt-4 overflow-hidden rounded-3xl border-2 border-brand-rose bg-white p-6 shadow-card sm:p-10">
          <header className="border-b border-brand-rose/50 pb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-plum">
              {t.services.pageEyebrow}
            </p>
            <h1 className="mt-2 font-heading text-3xl font-bold text-brand-plum sm:text-4xl">
              {localize(service.title, locale)}
            </h1>
            <p className="mt-3 text-base text-ink-muted sm:text-lg">
              {localize(service.subtitle, locale)}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a href="#book-appointment" className="btn-primary gap-2 text-sm">
                <CalendarCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{t.services.bookThisService}</span>
              </a>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp gap-2 text-sm"
              >
                <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{t.services.askOnWhatsapp}</span>
              </a>
            </div>
          </header>

          <div className="mt-8 space-y-8">
            {/* 1. What It Is */}
            <section aria-labelledby="detail-what-it-is">
              <h2
                id="detail-what-it-is"
                className="flex items-center gap-2 font-heading text-xl font-bold text-brand-plum"
              >
                <Stethoscope className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span>{t.services.whatItIs}</span>
              </h2>
              <p className="mt-3 text-base leading-relaxed text-ink">
                {localize(service.whatItIs, locale)}
              </p>
            </section>

            {/* Key Highlights */}
            <section
              aria-labelledby="detail-highlights"
              className="rounded-2xl border border-brand-rose bg-canvas p-6"
            >
              <h2
                id="detail-highlights"
                className="font-heading text-lg font-bold text-brand-plum"
              >
                {t.services.keyHighlights}
              </h2>
              <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {service.keyHighlights.map((highlight, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-sm font-medium text-ink"
                  >
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-brand-plum"
                      aria-hidden="true"
                    />
                    <span>{localize(highlight, locale)}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 2. When to See a Doctor & 3. What to Expect */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <section
                aria-labelledby="detail-when-to-see"
                className="rounded-2xl border border-brand-rose bg-card-tint/60 p-6"
              >
                <h2
                  id="detail-when-to-see"
                  className="font-heading text-xl font-bold text-brand-plum"
                >
                  {t.services.whenToSeeDoctor}
                </h2>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink">
                  {service.whenToSeeDoctor.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span
                        className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-plum"
                        aria-hidden="true"
                      />
                      <span>{localize(item, locale)}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section
                aria-labelledby="detail-what-to-expect"
                className="rounded-2xl border border-brand-rose bg-card-tint/60 p-6"
              >
                <h2
                  id="detail-what-to-expect"
                  className="font-heading text-xl font-bold text-brand-plum"
                >
                  {t.services.whatToExpect}
                </h2>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink">
                  {service.whatToExpect.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-brand-plum"
                        aria-hidden="true"
                      />
                      <span>{localize(item, locale)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Service FAQs */}
            <section aria-labelledby="detail-service-faqs">
              <h2
                id="detail-service-faqs"
                className="font-heading text-xl font-bold text-brand-plum"
              >
                {t.services.serviceFaqsHeading}
              </h2>
              <dl className="mt-4 space-y-4">
                {service.faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="rounded-2xl border border-brand-rose bg-canvas p-5"
                  >
                    <dt className="font-heading text-base font-bold text-brand-plum">
                      {localize(faq.question, locale)}
                    </dt>
                    <dd className="mt-2 text-sm leading-relaxed text-ink">
                      {localize(faq.answer, locale)}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </article>

        {/* Embedded Booking Section */}
        <section
          id="book-appointment"
          aria-label={t.bookingForm.heading}
          className="mt-12 scroll-mt-24"
        >
          <AppointmentForm locale={locale} />
        </section>
      </div>
    </div>
  );
}
