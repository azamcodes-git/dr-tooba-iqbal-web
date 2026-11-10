import React from "react";
import { Quote } from "lucide-react";
import {
  testimonials as defaultTestimonials,
  type PatientTestimonial
} from "@/content/testimonials";
import { getMessages, localize, type Locale } from "@/i18n";

interface TestimonialsSectionProps {
  locale: Locale;
  entries?: PatientTestimonial[];
}

/**
 * Consent-Gated Patient Testimonials Section (`src/components/sections/TestimonialsSection.tsx`)
 *
 * Strictly filters entries by `entry.consent === true`.
 * Because all entries in `/content/testimonials.ts` ship with `consent: false` by default,
 * this component returns `null` (renders nothing) until written patient consent is obtained.
 */
export function TestimonialsSection({
  locale,
  entries = defaultTestimonials
}: TestimonialsSectionProps) {
  const consentedEntries = entries.filter((entry) => entry.consent === true);

  if (consentedEntries.length === 0) {
    return null;
  }

  const t = getMessages(locale);

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="border-t border-brand-rose/40 bg-card-tint/40 py-12 sm:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-brand-plum">
            {t.testimonials.eyebrow}
          </p>
          <h2
            id="testimonials-heading"
            className="mt-2 font-heading text-2xl font-bold text-brand-plum sm:text-3xl"
          >
            {t.testimonials.heading}
          </h2>
          <p className="mt-2 text-sm text-ink-muted">
            {t.testimonials.subheading}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {consentedEntries.map((item) => (
            <blockquote
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-brand-rose bg-white p-6 shadow-card"
            >
              <div>
                <Quote
                  className="h-8 w-8 text-brand-plum/30"
                  aria-hidden="true"
                />
                <p className="mt-4 text-sm leading-relaxed text-ink">
                  &ldquo;{localize(item.quote, locale)}&rdquo;
                </p>
              </div>
              <footer className="mt-6 border-t border-brand-rose/40 pt-3 text-xs font-semibold text-brand-plum">
                <span>{localize(item.categoryLabel, locale)}</span>
                <span className="mx-1.5 text-ink-muted">•</span>
                <span className="text-ink-muted">
                  {localize(item.cityLabel, locale)}
                </span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
