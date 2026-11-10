import type { LocalizedText } from "./site";

export interface PatientTestimonial {
  id: string;
  /**
   * PMDC & Patient Privacy Guardrail:
   * Must remain `false` until documented written patient consent is obtained on file.
   * `TestimonialsSection.tsx` strictly filters by `entry.consent === true`.
   */
  consent: boolean;
  /**
   * Anonymized general category label ONLY (never include real patient names,
   * photos, ultrasound scans, or identifiable attributes).
   */
  categoryLabel: LocalizedText;
  cityLabel: LocalizedText;
  quote: LocalizedText;
}

/**
 * Consent-Gated Patient Testimonials (`content/testimonials.ts`)
 *
 * [CONFIRM WITH CLIENT — All entries ship with `consent: false` by default
 * so the Testimonials section renders `null` (hidden) until documented written
 * patient consent is obtained. Never add outcome guarantees or identifiable PII.]
 */
export const testimonials: PatientTestimonial[] = [
  {
    id: "testimonial-antenatal-multan",
    consent: false,
    categoryLabel: {
      en: "Antenatal Care Patient",
      ur: "حمل اور زچگی کی مریضہ"
    },
    cityLabel: {
      en: "Multan Clinic",
      ur: "ملتان کلینک"
    },
    quote: {
      en: "Dr. Tooba explained every stage of my pregnancy checkups calmly and answered all my family's questions with patience and respect.",
      ur: "ڈاکٹر طوبیٰ نے میرے حمل کے ہر مرحلے کی تفصیل بہت تحمل سے سمجھائی اور میرے تمام سوالات کے تسلی بخش جوابات دیے۔"
    }
  },
  {
    id: "testimonial-pcos-multan",
    consent: false,
    categoryLabel: {
      en: "Hormonal & PCOS Consultation",
      ur: "پی سی او ایس اور ہارمونل مشاورت"
    },
    cityLabel: {
      en: "Multan Clinic",
      ur: "ملتان کلینک"
    },
    quote: {
      en: "The clinic environment is very comfortable and private. Having clear guidance on lifestyle and hormonal care made a meaningful difference.",
      ur: "کلینک کا ماحول انتہائی باوقار اور رازدارانہ ہے۔ طرزِ زندگی اور ہارمونل علاج کے بارے میں واضح رہنمائی سے مجھے بہت فائدہ ہوا۔"
    }
  },
  {
    id: "testimonial-khangarh-care",
    consent: false,
    categoryLabel: {
      en: "Women's Health Consultation",
      ur: "خواتین کی صحت کا معائنہ"
    },
    cityLabel: {
      en: "Khangarh Clinic",
      ur: "خان گڑھ کلینک"
    },
    quote: {
      en: "Having a specialist female gynecologist available in Khangarh on Mondays makes regular maternity follow-ups much easier for our family.",
      ur: "پیر کے روز خان گڑھ میں ماہر لیڈی گائناکالوجسٹ کی دستیابی سے ہمارے خاندان کے لیے باقاعدہ چیک اپ کروانا بہت آسان ہو گیا ہے۔"
    }
  }
];

export function getConsentedTestimonials(): PatientTestimonial[] {
  return testimonials.filter((entry) => entry.consent === true);
}
