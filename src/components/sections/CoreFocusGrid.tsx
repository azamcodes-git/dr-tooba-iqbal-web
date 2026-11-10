import React from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Baby,
  BookOpen,
  CalendarHeart,
  ShieldPlus,
  Sparkles
} from "lucide-react";
import { coreFocusItems, type CoreFocusIconName } from "@/content/services";
import { getMessages, localePath, localize, type Locale } from "@/i18n";

interface CoreFocusGridProps {
  locale: Locale;
}

function renderFocusIcon(icon: CoreFocusIconName) {
  switch (icon) {
    case "calendar-heart":
      return <CalendarHeart className="h-6 w-6 text-brand-plum" aria-hidden="true" />;
    case "baby":
      return <Baby className="h-6 w-6 text-brand-plum" aria-hidden="true" />;
    case "sparkles":
      return <Sparkles className="h-6 w-6 text-brand-plum" aria-hidden="true" />;
    case "shield-plus":
      return <ShieldPlus className="h-6 w-6 text-brand-plum" aria-hidden="true" />;
    case "activity":
    default:
      return <Activity className="h-6 w-6 text-brand-plum" aria-hidden="true" />;
  }
}

export function CoreFocusGrid({ locale }: CoreFocusGridProps) {
  const t = getMessages(locale);

  return (
    <section
      aria-labelledby="core-focus-heading"
      className="py-12 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-brand-plum">
            {t.coreFocus.eyebrow}
          </p>
          <h2
            id="core-focus-heading"
            className="mt-2 font-heading text-2xl font-bold text-brand-plum sm:text-3xl lg:text-4xl"
          >
            {t.coreFocus.heading}
          </h2>
          <p className="mt-3 text-base text-ink-muted sm:text-lg">
            {t.coreFocus.subheading}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {coreFocusItems.map((item) => {
            const serviceAnchorHref = `${localePath(locale, "/services")}#${item.serviceSlug}`;
            const blogGuideHref = localePath(locale, `/blog/${item.blogSlug}`);

            return (
              <article
                key={item.id}
                className="flex flex-col justify-between rounded-2xl border border-brand-rose bg-card-tint p-6 shadow-card transition-shadow hover:shadow-card-hover"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-brand-rose bg-white shadow-sm">
                      {renderFocusIcon(item.icon)}
                    </div>
                    <span className="rounded-full border border-brand-rose bg-white px-3 py-1 text-xs font-semibold text-brand-plum">
                      {localize(item.badge, locale)}
                    </span>
                  </div>

                  <h3 className="mt-5 font-heading text-xl font-bold text-brand-plum">
                    <Link
                      href={serviceAnchorHref}
                      className="hover:underline focus-visible:underline"
                    >
                      {localize(item.title, locale)}
                    </Link>
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-ink">
                    {localize(item.summary, locale)}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-brand-rose/50 pt-4">
                  <Link
                    href={serviceAnchorHref}
                    className="min-h-tap inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand-plum px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-brand-plum-hover"
                  >
                    <span>{t.coreFocus.exploreService}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 rtl:rotate-180" aria-hidden="true" />
                  </Link>

                  <Link
                    href={blogGuideHref}
                    className="min-h-tap inline-flex items-center justify-center gap-1.5 rounded-xl border border-brand-plum bg-white px-3.5 py-2.5 text-xs font-semibold text-brand-plum transition-colors hover:bg-canvas"
                  >
                    <BookOpen className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{t.coreFocus.readGuide}</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href={localePath(locale, "/services")}
            className="btn-outline gap-2"
          >
            <span>{t.coreFocus.viewAllServices}</span>
            <ArrowRight className="h-4 w-4 shrink-0 rtl:rotate-180" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
