"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  MessageCircle,
  Stethoscope
} from "lucide-react";
import { clinicalServices, type ServiceSlug } from "@/content/services";
import { buildWhatsAppUrl } from "@/content/site";
import { getMessages, localePath, localize, type Locale } from "@/i18n";

interface ServiceAccordionProps {
  locale: Locale;
  initialOpenSlug?: ServiceSlug;
}

export function ServiceAccordion({
  locale,
  initialOpenSlug = "antenatal-postnatal-care"
}: ServiceAccordionProps) {
  const t = getMessages(locale);
  const [openSlugs, setOpenSlugs] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const service of clinicalServices) {
      initial[service.slug] = service.slug === initialOpenSlug;
    }
    return initial;
  });

  function toggleSlug(slug: ServiceSlug) {
    setOpenSlugs((prev) => ({
      ...prev,
      [slug]: !prev[slug]
    }));
  }

  function expandOnlySlug(slug: ServiceSlug) {
    setOpenSlugs({
      "antenatal-postnatal-care": slug === "antenatal-postnatal-care",
      "infertility-family-planning": slug === "infertility-family-planning",
      "pcos-hormonal-health": slug === "pcos-hormonal-health",
      "general-gynecology": slug === "general-gynecology"
    });
  }

  return (
    <div className="space-y-8">
      {/* Quick Category Pill Tabs (48px+ tap targets) */}
      <div
        role="tablist"
        aria-label={t.services.pageHeading}
        className="flex flex-wrap gap-2.5"
      >
        {clinicalServices.map((service) => {
          const isOpen = Boolean(openSlugs[service.slug]);
          return (
            <button
              key={`tab-${service.slug}`}
              type="button"
              role="tab"
              aria-selected={isOpen}
              aria-controls={`panel-${service.slug}`}
              onClick={() => expandOnlySlug(service.slug)}
              className={`min-h-tap rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
                isOpen
                  ? "border-brand-plum bg-brand-plum text-white shadow-sm"
                  : "border-brand-rose bg-white text-brand-plum hover:bg-card-tint"
              }`}
            >
              {localize(service.title, locale)}
            </button>
          );
        })}
      </div>

      {/* Accessible ARIA Accordion Panels */}
      <div className="space-y-6">
        {clinicalServices.map((service) => {
          const isOpen = Boolean(openSlugs[service.slug]);
          const buttonId = `accordion-header-${service.slug}`;
          const panelId = `panel-${service.slug}`;
          const whatsappHref = buildWhatsAppUrl(
            localize(service.whatsappInquiryText, locale),
            locale
          );
          const detailHref = localePath(locale, `/services/${service.slug}`);

          return (
            <section
              key={service.slug}
              id={service.slug}
              aria-labelledby={buttonId}
              className="scroll-mt-24 overflow-hidden rounded-2xl border border-brand-rose bg-white shadow-card"
            >
              <h2 className="m-0">
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleSlug(service.slug)}
                  className="min-h-tap flex w-full items-center justify-between gap-4 bg-card-tint px-6 py-5 text-start transition-colors hover:bg-card-tint/80"
                >
                  <div>
                    <span className="block font-heading text-xl font-bold text-brand-plum sm:text-2xl">
                      {localize(service.title, locale)}
                    </span>
                    <span className="mt-1 block text-sm text-ink-muted">
                      {localize(service.shortDescription, locale)}
                    </span>
                  </div>
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-rose bg-white text-brand-plum"
                    aria-hidden="true"
                  >
                    <ChevronDown
                      className={`h-5 w-5 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </span>
                </button>
              </h2>

              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                hidden={!isOpen}
                className={isOpen ? "border-t border-brand-rose p-6 sm:p-8" : "hidden"}
              >
                <div className="space-y-8">
                  {/* 1. What It Is */}
                  <div>
                    <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-brand-plum">
                      <Stethoscope className="h-5 w-5 shrink-0" aria-hidden="true" />
                      <span>{t.services.whatItIs}</span>
                    </h3>
                    <p className="mt-2.5 text-base leading-relaxed text-ink">
                      {localize(service.whatItIs, locale)}
                    </p>
                  </div>

                  {/* Key Highlights */}
                  <div className="rounded-xl border border-brand-rose bg-canvas p-5">
                    <h3 className="font-heading text-base font-bold text-brand-plum">
                      {t.services.keyHighlights}
                    </h3>
                    <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
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
                  </div>

                  {/* 2. When to See a Doctor & 3. What to Expect */}
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="rounded-xl border border-brand-rose bg-card-tint/50 p-5">
                      <h3 className="font-heading text-lg font-bold text-brand-plum">
                        {t.services.whenToSeeDoctor}
                      </h3>
                      <ul className="mt-3 space-y-2.5 text-sm text-ink">
                        {service.whenToSeeDoctor.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span
                              className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-plum"
                              aria-hidden="true"
                            />
                            <span>{localize(item, locale)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-xl border border-brand-rose bg-card-tint/50 p-5">
                      <h3 className="font-heading text-lg font-bold text-brand-plum">
                        {t.services.whatToExpect}
                      </h3>
                      <ul className="mt-3 space-y-2.5 text-sm text-ink">
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
                    </div>
                  </div>

                  {/* Service FAQs */}
                  <div>
                    <h3 className="font-heading text-lg font-bold text-brand-plum">
                      {t.services.serviceFaqsHeading}
                    </h3>
                    <dl className="mt-3 space-y-3">
                      {service.faqs.map((faq) => (
                        <div
                          key={faq.id}
                          className="rounded-xl border border-brand-rose/70 bg-canvas p-4"
                        >
                          <dt className="font-heading text-base font-semibold text-brand-plum">
                            {localize(faq.question, locale)}
                          </dt>
                          <dd className="mt-1.5 text-sm leading-relaxed text-ink">
                            {localize(faq.answer, locale)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  {/* 4. Book / WhatsApp / Full Detail CTAs */}
                  <div className="flex flex-wrap items-center gap-3 border-t border-brand-rose/50 pt-5">
                    <Link
                      href={`${localePath(locale, "/contact")}#book-appointment`}
                      className="btn-primary gap-2 text-sm"
                    >
                      <CalendarCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>{t.services.bookThisService}</span>
                    </Link>

                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-whatsapp gap-2 text-sm"
                    >
                      <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>{t.services.askOnWhatsapp}</span>
                    </a>

                    <Link
                      href={detailHref}
                      className="btn-outline gap-2 text-sm"
                    >
                      <span>{t.services.viewDetailedPage}</span>
                      <ArrowRight
                        className="h-4 w-4 shrink-0 rtl:rotate-180"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
