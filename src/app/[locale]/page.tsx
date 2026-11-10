import React from "react";
import Link from "next/link";
import { ArrowRight, CalendarCheck, HelpCircle, Stethoscope } from "lucide-react";
import { homeFaqs } from "@/content/services";
import { siteConfig } from "@/content/site";
import { AppointmentForm } from "@/components/sections/AppointmentForm";
import { CoreFocusGrid } from "@/components/sections/CoreFocusGrid";
import { Hero } from "@/components/sections/Hero";
import { QuickInfoBar } from "@/components/sections/QuickInfoBar";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { JsonLd, buildFaqPageSchema } from "@/components/seo/JsonLd";
import {
  getMessages,
  localePath,
  localize,
  resolveLocale,
  type Locale
} from "@/i18n";

export default function HomePage({
  params
}: {
  params: { locale: string };
}) {
  const locale: Locale = resolveLocale(params.locale);
  const t = getMessages(locale);
  const faqSchema = buildFaqPageSchema(homeFaqs, locale);

  return (
    <div>
      {/* Home FAQPage JSON-LD */}
      <JsonLd data={faqSchema} />

      {/* 1. Hero Section */}
      <Hero locale={locale} />

      {/* 2. Quick Info Bar (Multan & Khangarh Locations + One-Tap Phone/WhatsApp) */}
      <QuickInfoBar locale={locale} />

      {/* 3. Core Health Focus Grid (5 Cards Linking to /services#[slug]) */}
      <CoreFocusGrid locale={locale} />

      {/* 4. Consent-Gated Testimonials Section (Renders null when all consent: false) */}
      <TestimonialsSection locale={locale} />

      {/* 5a. About Dr. Tooba Iqbal Teaser */}
      <section
        aria-labelledby="about-teaser-heading"
        className="border-y border-brand-rose/40 bg-card-tint/60 py-12 sm:py-16"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-brand-rose bg-white p-6 shadow-card sm:p-10">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-plum">
                  <Stethoscope className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{t.aboutTeaser.eyebrow}</span>
                </p>
                <h2
                  id="about-teaser-heading"
                  className="mt-2 font-heading text-2xl font-bold text-brand-plum sm:text-3xl"
                >
                  {t.aboutTeaser.heading}
                </h2>
                <p className="mt-1 text-sm font-medium text-ink-muted">
                  {t.aboutTeaser.subtitle}
                </p>
                <blockquote className="mt-4 border-s-4 border-brand-plum bg-card-tint/60 px-4 py-3 text-sm font-medium italic text-ink sm:text-base">
                  &ldquo;{localize(siteConfig.clinicalPhilosophy, locale)}&rdquo;
                </blockquote>
                <p className="mt-4 text-sm leading-relaxed text-ink sm:text-base">
                  {localize(siteConfig.bioSummary, locale)}
                </p>
              </div>

              <div className="flex flex-col gap-3 lg:col-span-4">
                <Link
                  href={localePath(locale, "/about")}
                  className="btn-outline w-full gap-2"
                >
                  <span>{t.aboutTeaser.readMoreCta}</span>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 rtl:rotate-180"
                    aria-hidden="true"
                  />
                </Link>

                <a
                  href="#book-appointment"
                  className="btn-primary w-full gap-2"
                >
                  <CalendarCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{t.aboutTeaser.bookWithDoctor}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5b. Key FAQs Section */}
      <section
        aria-labelledby="home-faq-heading"
        className="py-12 sm:py-16"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-plum">
              <HelpCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{t.faq.eyebrow}</span>
            </p>
            <h2
              id="home-faq-heading"
              className="mt-2 font-heading text-2xl font-bold text-brand-plum sm:text-3xl"
            >
              {t.faq.heading}
            </h2>
            <p className="mt-2 text-sm text-ink-muted sm:text-base">
              {t.faq.subheading}
            </p>
          </div>

          <dl className="mt-8 space-y-4">
            {homeFaqs.map((faq) => (
              <div
                key={faq.id}
                className="rounded-2xl border border-brand-rose bg-white p-6 shadow-sm"
              >
                <dt className="font-heading text-lg font-bold text-brand-plum">
                  {localize(faq.question, locale)}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink sm:text-base">
                  {localize(faq.answer, locale)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 5c. Embedded Appointment Booking Section (`#book-appointment`) */}
      <section
        id="book-appointment"
        aria-label={t.bookingForm.heading}
        className="scroll-mt-20 border-t border-brand-rose/40 bg-card-tint/50 py-12 sm:py-16 lg:py-20"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <AppointmentForm locale={locale} />
        </div>
      </section>
    </div>
  );
}
