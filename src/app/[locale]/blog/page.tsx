import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Calendar, Clock, ShieldAlert } from "lucide-react";
import { env } from "@/env";
import { siteConfig } from "@/content/site";
import { JsonLd, buildBreadcrumbSchema } from "@/components/seo/JsonLd";
import {
  getMessages,
  localePath,
  localize,
  resolveLocale,
  type Locale
} from "@/i18n";
import { loadAllBlogPostsMeta } from "@/lib/blog";

export function generateMetadata({
  params
}: {
  params: { locale: string };
}): Metadata {
  const locale = resolveLocale(params.locale);
  const t = getMessages(locale);
  const baseUrl = env.NEXT_PUBLIC_SITE_URL;

  return {
    title: t.blog.heading,
    description: t.blog.subheading,
    alternates: {
      canonical: `${baseUrl}/${locale}/blog`,
      languages: {
        en: `${baseUrl}/en/blog`,
        ur: `${baseUrl}/ur/blog`
      }
    }
  };
}

export default function BlogIndexPage({
  params
}: {
  params: { locale: string };
}) {
  const locale: Locale = resolveLocale(params.locale);
  const t = getMessages(locale);
  const posts = loadAllBlogPostsMeta();

  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: t.nav.home, path: `/${locale}` },
      { name: t.nav.blog, path: `/${locale}/blog` }
    ],
    locale
  );

  return (
    <div className="py-10 sm:py-14 lg:py-16">
      <JsonLd data={breadcrumbSchema} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-plum">
            <BookOpen className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{t.blog.eyebrow}</span>
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-brand-plum sm:text-4xl">
            {t.blog.heading}
          </h1>
          <p className="mt-3 text-base text-ink-muted sm:text-lg">
            {t.blog.subheading}
          </p>
        </div>

        {/* Educational Medical Disclaimer Banner */}
        <div
          role="note"
          className="mt-8 flex items-start gap-3 rounded-2xl border border-brand-rose bg-card-tint p-5 text-xs leading-relaxed text-ink sm:text-sm"
        >
          <ShieldAlert
            className="mt-0.5 h-5 w-5 shrink-0 text-brand-plum"
            aria-hidden="true"
          />
          <div>
            <p className="font-bold text-brand-plum">
              {t.blog.educationalBannerTitle}
            </p>
            <p className="mt-1">
              {localize(siteConfig.educationalDisclaimer, locale)}
            </p>
          </div>
        </div>

        {/* Blog Cards Grid */}
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
          {posts.map((post) => {
            const postHref = localePath(locale, `/blog/${post.slug}`);
            const displayTitle = locale === "ur" ? post.titleUr : post.title;
            const displayExcerpt =
              locale === "ur" ? post.excerptUr : post.excerpt;
            const displayCategory =
              locale === "ur" ? post.categoryUr : post.category;

            return (
              <article
                key={post.slug}
                className="flex flex-col justify-between rounded-3xl border border-brand-rose bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover sm:p-8"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-full border border-brand-rose bg-card-tint px-3.5 py-1 text-xs font-semibold text-brand-plum">
                      {displayCategory}
                    </span>
                    <span className="rounded-md border border-brand-rose/80 bg-canvas px-2.5 py-1 font-mono text-[11px] font-semibold text-ink-muted">
                      {post.approvalStatus}
                    </span>
                  </div>

                  <h2 className="mt-4 font-heading text-xl font-bold text-brand-plum sm:text-2xl">
                    <Link href={postHref} className="hover:underline">
                      {displayTitle}
                    </Link>
                  </h2>

                  <p className="mt-3 text-sm leading-relaxed text-ink sm:text-base">
                    {displayExcerpt}
                  </p>
                </div>

                <div className="mt-6 border-t border-brand-rose/50 pt-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-ink-muted">
                    <span className="font-semibold text-ink">
                      {t.blog.authorPrefix} {post.author}
                    </span>
                    <span className="inline-flex items-center gap-3">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>
                          {t.blog.lastReviewedLabel}: {post.lastReviewed}
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>
                          {post.readingTimeMinutes} {t.blog.readingTimeLabel}
                        </span>
                      </span>
                    </span>
                  </div>

                  <div className="mt-4">
                    <Link
                      href={postHref}
                      className="btn-primary w-full gap-2 text-sm sm:w-auto"
                    >
                      <span>{t.blog.readArticle}</span>
                      <ArrowRight
                        className="h-4 w-4 shrink-0 rtl:rotate-180"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
