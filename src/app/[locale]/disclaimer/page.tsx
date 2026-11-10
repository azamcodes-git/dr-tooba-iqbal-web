import React from "react";
import type { Metadata } from "next";
import { AlertTriangle, Phone, Stethoscope } from "lucide-react";
import { env } from "@/env";
import { clinicLocations } from "@/content/locations";
import { siteConfig } from "@/content/site";
import { JsonLd, buildBreadcrumbSchema } from "@/components/seo/JsonLd";
import { getMessages, localize, resolveLocale, type Locale } from "@/i18n";

export function generateMetadata({
  params
}: {
  params: { locale: string };
}): Metadata {
  const locale = resolveLocale(params.locale);
  const t = getMessages(locale);
  const baseUrl = env.NEXT_PUBLIC_SITE_URL;

  return {
    title: t.legal.disclaimerTitle,
    description: t.legal.disclaimerSubtitle,
    alternates: {
      canonical: `${baseUrl}/${locale}/disclaimer`,
      languages: {
        en: `${baseUrl}/en/disclaimer`,
        ur: `${baseUrl}/ur/disclaimer`
      }
    }
  };
}

export default function MedicalDisclaimerPage({
  params
}: {
  params: { locale: string };
}) {
  const locale: Locale = resolveLocale(params.locale);
  const t = getMessages(locale);

  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: t.nav.home, path: `/${locale}` },
      { name: t.nav.disclaimer, path: `/${locale}/disclaimer` }
    ],
    locale
  );

  return (
    <div className="py-10 sm:py-14 lg:py-16">
      <JsonLd data={breadcrumbSchema} />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <article className="rounded-3xl border-2 border-brand-rose bg-white p-6 shadow-card sm:p-10">
          <header className="border-b border-brand-rose/50 pb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-rose bg-card-tint px-3.5 py-1 text-xs font-bold text-brand-plum">
              <Stethoscope className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{t.nav.disclaimer}</span>
            </div>
            <h1 className="mt-3 font-heading text-3xl font-bold text-brand-plum sm:text-4xl">
              {t.legal.disclaimerTitle}
            </h1>
            <p className="mt-2 text-base text-ink-muted">
              {t.legal.disclaimerSubtitle}
            </p>
          </header>

          {/* Prominent Emergency Notice */}
          <div
            role="alert"
            className="mt-8 rounded-2xl border-2 border-brand-plum bg-card-tint p-6"
          >
            <div className="flex items-start gap-3.5">
              <AlertTriangle
                className="mt-0.5 h-6 w-6 shrink-0 text-brand-plum"
                aria-hidden="true"
              />
              <div>
                <h2 className="font-heading text-lg font-bold text-brand-plum">
                  {t.footer.emergencyTitle}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink sm:text-base">
                  {localize(siteConfig.emergencyDisclaimer, locale)}
                </p>
              </div>
            </div>
          </div>

          {locale === "ur" ? (
            <div className="mt-8 space-y-6 text-base leading-relaxed text-ink">
              <section>
                <h2 className="font-heading text-xl font-bold text-brand-plum">
                  1. صرف تعلیمی اور معلوماتی مقصد
                </h2>
                <p className="mt-2">
                  {localize(siteConfig.educationalDisclaimer, "ur")}
                </p>
              </section>

              <section>
                <h2 className="font-heading text-xl font-bold text-brand-plum">
                  2. ڈاکٹر اور مریضہ کا تعلق کب قائم ہوتا ہے؟
                </h2>
                <p className="mt-2">
                  اس ویب سائٹ کا مطالعہ کرنے، واٹس ایپ پر پیغام بھیجنے یا آن لائن اپائنٹمنٹ فارم پر کرنے سے ڈاکٹر اور مریضہ کا باضابطہ طبی تعلق قائم نہیں ہوتا۔ باضابطہ تشخیص اور علاج صرف ملتان یا خان گڑھ کلینک میں بالمشافہ معائنے کے بعد ہی ممکن ہے۔
                </p>
              </section>

              <section>
                <h2 className="font-heading text-xl font-bold text-brand-plum">
                  3. نتائج کی کوئی پیشگی ضمانت نہیں
                </h2>
                <p className="mt-2">
                  ہر مریضہ کی جسمانی اور طبی کیفیت مختلف ہوتی ہے۔ پی ایم ڈی سی (PMDC) کے طبی ضوابط کے مطابق کسی بھی علاج یا مشورے کے سوفیصد یکساں نتائج کی پیشگی ضمانت نہیں دی جاتی۔
                </p>
              </section>
            </div>
          ) : (
            <div className="mt-8 space-y-6 text-base leading-relaxed text-ink">
              <section>
                <h2 className="font-heading text-xl font-bold text-brand-plum">
                  1. General Educational Scope Only
                </h2>
                <p className="mt-2">
                  {localize(siteConfig.educationalDisclaimer, "en")}
                </p>
              </section>

              <section>
                <h2 className="font-heading text-xl font-bold text-brand-plum">
                  2. No Doctor–Patient Relationship via Online Forms
                </h2>
                <p className="mt-2">
                  Reading articles on this website, sending a message via WhatsApp, or submitting an online appointment request does not create a formal physician–patient relationship. A clinical relationship is established only during an in-person medical evaluation at our Multan or Khangarh clinic.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-xl font-bold text-brand-plum">
                  3. Individual Clinical Outcomes Vary
                </h2>
                <p className="mt-2">
                  In accordance with Pakistan Medical &amp; Dental Council (PMDC) ethical guidelines, this website makes no guaranteed outcome claims. Diagnostic pathways and therapeutic responses vary depending on each patient&apos;s individual medical history and clinical findings.
                </p>
              </section>
            </div>
          )}

          {/* Direct Clinic Contact Footer */}
          <div className="mt-10 border-t border-brand-rose/50 pt-6">
            <h2 className="font-heading text-lg font-bold text-brand-plum">
              {t.clinics.heading}
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {clinicLocations.map((clinic) => (
                <div
                  key={clinic.id}
                  className="rounded-2xl border border-brand-rose bg-canvas p-4 text-sm"
                >
                  <p className="font-bold text-brand-plum">
                    {localize(clinic.name, locale)}
                  </p>
                  <p className="mt-1 text-xs text-ink-muted">
                    {localize(clinic.timings, locale)}
                  </p>
                  <a
                    href={clinic.phoneTel}
                    dir="ltr"
                    className="mt-2 inline-flex items-center gap-1.5 font-bold text-brand-plum underline"
                  >
                    <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{clinic.phoneDisplay}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
