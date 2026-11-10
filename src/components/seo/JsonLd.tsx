import React from "react";
import { headers } from "next/headers";
import { env } from "@/env";
import { clinicLocations } from "@/content/locations";
import { type FaqItem } from "@/content/services";
import { siteConfig } from "@/content/site";
import { localize, type Locale } from "@/i18n";

export interface BreadcrumbEntry {
  name: string;
  path: string;
}

/**
 * Serializes a JSON-LD object safely, escaping `<` as `\u003c`, `>` as `\u003e`,
 * and `&` as `\u0026` to prevent script tag breakout.
 */
export function safeJsonLdStringify(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

/**
 * Builds the `Physician` and two `MedicalClinic` (Multan & Khangarh) JSON-LD graph
 * for Dr. Tooba Iqbal (MBBS, MCPS).
 */
export function buildPhysicianAndClinicsSchema(locale: Locale = "en") {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL;
  const localeBaseUrl = `${siteUrl}/${locale}`;

  const clinicEntities = clinicLocations.map((loc) => ({
    "@type": "MedicalClinic",
    "@id": `${siteUrl}/#clinic-${loc.id}`,
    name: localize(loc.name, locale),
    url: `${localeBaseUrl}/contact#${loc.id}`,
    telephone: loc.phoneE164,
    medicalSpecialty: ["Gynecologic", "Obstetric"],
    address: {
      "@type": "PostalAddress",
      streetAddress: loc.streetAddress,
      addressLocality: loc.addressLocality,
      addressRegion: loc.addressRegion,
      postalCode: loc.postalCode,
      addressCountry: loc.addressCountry
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: loc.geo.latitude,
      longitude: loc.geo.longitude
    },
    openingHoursSpecification: loc.openingHoursSpecification.map((spec) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: spec.dayOfWeek,
      opens: spec.opens,
      closes: spec.closes
    }))
  }));

  const physicianEntity = {
    "@type": "Physician",
    "@id": `${siteUrl}/#physician`,
    name: `${localize(siteConfig.doctorName, locale)} (${siteConfig.credentials})`,
    jobTitle: localize(siteConfig.title, locale),
    description: localize(siteConfig.bioSummary, locale),
    url: localeBaseUrl,
    image: `${siteUrl}/images/doctor-placeholder.svg`,
    telephone: siteConfig.whatsappNumberE164,
    medicalSpecialty: ["Gynecologic", "Obstetric"],
    knowsLanguage: ["en", "ur"],
    sameAs: [
      siteConfig.socials.instagram.url,
      siteConfig.socials.facebook.url
    ],
    workLocation: clinicEntities.map((clinic) => ({
      "@id": clinic["@id"]
    }))
  };

  return {
    "@context": "https://schema.org",
    "@graph": [physicianEntity, ...clinicEntities]
  };
}

/**
 * Builds a `FAQPage` JSON-LD schema from localized FAQ items.
 */
export function buildFaqPageSchema(faqs: FaqItem[], locale: Locale = "en") {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: localize(faq.question, locale),
      acceptedAnswer: {
        "@type": "Answer",
        text: localize(faq.answer, locale)
      }
    }))
  };
}

/**
 * Builds a `BreadcrumbList` JSON-LD schema for interior pages.
 */
export function buildBreadcrumbSchema(
  items: BreadcrumbEntry[],
  locale: Locale = "en"
) {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => {
      const normalizedPath = item.path.startsWith("/")
        ? item.path
        : `/${item.path}`;
      const fullUrl =
        normalizedPath === `/${locale}` || normalizedPath.startsWith(`/${locale}/`)
          ? `${siteUrl}${normalizedPath}`
          : `${siteUrl}/${locale}${normalizedPath === "/" ? "" : normalizedPath}`;

      return {
        "@type": "ListItem",
        position: idx + 1,
        name: item.name,
        item: fullUrl
      };
    })
  };
}

interface JsonLdProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
  nonce?: string;
}

/**
 * Nonce-aware JSON-LD `<script type="application/ld+json">` component.
 * Automatically reads the per-request `x-nonce` header from Middleware if not passed explicitly.
 */
export function JsonLd({ data, nonce }: JsonLdProps) {
  let resolvedNonce = nonce;
  if (!resolvedNonce) {
    try {
      resolvedNonce = headers().get("x-nonce") ?? undefined;
    } catch {
      resolvedNonce = undefined;
    }
  }

  const serialized = safeJsonLdStringify(data);

  return (
    <script
      type="application/ld+json"
      nonce={resolvedNonce}
      dangerouslySetInnerHTML={{ __html: serialized }}
    />
  );
}
