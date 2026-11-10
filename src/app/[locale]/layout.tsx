import React from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import {
  AlertCircle,
  CalendarCheck,
  Globe,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck
} from "lucide-react";
import "../globals.css";
import { env } from "@/env";
import { clinicLocations } from "@/content/locations";
import { buildWhatsAppUrl, siteConfig } from "@/content/site";
import {
  JsonLd,
  buildPhysicianAndClinicsSchema
} from "@/components/seo/JsonLd";
import {
  getLocaleDirection,
  getMessages,
  localePath,
  locales,
  localize,
  resolveLocale,
  type Locale
} from "@/i18n";

const poppins = localFont({
  src: [
    {
      path: "../../../public/fonts/Poppins-SemiBold.woff2",
      weight: "600",
      style: "normal"
    },
    {
      path: "../../../public/fonts/Poppins-Bold.woff2",
      weight: "700",
      style: "normal"
    },
    {
      path: "../../../public/fonts/Poppins-ExtraBold.woff2",
      weight: "800",
      style: "normal"
    }
  ],
  variable: "--font-poppins",
  display: "swap"
});

const inter = localFont({
  src: [
    {
      path: "../../../public/fonts/Inter-Regular.woff2",
      weight: "400",
      style: "normal"
    },
    {
      path: "../../../public/fonts/Inter-Medium.woff2",
      weight: "500",
      style: "normal"
    }
  ],
  variable: "--font-inter",
  display: "swap"
});

const jameelNoori = localFont({
  src: "../../../public/fonts/JameelNooriNastaleeq.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-jameel-noori",
  preload: false
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export function generateMetadata({
  params
}: {
  params: { locale: string };
}): Metadata {
  const locale = resolveLocale(params.locale);
  const t = getMessages(locale);
  const baseUrl = env.NEXT_PUBLIC_SITE_URL;

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: t.meta.siteTitle,
      template: `%s | ${localize(siteConfig.doctorName, locale)}`
    },
    description: t.meta.siteDescription,
    keywords: siteConfig.seoKeywords,
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        en: `${baseUrl}/en`,
        ur: `${baseUrl}/ur`
      }
    },
    openGraph: {
      type: "website",
      locale: locale === "ur" ? "ur_PK" : "en_PK",
      url: `${baseUrl}/${locale}`,
      title: t.meta.siteTitle,
      description: t.meta.siteDescription,
      siteName: localize(siteConfig.doctorName, locale),
      images: [
        {
          url: "/images/doctor-placeholder.svg",
          width: 560,
          height: 620,
          alt: t.hero.imageAlt
        }
      ]
    },
    robots: {
      index: true,
      follow: true
    }
  };
}

