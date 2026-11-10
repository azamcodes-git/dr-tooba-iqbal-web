import type { MetadataRoute } from "next";
import { env } from "@/env";
import { clinicalServices } from "@/content/services";
import { locales } from "@/i18n";

const BLOG_SLUGS = [
  "turning-30-reproductive-health",
  "uti-prevention-and-care",
  "pregnancy-cramps-vs-labour",
  "understanding-pcos-hormonal-balance"
] as const;

const STATIC_ROUTES = [
  "",
  "/about",
  "/services",
  "/contact",
  "/blog",
  "/privacy",
  "/disclaimer"
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = env.NEXT_PUBLIC_SITE_URL;
  const lastModified = new Date("2026-11-06T00:00:00.000Z");

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of STATIC_ROUTES) {
      const url = `${baseUrl}/${locale}${route}`;
      entries.push({
        url,
        lastModified,
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1.0 : route === "/services" || route === "/contact" ? 0.9 : 0.7,
        alternates: {
          languages: {
            en: `${baseUrl}/en${route}`,
            ur: `${baseUrl}/ur${route}`
          }
        }
      });
    }

    for (const service of clinicalServices) {
      const route = `/services/${service.slug}`;
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.85,
        alternates: {
          languages: {
            en: `${baseUrl}/en${route}`,
            ur: `${baseUrl}/ur${route}`
          }
        }
      });
    }

    for (const blogSlug of BLOG_SLUGS) {
      const route = `/blog/${blogSlug}`;
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.75,
        alternates: {
          languages: {
            en: `${baseUrl}/en${route}`,
            ur: `${baseUrl}/ur${route}`
          }
        }
      });
    }
  }

  return entries;
}
