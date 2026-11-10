import type { Locale } from "@/i18n";

export interface LocalizedText {
  en: string;
  ur: string;
}

export interface QualificationItem {
  degree: LocalizedText;
  institution: LocalizedText;
  year: string;
  note: LocalizedText;
}

export interface SiteConfig {
  doctorName: LocalizedText;
  shortName: LocalizedText;
  title: LocalizedText;
  credentials: string;
  pmdcRegistrationNumber: string;
  pmdcVerificationNote: LocalizedText;
  primaryPracticeAreas: LocalizedText;
  clinicalPhilosophy: LocalizedText;
  bioSummary: LocalizedText;
  bioDetailed: LocalizedText[];
  qualifications: QualificationItem[];
  memberships: LocalizedText[];
  whatsappNumberE164: string;
  whatsappUrl: string;
  primaryPhoneDisplay: string;
  primaryPhoneTel: string;
  socials: {
    instagram: {
      url: string;
      handle: string;
    };
    facebook: {
      url: string;
      handle: string;
    };
  };
  seoKeywords: string[];
  emergencyDisclaimer: LocalizedText;
  educationalDisclaimer: LocalizedText;
  dataDeletionEmail: string;
}

/**
 * Single Source of Truth for Dr. Tooba Iqbal's credentials, contact links,
 * and regulatory compliance notices.
 *
 * [CONFIRM WITH CLIENT — Review PMDC registration number, training years,
 * and professional memberships prior to public production launch.]
 */