export default function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale: Locale = resolveLocale(params.locale);
  const dir = getLocaleDirection(locale);
  const t = getMessages(locale);
  const alternateLocale: Locale = locale === "en" ? "ur" : "en";
  const whatsappHref = buildWhatsAppUrl(undefined, locale);
  const physicianAndClinicsJsonLd = buildPhysicianAndClinicsSchema(locale);

  const navItems = [
    { href: localePath(locale, ""), label: t.nav.home },
    { href: localePath(locale, "/about"), label: t.nav.about },
    { href: localePath(locale, "/services"), label: t.nav.services },
    { href: localePath(locale, "/contact"), label: t.nav.contact },
    { href: localePath(locale, "/blog"), label: t.nav.blog }
  ];

  const htmlFontVariables =
    locale === "ur"
      ? `${poppins.variable} ${inter.variable} ${jameelNoori.variable}`
      : `${poppins.variable} ${inter.variable}`;

  return (
    <html lang={locale} dir={dir} className={htmlFontVariables}>
      <body
        className={`flex min-h-screen flex-col bg-canvas text-ink antialiased ${
          locale === "ur" ? "font-urdu" : "font-sans"
        }`}
      >
        {/* Global Physician & MedicalClinic JSON-LD */}
        <JsonLd data={physicianAndClinicsJsonLd} />

        {/* Skip to Main Content Accessibility Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-brand-plum focus:px-5 focus:py-3 focus:font-bold focus:text-white focus:shadow-lg"
        >
          {t.nav.skipToContent}
        </a>

        {/* Sticky Minimal Mobile-First Header */}
        <header className="sticky top-0 z-40 border-b border-brand-rose/60 bg-white/95 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-3 py-3">
              {/* Brand Identity */}
              <Link
                href={localePath(locale, "")}
                className="min-h-tap inline-flex flex-col justify-center"
              >
                <span className="font-heading text-lg font-bold leading-tight text-brand-plum sm:text-xl">
                  {localize(siteConfig.doctorName, locale)}
                </span>
                <span className="text-xs font-medium text-ink-muted">
                  {siteConfig.credentials} •{" "}
                  {locale === "ur"
                    ? "گائناکالوجسٹ (ملتان اور خان گڑھ)"
                    : "Gynecologist & Obstetrician"}
                </span>
              </Link>

              {/* Desktop Navigation Links */}
              <nav
                aria-label="Primary Navigation"
                className="hidden items-center gap-1 lg:flex"
              >
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="min-h-tap inline-flex items-center rounded-xl px-3.5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-card-tint hover:text-brand-plum"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Header Actions: Language Switcher + Book CTA */}
              <div className="flex items-center gap-2">
                <Link
                  href={localePath(alternateLocale, "")}
                  aria-label={t.meta.switchLocaleLabel}
                  className="min-h-tap inline-flex items-center gap-1.5 rounded-xl border border-brand-rose bg-card-tint px-3.5 py-2 text-xs font-bold text-brand-plum transition-colors hover:bg-brand-rose/30 sm:text-sm"
                >
                  <Globe className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{t.meta.switchLocaleShort}</span>
                </Link>

                <Link
                  href={`${localePath(locale, "/contact")}#book-appointment`}
                  className="min-h-tap inline-flex items-center gap-1.5 rounded-xl bg-brand-plum px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-brand-plum-hover sm:text-sm"
                >
                  <CalendarCheck
                    className="hidden h-4 w-4 shrink-0 sm:inline-block"
                    aria-hidden="true"
                  />
                  <span>{t.nav.bookAppointment}</span>
                </Link>
              </div>
            </div>

            {/* Mobile Horizontal Pill Navigation (48px+ tap targets) */}
            <nav
              aria-label="Mobile Navigation"
              className="flex items-center gap-2 overflow-x-auto border-t border-brand-rose/30 py-2 lg:hidden"
            >
              {navItems.map((item) => (
                <Link
                  key={`mobile-${item.href}`}
                  href={item.href}
                  className="min-h-tap inline-flex shrink-0 items-center rounded-xl border border-brand-rose/70 bg-canvas px-3.5 py-2 text-xs font-semibold text-brand-plum transition-colors hover:bg-card-tint"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        {/* Main Page Content */}
        <main id="main-content" className="flex-1">
          {children}
        </main>

        {/* Footer with Extra Mobile Bottom Padding (`pb-24 sm:pb-12`) so Floating WhatsApp Never Obscures Content */}
        <footer className="border-t-2 border-brand-rose bg-white pb-24 pt-12 text-ink sm:pb-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Emergency Medical Disclaimer Banner */}
            <div
              role="note"
              aria-label={t.footer.emergencyTitle}
              className="mb-10 rounded-2xl border-2 border-brand-plum bg-card-tint p-5 sm:p-6"
            >
              <div className="flex items-start gap-3.5">
                <AlertCircle
                  className="mt-0.5 h-6 w-6 shrink-0 text-brand-plum"
                  aria-hidden="true"
                />
                <div className="text-xs leading-relaxed text-ink sm:text-sm">
                  <p className="font-heading font-bold text-brand-plum">
                    {t.footer.emergencyTitle}
                  </p>
                  <p className="mt-1">
                    {localize(siteConfig.emergencyDisclaimer, locale)}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Grid: Doctor Info, Clinics NAP, Quick Links & Socials */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {/* Column 1: Doctor Profile & PMDC Notice */}
              <div className="space-y-3">
                <h2 className="font-heading text-lg font-bold text-brand-plum">
                  {localize(siteConfig.doctorName, locale)} (
                  {siteConfig.credentials})
                </h2>
                <p className="text-sm text-ink-muted">
                  {localize(siteConfig.title, locale)}
                </p>
                <p className="text-xs leading-relaxed text-ink">
                  {localize(siteConfig.clinicalPhilosophy, locale)}
                </p>
                <div className="inline-flex items-center gap-1.5 rounded-lg border border-brand-rose bg-canvas px-3 py-1.5 text-xs font-medium text-brand-plum">
                  <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{siteConfig.pmdcRegistrationNumber}</span>
                </div>
              </div>

              {/* Column 2 & 3: Consistent NAP for Multan & Khangarh Clinics */}
              {clinicLocations.map((clinic) => (
                <div key={`footer-${clinic.id}`} className="space-y-2.5">
                  <h2 className="font-heading text-base font-bold text-brand-plum">
                    {localize(clinic.name, locale)}
                  </h2>
                  <p className="flex items-start gap-2 text-xs leading-relaxed text-ink">
                    <MapPin
                      className="mt-0.5 h-4 w-4 shrink-0 text-brand-plum"
                      aria-hidden="true"
                    />
                    <span>{localize(clinic.address, locale)}</span>
                  </p>
                  <p className="text-xs font-medium text-ink-muted">
                    {localize(clinic.timings, locale)}
                  </p>
                  <p>
                    <a
                      href={clinic.phoneTel}
                      dir="ltr"
                      className="min-h-tap inline-flex items-center gap-2 text-sm font-bold text-brand-plum underline underline-offset-4 hover:text-brand-plum-hover"
                    >
                      <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>{clinic.phoneDisplay}</span>
                    </a>
                  </p>
                </div>
              ))}

              {/* Column 4: Quick Navigation & Social Links */}
              <div className="space-y-4">
                <div>
                  <h2 className="font-heading text-base font-bold text-brand-plum">
                    {t.footer.quickLinksHeading}
                  </h2>
                  <ul className="mt-2 grid grid-cols-2 gap-1 text-xs font-medium">
                    <li>
                      <Link
                        href={localePath(locale, "/about")}
                        className="min-h-tap inline-flex items-center text-ink hover:text-brand-plum hover:underline"
                      >
                        {t.nav.about}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={localePath(locale, "/services")}
                        className="min-h-tap inline-flex items-center text-ink hover:text-brand-plum hover:underline"
                      >
                        {t.nav.services}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={localePath(locale, "/contact")}
                        className="min-h-tap inline-flex items-center text-ink hover:text-brand-plum hover:underline"
                      >
                        {t.nav.contact}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={localePath(locale, "/blog")}
                        className="min-h-tap inline-flex items-center text-ink hover:text-brand-plum hover:underline"
                      >
                        {t.nav.blog}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={localePath(locale, "/privacy")}
                        className="min-h-tap inline-flex items-center text-ink hover:text-brand-plum hover:underline"
                      >
                        {t.nav.privacy}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={localePath(locale, "/disclaimer")}
                        className="min-h-tap inline-flex items-center text-ink hover:text-brand-plum hover:underline"
                      >
                        {t.nav.disclaimer}
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-heading text-sm font-bold text-brand-plum">
                    {t.footer.connectHeading}
                  </h2>
                  <div className="mt-2 flex flex-col gap-1.5 text-xs">
                    <a
                      href={siteConfig.socials.instagram.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-tap inline-flex items-center font-semibold text-brand-plum underline underline-offset-4 hover:text-brand-plum-hover"
                    >
                      {t.footer.followInstagram}
                    </a>
                    <a
                      href={siteConfig.socials.facebook.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-tap inline-flex items-center font-semibold text-brand-plum underline underline-offset-4 hover:text-brand-plum-hover"
                    >
                      {t.footer.followFacebook}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Copyright Bar */}
            <div className="mt-10 border-t border-brand-rose/40 pt-6 text-center text-xs text-ink-muted">
              <p>
                © {new Date().getFullYear()} {t.footer.copyright}
              </p>
            </div>
          </div>
        </footer>

        {/* Floating WhatsApp CTA Button (WCAG AAA dark text `#052E16` on `#10B981`) */}
        <div className="fixed bottom-4 right-4 z-50 rtl:left-4 rtl:right-auto">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.footer.floatingWhatsappLabel}
            className="min-h-tap inline-flex items-center gap-2 rounded-full border-2 border-whatsapp-ink/20 bg-whatsapp px-5 py-3 font-heading text-sm font-bold text-whatsapp-ink shadow-lg transition-transform hover:scale-105 hover:bg-whatsapp-hover"
          >
            <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span>{t.footer.floatingWhatsappLabel}</span>
          </a>
        </div>
      </body>
    </html>
  );
}
