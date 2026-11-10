import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Award,
  CalendarCheck,
  CheckCircle2,
  GraduationCap,
  HeartHandshake,
  MessageCircle,
  ShieldCheck
} from "lucide-react";
import { env } from "@/env";
import { buildWhatsAppUrl, siteConfig } from "@/content/site";
import { ClinicCards } from "@/components/sections/ClinicCards";
import { JsonLd, buildBreadcrumbSchema } from "@/components/seo/JsonLd";
import {
  getMessages,
  localePath,
  localize,
  resolveLocale,
  type Locale
} from "@/i18n";

export function generateMetadata({
  params
}: {
  params: { locale: string };
}): Metadata {
  const locale = resolveLocale(params.locale);
  const t = getMessages(locale);
  const baseUrl = env.NEXT_PUBLIC_SITE_URL;

  return {
    title: t.about.pageHeading,
    description: t.about.pageSubheading,
    alternates: {
      canonical: `${baseUrl}/${locale}/about`,
      languages: {
        en: `${baseUrl}/en/about`,
        ur: `${baseUrl}/ur/about`
      }
    }
  };
}

export default function AboutPage({
  params
}: {
  params: { locale: string };
}) {
  const locale: Locale = resolveLocale(params.locale);
  const t = getMessages(locale);
  const whatsappHref = buildWhatsAppUrl(undefined, locale);

  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: t.nav.home, path: `/${locale}` },
      { name: t.nav.about, path: `/${locale}/about` }
    ],
    locale
  );

  return (
    <div className="py-10 sm:py-14 lg:py-16">
      <JsonLd data={breadcrumbSchema} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Profile Header Section */}
        <div className="overflow-hidden rounded-3xl border-2 border-brand-rose bg-white p-6 shadow-card sm:p-10">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="mx-auto w-full max-w-sm lg:col-span-4">
              <div className="overflow-hidden rounded-2xl border border-brand-rose bg-card-tint p-3">
                <Image
                  src="/images/doctor-placeholder.svg"
                  alt={t.hero.imageAlt}
                  width={560}
                  height={620}
                  unoptimized
                  className="h-auto w-full rounded-xl"
                />
              </div>
            </div>

            <div className="lg:col-span-8">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-plum">
                {t.about.pageEyebrow}
              </p>
              <h1 className="mt-2 font-heading text-3xl font-bold text-brand-plum sm:text-4xl">
                {t.about.pageHeading}
              </h1>
              <p className="mt-2 text-lg font-medium text-ink-muted">
                {localize(siteConfig.title, locale)} •{" "}
                {localize(siteConfig.primaryPracticeAreas, locale)}
              </p>

              {/* PMDC Registration Verification Badge */}
              <div className="mt-4 inline-flex flex-wrap items-center gap-2 rounded-xl border border-brand-rose bg-card-tint px-4 py-2.5 text-xs font-semibold text-brand-plum sm:text-sm">
                <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{t.about.pmdcBadgeLabel}:</span>
                <span className="font-mono">{siteConfig.pmdcRegistrationNumber}</span>
              </div>

              {/* Clinical Philosophy Box */}
              <div className="mt-6 rounded-2xl border border-brand-rose bg-canvas p-5">
                <h2 className="flex items-center gap-2 font-heading text-base font-bold text-brand-plum">
                  <HeartHandshake
                    className="h-5 w-5 shrink-0"
                    aria-hidden="true"
                  />
                  <span>{t.about.philosophyHeading}</span>
                </h2>
                <blockquote className="mt-2 text-base font-medium italic text-ink">
                  &ldquo;{localize(siteConfig.clinicalPhilosophy, locale)}&rdquo;
                </blockquote>
              </div>

              {/* Detailed Biography Paragraphs */}
              <div className="mt-6 space-y-3.5 text-sm leading-relaxed text-ink sm:text-base">
                <h2 className="font-heading text-lg font-bold text-brand-plum">
                  {t.about.biographyHeading}
                </h2>
                {siteConfig.bioDetailed.map((paragraph, idx) => (
                  <p key={idx}>{localize(paragraph, locale)}</p>
                ))}
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Link
                  href={`${localePath(locale, "/contact")}#book-appointment`}
                  className="btn-primary gap-2"
                >
                  <CalendarCheck className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span>{t.nav.bookAppointment}</span>
                </Link>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp gap-2"
                >
                  <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span>{t.nav.whatsappCta}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Qualifications & Memberships Grid */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Qualifications Timeline */}
          <section
            aria-labelledby="qualifications-heading"
            className="rounded-3xl border border-brand-rose bg-white p-6 shadow-card sm:p-8"
          >
            <h2
              id="qualifications-heading"
              className="flex items-center gap-2.5 font-heading text-xl font-bold text-brand-plum sm:text-2xl"
            >
              <GraduationCap className="h-6 w-6 shrink-0" aria-hidden="true" />
              <span>{t.about.qualificationsHeading}</span>
            </h2>

            <div className="mt-6 space-y-5">
              {siteConfig.qualifications.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-brand-rose/70 bg-card-tint/50 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-heading text-lg font-bold text-brand-plum">
                      {localize(item.degree, locale)}
                    </h3>
                    <span className="rounded-full border border-brand-rose bg-white px-3 py-1 text-xs font-semibold text-ink-muted">
                      {item.year}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-ink">
                    {localize(item.institution, locale)}
                  </p>
                  <p className="mt-1.5 text-xs text-ink-muted">
                    {localize(item.note, locale)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Professional Memberships & Regulatory Status */}
          <section
            aria-labelledby="memberships-heading"
            className="rounded-3xl border border-brand-rose bg-white p-6 shadow-card sm:p-8"
          >
            <h2
              id="memberships-heading"
              className="flex items-center gap-2.5 font-heading text-xl font-bold text-brand-plum sm:text-2xl"
            >
              <Award className="h-6 w-6 shrink-0" aria-hidden="true" />
              <span>{t.about.membershipsHeading}</span>
            </h2>

            <ul className="mt-6 space-y-4">
              {siteConfig.memberships.map((membership, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 rounded-2xl border border-brand-rose/70 bg-card-tint/50 p-4 text-sm font-medium text-ink"
                >
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-brand-plum"
                    aria-hidden="true"
                  />
                  <span>{localize(membership, locale)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-2xl border border-brand-rose bg-canvas p-4 text-xs leading-relaxed text-ink-muted">
              <p className="font-semibold text-brand-plum">
                {siteConfig.pmdcRegistrationNumber}
              </p>
              <p className="mt-1">
                {localize(siteConfig.pmdcVerificationNote, locale)}
              </p>
            </div>
          </section>
        </div>

        {/* Clinic Locations Summary */}
        <section
          aria-labelledby="about-locations-heading"
          className="mt-12"
        >
          <h2
            id="about-locations-heading"
            className="mb-6 font-heading text-2xl font-bold text-brand-plum sm:text-3xl"
          >
            {t.about.practiceLocationsHeading}
          </h2>
          <ClinicCards
            locale={locale}
            showMapEmbeds={false}
            bookingAnchorHref={`${localePath(locale, "/contact")}#book-appointment`}
          />
        </section>
      </div>
    </div>
  );
}