export const siteConfig: SiteConfig = {
  doctorName: {
    en: "Dr. Tooba Iqbal",
    ur: "ڈاکٹر طوبیٰ اقبال"
  },
  shortName: {
    en: "Dr. Tooba Iqbal",
    ur: "ڈاکٹر طوبیٰ اقبال"
  },
  title: {
    en: "Consultant Gynecologist & Obstetrician",
    ur: "کنسلٹنٹ گائناکالوجسٹ اور ماہرِ امراضِ نسواں و زچگی"
  },
  // [CONFIRM WITH CLIENT, PMDC NO: ______]
  credentials: "MBBS, MCPS",
  // [CONFIRM WITH CLIENT, PMDC NO: ______ — Replace placeholder with verified PMDC Registration Number before launch]
  pmdcRegistrationNumber: "[CONFIRM WITH CLIENT, PMDC NO: ______]",
  pmdcVerificationNote: {
    en: "Registered Medical Practitioner & Specialist in Obstetrics and Gynecology (PMDC verification details updated upon clinic confirmation).",
    ur: "رجسٹرڈ میڈیکل پریکٹیشنر اور ماہرِ امراضِ نسواں و زچگی (پی ایم ڈی سی رجسٹریشن کی تفصیلات کلینک کی تصدیق کے مطابق اپ ڈیٹ کی جاتی ہیں)۔"
  },
  primaryPracticeAreas: {
    en: "Multan and Khangarh, Southern Punjab, Pakistan",
    ur: "ملتان اور خان گڑھ، جنوبی پنجاب، پاکستان"
  },
  clinicalPhilosophy: {
    en: "Compassionate, confidential, evidence-based care for women from adolescence through maternity and menopause.",
    ur: "خواتین کے لیے بلوغت سے لے کر زچگی اور مینوپاز تک ہمدردانہ، رازدارانہ اور جدید طبی اصولوں پر مبنی نگہداشت۔"
  },
  bioSummary: {
    en: "Dr. Tooba Iqbal (MBBS, MCPS) is a dedicated Gynecologist & Obstetrician serving women and families in Multan and Khangarh. Her practice focuses on respectful maternity care, PCOS and hormonal management, fertility counseling, and preventive women's health.",
    ur: "ڈاکٹر طوبیٰ اقبال (ایم بی بی ایس، ایم سی پی ایس) ملتان اور خان گڑھ میں خواتین کی صحت اور زچگی کی ماہر ڈاکٹر ہیں۔ ان کا کلینک حمل کی نگہداشت، پی سی او ایس، ہارمونل توازن، بانجھ پن کے مشورے اور خواتین کے عمومی طبی مسائل کے باوقار علاج کے لیے وقف ہے۔"
  },
  bioDetailed: [
    {
      en: "Dr. Tooba Iqbal (MBBS, MCPS) provides patient-centered gynecological and obstetric care tailored to the needs of women across Southern Punjab, with active clinics in Multan and Khangarh.",
      ur: "ڈاکٹر طوبیٰ اقبال (ایم بی بی ایس، ایم سی پی ایس) جنوبی پنجاب کی خواتین کی ضروریات کے مطابق ملتان اور خان گڑھ میں معیاری گائناکالوجیکل اور زچگی کی طبی سہولیات فراہم کرتی ہیں۔"
    },
    {
      en: "Recognizing that many women hesitate to seek timely medical advice due to privacy concerns, her consultations emphasize active listening, clear explanations in English, Urdu, and Saraiki, and evidence-based diagnostic pathways.",
      ur: "اس بات کو سمجھتے ہوئے کہ بہت سی خواتین جھجھک یا رازداری کے خدشات کے باعث بروقت طبی مشورہ لینے سے ہچکچاتی ہیں، ڈاکٹر طوبیٰ اقبال مریضہ کی بات توجہ سے سننے، آسان زبان میں مسئلہ سمجھانے اور سائنسی بنیادوں پر علاج تجویز کرنے پر خصوصی توجہ دیتی ہیں۔"
    },
    {
      en: "From early antenatal ultrasound evaluations (including 8-week Crown-Rump Length scans) to managing Polycystic Ovary Syndrome (PCOS), urinary tract infections, and reproductive health after 30, every care plan prioritizes patient dignity and clinical safety.",
      ur: "ابتدائی حمل کے الٹراساؤنڈ معائنے سے لے کر پی سی او ایس (PCOS)، پیشاب کی نالی کے انفیکشن اور 30 سال کی عمر کے بعد خواتین کی تولیدی صحت تک، ہر علاج میں مریضہ کے وقار اور طبی تحفظ کو اولیت دی جاتی ہے۔"
    }
  ],
  // [CONFIRM WITH CLIENT — Verify exact medical college, hospital residency, and graduation years]
  qualifications: [
    {
      degree: {
        en: "MCPS (Obstetrics & Gynecology)",
        ur: "ایم سی پی ایس (امراضِ نسواں و زچگی)"
      },
      institution: {
        en: "College of Physicians and Surgeons Pakistan (CPSP) [CONFIRM WITH CLIENT]",
        ur: "کالج آف فزیشنز اینڈ سرجنز پاکستان (CPSP) [کلائنٹ سے تصدیق طلب]"
      },
      year: "[CONFIRM WITH CLIENT]",
      note: {
        en: "Postgraduate specialist qualification in Obstetrics & Gynecology.",
        ur: "امراضِ نسواں اور زچگی میں پوسٹ گریجویٹ اسپیشلسٹ قابلیت۔"
      }
    },
    {
      degree: {
        en: "MBBS (Bachelor of Medicine, Bachelor of Surgery)",
        ur: "ایم بی بی ایس (بیچلر آف میڈیسن اینڈ سرجری)"
      },
      institution: {
        en: "Accredited Medical University, Punjab, Pakistan [CONFIRM WITH CLIENT]",
        ur: "مستند میڈیکل یونیورسٹی، پنجاب، پاکستان [کلائنٹ سے تصدیق طلب]"
      },
      year: "[CONFIRM WITH CLIENT]",
      note: {
        en: "Foundational medical and surgical training with house job rotation in OB/GYN.",
        ur: "بنیادی طبی و جراحی تعلیم بمعہ گائنی و زچگی ہاؤس جاب ٹریننگ۔"
      }
    }
  ],
  // [CONFIRM WITH CLIENT — Confirm active society memberships before launch]
  memberships: [
    {
      en: "Registered Medical Practitioner — Pakistan Medical & Dental Council (PMDC) [CONFIRM WITH CLIENT]",
      ur: "رجسٹرڈ میڈیکل پریکٹیشنر — پاکستان میڈیکل اینڈ ڈینٹل کونسل (PMDC) [کلائنٹ سے تصدیق طلب]"
    },
    {
      en: "Member — College of Physicians and Surgeons Pakistan (CPSP) [CONFIRM WITH CLIENT]",
      ur: "ممبر — کالج آف فزیشنز اینڈ سرجنز پاکستان (CPSP) [کلائنٹ سے تصدیق طلب]"
    },
    {
      en: "Society of Obstetricians & Gynaecologists of Pakistan (SOGP) — [CONFIRM WITH CLIENT]",
      ur: "سوسائٹی آف آبسٹیٹریشنز اینڈ گائناکالوجسٹس آف پاکستان (SOGP) — [کلائنٹ سے تصدیق طلب]"
    }
  ],
  whatsappNumberE164: "+923101777649",
  whatsappUrl: "https://wa.me/923101777649",
  primaryPhoneDisplay: "+92 310 1777649",
  primaryPhoneTel: "tel:+923101777649",
  socials: {
    instagram: {
      url: "https://www.instagram.com/dr.tooba_gynecologist",
      handle: "@dr.tooba_gynecologist"
    },
    facebook: {
      url: "https://www.facebook.com/drtoobgynecologist",
      handle: "/drtoobgynecologist"
    }
  },
  seoKeywords: [
    "gynecologist in Multan",
    "gynecologist in Khangarh",
    "female gynecologist",
    "PCOS treatment Multan",
    "antenatal care Multan",
    "Dr Tooba Iqbal gynecologist",
    "obstetrician in Multan",
    "maternity clinic Gillani Colony Multan",
    "Awan Surgical Centre Khangarh gynecologist"
  ],
  emergencyDisclaimer: {
    en: "Emergency Medical Notice: This website and appointment request form are for routine outpatient scheduling only. If you are experiencing severe abdominal pain, heavy vaginal bleeding, reduced fetal movement, high fever, labour contractions, or any medical emergency, please proceed immediately to the nearest hospital emergency department.",
    ur: "ہنگامی طبی انتباہ: یہ ویب سائٹ اور اپائنٹمنٹ فارم صرف عام کلینک کے وقت کے حصول کے لیے ہیں۔ اگر آپ کو شدید پیٹ درد، زیادہ خون آنا، بچے کی حرکت میں کمی، تیز بخار، زچگی کا درد یا کوئی بھی ہنگامی طبی صورتحال درپیش ہو تو فوراً قریبی ہسپتال کے ایمرجنسی وارڈ سے رجوع کریں۔"
  },
  educationalDisclaimer: {
    en: "Medical Disclaimer: All health articles, service descriptions, and FAQs on this website are provided strictly for general patient education. They do not constitute personal medical diagnosis, treatment, or a doctor-patient relationship. Always consult Dr. Tooba Iqbal or a qualified healthcare provider in person regarding your specific clinical symptoms.",
    ur: "طبی وضاحت: اس ویب سائٹ پر موجود تمام مضامین، خدمات کی تفصیل اور سوالات و جوابات صرف معلوماتی مقاصد کے لیے ہیں۔ یہ ذاتی تشخیص یا علاج کا نعم البدل نہیں ہیں۔ اپنی مخصوص علامات کے لیے ہمیشہ ڈاکٹر طوبیٰ اقبال یا مستند معالج سے بالمشافہ معائنہ کروائیں۔"
  },
  // [CONFIRM WITH CLIENT — Confirm privacy contact email address]
  dataDeletionEmail: "privacy@drtoobaiqbal.com"
};

/**
 * Helper to build a pre-filled WhatsApp booking or inquiry URL.
 */
export function buildWhatsAppUrl(message?: string, locale: Locale = "en"): string {
  const base = siteConfig.whatsappUrl;
  if (!message) {
    const defaultGreeting =
      locale === "ur"
        ? "السلام علیکم، مجھے ڈاکٹر طوبیٰ اقبال سے اپائنٹمنٹ کے بارے میں معلومات درکار ہیں۔"
        : "Assalam-o-Alaikum, I would like to book an appointment with Dr. Tooba Iqbal.";
    return `${base}?text=${encodeURIComponent(defaultGreeting)}`;
  }
  return `${base}?text=${encodeURIComponent(message)}`;
}
