import fs from "node:fs";
import path from "node:path";
import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import matter from "gray-matter";
import {
  ArrowLeft,
  Calendar,
  CalendarCheck,
  Clock,
  MessageCircle,
  ShieldAlert,
  Stethoscope
} from "lucide-react";
import { env } from "@/env";
import { buildWhatsAppUrl, siteConfig } from "@/content/site";
import { JsonLd, buildBreadcrumbSchema } from "@/components/seo/JsonLd";
import {
  getMessages,
  localePath,
  locales,
  localize,
  resolveLocale,
  type Locale
} from "@/i18n";
import {
  ALLOWED_BLOG_SLUGS,
  isAllowedBlogSlug,
  type BlogPostFrontmatter
} from "@/lib/blog";

interface ParsedBlogPost {
  frontmatter: BlogPostFrontmatter;
  content: string;
}

function loadBlogPostBySlug(slug: string): ParsedBlogPost | null {
  if (!isAllowedBlogSlug(slug)) {
    return null;
  }

  const fullPath = path.join(process.cwd(), "content", "blog", `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const rawFile = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(rawFile);

  return {
    frontmatter: {
      slug,
      title: String(data.title ?? ""),
      titleUr: String(data.titleUr ?? data.title ?? ""),
      excerpt: String(data.excerpt ?? ""),
      excerptUr: String(data.excerptUr ?? data.excerpt ?? ""),
      author: String(data.author ?? "Dr. Tooba Iqbal, MBBS, MCPS"),
      authorRole: String(
        data.authorRole ?? "Consultant Gynecologist & Obstetrician"
      ),
      publishedAt: String(data.publishedAt ?? "2026-10-15"),
      lastReviewed: String(data.lastReviewed ?? "2026-11-06"),
      readingTimeMinutes: Number(data.readingTimeMinutes ?? 5),
      category: String(data.category ?? "Women's Health"),
      categoryUr: String(data.categoryUr ?? "خواتین کی صحت"),
      serviceSlug: String(data.serviceSlug ?? "general-gynecology"),
      approvalStatus: String(
        data.approvalStatus ?? "[DRAFT — REQUIRES CLIENT MEDICAL APPROVAL]"
      )
    },
    content
  };
}

/**
 * Safe inline Markdown formatter for bold (`**...**`) and italic (`*...*`) text
 * without using `dangerouslySetInnerHTML`.
 */
function renderInlineFormatting(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((segment, index) => {
    if (segment.startsWith("**") && segment.endsWith("**")) {
      return (
        <strong key={index} className="font-bold text-ink">
          {segment.slice(2, -2)}
        </strong>
      );
    }
    if (segment.startsWith("*") && segment.endsWith("*")) {
      return (
        <em key={index} className="italic">
          {segment.slice(1, -1)}
        </em>
      );
    }
    if (segment.startsWith("`") && segment.endsWith("`")) {
      return (
        <code
          key={index}
          className="rounded bg-card-tint px-1.5 py-0.5 font-mono text-xs text-brand-plum"
        >
          {segment.slice(1, -1)}
        </code>
      );
    }
    return segment;
  });
}

/**
 * Renders sanitized MDX body paragraphs, headings, blockquotes, and lists
 * as pure React elements (zero `dangerouslySetInnerHTML`).
 */
function renderSanitizedMdxBlocks(markdown: string): React.ReactNode[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const elements: React.ReactNode[] = [];
  let listBuffer: { type: "ul" | "ol"; items: string[] } | null = null;
  let keyCounter = 0;

  function flushList() {
    if (!listBuffer) return;
    const current = listBuffer;
    listBuffer = null;
    keyCounter += 1;
    if (current.type === "ul") {
      elements.push(
        <ul
          key={`list-${keyCounter}`}
          className="my-4 list-disc space-y-2 ps-6 text-base leading-relaxed text-ink"
        >
          {current.items.map((item, idx) => (
            <li key={idx}>{renderInlineFormatting(item)}</li>
          ))}
        </ul>
      );
    } else {
      elements.push(
        <ol
          key={`list-${keyCounter}`}
          className="my-4 list-decimal space-y-2 ps-6 text-base leading-relaxed text-ink"
        >
          {current.items.map((item, idx) => (
            <li key={idx}>{renderInlineFormatting(item)}</li>
          ))}
        </ol>
      );
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushList();
      continue;
    }

    if (line === "---") {
      flushList();
      keyCounter += 1;
      elements.push(
        <hr
          key={`hr-${keyCounter}`}
          className="my-8 border-t border-brand-rose/60"
        />
      );
      continue;
    }

    if (line.startsWith("## ")) {
      flushList();
      keyCounter += 1;
      elements.push(
        <h2
          key={`h2-${keyCounter}`}
          className="mt-8 font-heading text-2xl font-bold text-brand-plum"
        >
          {renderInlineFormatting(line.slice(3))}
        </h2>
      );
      continue;
    }

    if (line.startsWith("### ")) {
      flushList();
      keyCounter += 1;
      elements.push(
        <h3
          key={`h3-${keyCounter}`}
          className="mt-6 font-heading text-xl font-bold text-brand-plum"
        >
          {renderInlineFormatting(line.slice(4))}
        </h3>
      );
      continue;
    }

    if (line.startsWith("> ")) {
      flushList();
      keyCounter += 1;
      elements.push(
        <blockquote
          key={`quote-${keyCounter}`}
          className="my-5 rounded-2xl border-s-4 border-brand-plum bg-card-tint/80 p-4 text-sm leading-relaxed text-ink"
        >
          {renderInlineFormatting(line.slice(2))}
        </blockquote>
      );
      continue;
    }

    if (line.startsWith("- ")) {
      if (!listBuffer || listBuffer.type !== "ul") {
        flushList();
        listBuffer = { type: "ul", items: [] };
      }
      listBuffer.items.push(line.slice(2));
      continue;
    }

    const orderedMatch = /^\d+\.\s+(.*)$/.exec(line);
    if (orderedMatch && orderedMatch[1]) {
      if (!listBuffer || listBuffer.type !== "ol") {
        flushList();
        listBuffer = { type: "ol", items: [] };
      }
      listBuffer.items.push(orderedMatch[1]);
      continue;
    }

    flushList();
    keyCounter += 1;
    elements.push(
      <p
        key={`p-${keyCounter}`}
        className="my-4 text-base leading-relaxed text-ink"
      >
        {renderInlineFormatting(line)}
      </p>
    );
  }

  flushList();
  return elements;
}

export function generateStaticParams() {
  const params: Array<{ locale: string; slug: string }> = [];
  for (const locale of locales) {
    for (const slug of ALLOWED_BLOG_SLUGS) {
      params.push({ locale, slug });
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
  const post = loadBlogPostBySlug(params.slug);
  if (!post) {
    return {};
  }

  const baseUrl = env.NEXT_PUBLIC_SITE_URL;
  const title =
    locale === "ur" ? post.frontmatter.titleUr : post.frontmatter.title;
  const description =
    locale === "ur" ? post.frontmatter.excerptUr : post.frontmatter.excerpt;

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}/blog/${post.frontmatter.slug}`,
      languages: {
        en: `${baseUrl}/en/blog/${post.frontmatter.slug}`,
        ur: `${baseUrl}/ur/blog/${post.frontmatter.slug}`
      }
    }
  };
}

