import React from "react";
import type { Metadata } from "next";
import { Lock, ShieldCheck, Trash2 } from "lucide-react";
import { env } from "@/env";
import { siteConfig } from "@/content/site";
import { JsonLd, buildBreadcrumbSchema } from "@/components/seo/JsonLd";
import { getMessages, resolveLocale, type Locale } from "@/i18n";

export function generateMetadata({
  params
}: {
  params: { locale: string };
}): Metadata {
  const locale = resolveLocale(params.locale);
  const t = getMessages(locale);
  const baseUrl = env.NEXT_PUBLIC_SITE_URL;

  return {
    title: t.legal.privacyTitle,
    description: t.legal.privacySubtitle,
    alternates: {
      canonical: `${baseUrl}/${locale}/privacy`,
      languages: {
        en: `${baseUrl}/en/privacy`,
        ur: `${baseUrl}/ur/privacy`
      }
    }
  };
}

export default function PrivacyPolicyPage({
  params
}: {
  params: { locale: string };
}) {
  const locale: Locale = resolveLocale(params.locale);
  const t = getMessages(locale);

  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: t.nav.home, path: `/${locale}` },
      { name: t.nav.privacy, path: `/${locale}/privacy` }
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
              <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{t.nav.privacy}</span>
            </div>
            <h1 className="mt-3 font-heading text-3xl font-bold text-brand-plum sm:text-4xl">
              {t.legal.privacyTitle}
            </h1>
            <p className="mt-2 text-base text-ink-muted">
              {t.legal.privacySubtitle}
            </p>
          </header>

          {locale === "ur" ? (
            <div className="mt-8 space-y-6 text-base leading-relaxed text-ink">
              <section>
                <h2 className="font-heading text-xl font-bold text-brand-plum">
                  1. کم سے کم معلومات کا حصول (Data Minimization)
                </h2>
                <p className="mt-2">
                  ڈاکٹر طوبیٰ اقبال کے کلینک کی اس ویب سائٹ پر ہم صرف اپائنٹمنٹ کا وقت طے کرنے کے لیے بنیادی معلومات حاصل کرتے ہیں: آپ کا نام، موبائل فون نمبر، منتخب کلینک (ملتان یا خان گڑھ)، پسندیدہ تاریخ اور معائنے کی مختصر وجہ (زیادہ سے زیادہ 300 حروف)۔ ہم آن لائن فارم کے ذریعے آپ کی تفصیلی طبی ہسٹری یا حساس رپورٹس طلب نہیں کرتے۔
                </p>
              </section>

              <section>
                <h2 className="font-heading text-xl font-bold text-brand-plum">
                  2. معلومات کے استعمال کا مقصد
                </h2>
                <p className="mt-2">
                  آپ کی فراہم کردہ معلومات صرف اور صرف آپ کے اپائنٹمنٹ سلاٹ کی تصدیق اور کلینک کے استقبالیہ سے رابطے کے لیے استعمال کی جاتی ہیں۔ آپ کا فون نمبر کسی بھی اشتہاری کمپنی کو فروخت یا فراہم نہیں کیا جاتا۔
                </p>
              </section>

              <section>
                <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-brand-plum">
                  <Lock className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span>3. انکرپشن اور سیکیورٹی (Encryption in Transit &amp; at Rest)</span>
                </h2>
                <p className="mt-2">
                  ویب سائٹ پر بھیجا جانے والا تمام ڈیٹا HTTPS/TLS کے ذریعے محفوظ بنایا جاتا ہے۔ جب ڈیٹا بیس اسٹوریج فعال ہوتی ہے تو مریضہ کا فون نمبر جدید ترین <strong>AES-256-GCM</strong> انکرپشن کے ساتھ محفوظ کیا جاتا ہے۔
                </p>
              </section>

              <section>
                <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-brand-plum">
                  <Trash2 className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span>4. 90 دن کی خودکار حذف پالیسی (90-Day Retention Policy)</span>
                </h2>
                <p className="mt-2">
                  مریضہ کی رازداری کے تحفظ کے لیے آن لائن اپائنٹمنٹ کا ریکارڈ زیادہ سے زیادہ <strong>90 دن</strong> تک رکھا جاتا ہے، جس کے بعد ہمارا خودکار نظام اسے مستقل طور پر حذف کر دیتا ہے۔
                </p>
              </section>

              <section>
                <h2 className="font-heading text-xl font-bold text-brand-plum">
                  5. اشتہاری ٹریکرز سے پاک ویب سائٹ اور ڈیٹا حذف کرنے کی درخواست
                </h2>
                <p className="mt-2">
                  اس ویب سائٹ پر کوئی تھرڈ پارٹی اشتہاری پکسل یا مارکیٹنگ ٹریکر استعمال نہیں کیا جاتا۔ اگر آپ اپنا اپائنٹمنٹ ریکارڈ فوری طور پر حذف کروانا چاہتی ہیں تو آپ واٹس ایپ ({siteConfig.primaryPhoneDisplay}) یا ای میل ({siteConfig.dataDeletionEmail}) پر رابطہ کر سکتی ہیں۔
                </p>
              </section>
            </div>
          ) : (
            <div className="mt-8 space-y-6 text-base leading-relaxed text-ink">
              <section>
                <h2 className="font-heading text-xl font-bold text-brand-plum">
                  1. Strict Data Minimization
                </h2>
                <p className="mt-2">
                  We collect only the minimum personal information required to schedule an outpatient clinic visit: your <strong>Full Name</strong>, <strong>Phone Number</strong>, <strong>Preferred Clinic Location</strong> (Multan or Khangarh), <strong>Preferred Date</strong>, and an optional <strong>Brief Reason for Visit</strong> (strictly capped at 300 characters). Patients are explicitly advised never to submit detailed medical histories or diagnostic reports through the web form.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-xl font-bold text-brand-plum">
                  2. Purpose Limitation (Scheduling Only)
                </h2>
                <p className="mt-2">
                  Your contact details are used exclusively by Dr. Tooba Iqbal&apos;s clinic reception to confirm or reschedule your requested appointment slot. We never sell, rent, or share patient contact details with advertisers or third-party marketing platforms.
                </p>
              </section>

              <section>
                <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-brand-plum">
                  <Lock className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span>3. Encryption in Transit &amp; at Rest</span>
                </h2>
                <p className="mt-2">
                  All traffic between your browser and our servers is encrypted using HTTPS with HTTP Strict Transport Security (HSTS). By default, the portal operates in stateless notification mode. When database persistence is enabled, patient phone numbers are encrypted prior to storage using authenticated <strong>AES-256-GCM</strong> encryption (12-byte random IV and 16-byte authentication tag) and indexed via a keyed <strong>HMAC-SHA256</strong> blind index.
                </p>
              </section>

              <section>
                <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-brand-plum">
                  <Trash2 className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span>4. 90-Day Maximum Data Retention Policy</span>
                </h2>
                <p className="mt-2">
                  Any stored appointment scheduling records are retained for a maximum of <strong>90 days</strong> and are automatically purged by our scheduled retention cleanup job (<code>/api/cron/retention</code>).
                </p>
              </section>

              <section>
                <h2 className="font-heading text-xl font-bold text-brand-plum">
                  5. Zero Third-Party Ad Trackers &amp; Immediate Deletion Requests
                </h2>
                <p className="mt-2">
                  This website loads zero third-party advertising pixels, behavioral analytics scripts, or external font CDNs. To request immediate deletion of an appointment request at any time, please contact our clinic via WhatsApp at{" "}
                  <a
                    href={siteConfig.primaryPhoneTel}
                    className="font-semibold text-brand-plum underline"
                  >
                    {siteConfig.primaryPhoneDisplay}
                  </a>{" "}
                  or email{" "}
                  <span className="font-mono text-sm">
                    {siteConfig.dataDeletionEmail}
                  </span>
                  .
                </p>
              </section>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