export default function BlogPostPage({
  params
}: {
  params: { locale: string; slug: string };
}) {
  const locale: Locale = resolveLocale(params.locale);
  const post = loadBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const t = getMessages(locale);
  const { frontmatter, content } = post;
  const displayTitle =
    locale === "ur" ? frontmatter.titleUr : frontmatter.title;
  const displayCategory =
    locale === "ur" ? frontmatter.categoryUr : frontmatter.category;

  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: t.nav.home, path: `/${locale}` },
      { name: t.nav.blog, path: `/${locale}/blog` },
      { name: displayTitle, path: `/${locale}/blog/${frontmatter.slug}` }
    ],
    locale
  );

  return (
    <div className="py-10 sm:py-14 lg:py-16">
      <JsonLd data={breadcrumbSchema} />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link
          href={localePath(locale, "/blog")}
          className="min-h-tap inline-flex items-center gap-2 text-sm font-semibold text-brand-plum hover:underline"
        >
          <ArrowLeft
            className="h-4 w-4 shrink-0 rtl:rotate-180"
            aria-hidden="true"
          />
          <span>{t.blog.backToBlog}</span>
        </Link>

        <article className="mt-4 overflow-hidden rounded-3xl border-2 border-brand-rose bg-white p-6 shadow-card sm:p-10">
          {/* Header & Medical Review Metadata */}
          <header className="border-b border-brand-rose/50 pb-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-full border border-brand-rose bg-card-tint px-3.5 py-1 text-xs font-semibold text-brand-plum">
                {displayCategory}
              </span>
              <span className="rounded-md border border-brand-plum bg-card-tint px-3 py-1 font-mono text-xs font-bold text-brand-plum">
                {frontmatter.approvalStatus}
              </span>
            </div>

            <h1 className="mt-4 font-heading text-2xl font-bold text-brand-plum sm:text-3xl lg:text-4xl">
              {displayTitle}
            </h1>

            {/* Author Byline & Last Medically Reviewed Banner */}
            <div className="mt-5 flex flex-wrap items-center gap-4 rounded-2xl border border-brand-rose bg-canvas p-4 text-xs sm:text-sm">
              <div className="flex items-center gap-2 font-semibold text-brand-plum">
                <Stethoscope className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  {t.blog.authorPrefix} {frontmatter.author}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-ink-muted">
                <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  {t.blog.lastReviewedLabel}:{" "}
                  <strong className="text-ink">{frontmatter.lastReviewed}</strong>
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-ink-muted">
                <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  {frontmatter.readingTimeMinutes} {t.blog.readingTimeLabel}
                </span>
              </div>
            </div>
          </header>

          {/* Prominent Educational Disclaimer Box */}
          <div
            role="note"
            className="mt-6 flex items-start gap-3 rounded-2xl border-2 border-brand-rose bg-card-tint p-5 text-xs leading-relaxed text-ink sm:text-sm"
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

          {/* Sanitized Article Body */}
          <div className="mt-6">{renderSanitizedMdxBlocks(content)}</div>

          {/* Bottom Consultation CTA Box */}
          <footer className="mt-10 rounded-2xl border border-brand-rose bg-card-tint p-6 sm:p-8">
            <h2 className="font-heading text-xl font-bold text-brand-plum">
              {t.blog.bookCtaHeading}
            </h2>
            <p className="mt-2 text-sm text-ink sm:text-base">
              {t.blog.bookCtaBody}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href={`${localePath(locale, "/contact")}#book-appointment`}
                className="btn-primary gap-2 text-sm"
              >
                <CalendarCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{t.nav.bookAppointment}</span>
              </Link>

              <a
                href={buildWhatsAppUrl(undefined, locale)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp gap-2 text-sm"
              >
                <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{t.nav.whatsappCta}</span>
              </a>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}
