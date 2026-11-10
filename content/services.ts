import type { LocalizedText } from "./site";

export type ServiceSlug =
  | "antenatal-postnatal-care"
  | "infertility-family-planning"
  | "pcos-hormonal-health"
  | "general-gynecology";

export type CoreFocusIconName =
  | "calendar-heart"
  | "baby"
  | "sparkles"
  | "shield-plus"
  | "activity";

export interface CoreFocusItem {
  id: string;
  serviceSlug: ServiceSlug;
  blogSlug: string;
  icon: CoreFocusIconName;
  title: LocalizedText;
  summary: LocalizedText;
  badge: LocalizedText;
}

export interface FaqItem {
  id: string;
  question: LocalizedText;
  answer: LocalizedText;
}

export interface ClinicalService {
  slug: ServiceSlug;
  icon: CoreFocusIconName;
  title: LocalizedText;
  subtitle: LocalizedText;
  shortDescription: LocalizedText;
  whatItIs: LocalizedText;
  whenToSeeDoctor: LocalizedText[];
  whatToExpect: LocalizedText[];
  keyHighlights: LocalizedText[];
  faqs: FaqItem[];
  seoTitle: LocalizedText;
  seoDescription: LocalizedText;
  whatsappInquiryText: LocalizedText;
}

/**
 * 5 Core Health Focus Cards for the Home Page (`CoreFocusGrid.tsx`).
 * Every card links directly to `/services#[slug]` and its dedicated detail page.
 *
 * [CONFIRM WITH CLIENT — Review clinical descriptions before public launch]
 */
export const coreFocusItems: CoreFocusItem[] = [
  {
    id: "focus-turning-30",
    serviceSlug: "general-gynecology",
    blogSlug: "turning-30-reproductive-health",
    icon: "calendar-heart",
    badge: {
      en: "Preventive Care",
      ur: "احتیاطی صحت"
    },
    title: {
      en: "Reproductive Health & Turning 30 Care",
      ur: "تولیدی صحت اور 30 سال کے بعد نگہداشت"
    },
    summary: {
      en: "Proactive checkups for cycle shifts, fertility awareness, thyroid & metabolic screening, and cervical health as you enter your 30s.",
      ur: "30 سال کی عمر میں قدم رکھنے پر ماہواری کی تبدیلیوں، تولیدی صحت، تھائی رائیڈ اور احتیاطی معائنے کے لیے جامع رہنمائی۔"
    }
  },
  {
    id: "focus-antenatal",
    serviceSlug: "antenatal-postnatal-care",
    blogSlug: "pregnancy-cramps-vs-labour",
    icon: "baby",
    badge: {
      en: "Maternity Care",
      ur: "حمل و زچگی"
    },
    title: {
      en: "Antenatal Care & Pregnancy",
      ur: "حمل کی نگہداشت اور زچگی کا معائنہ"
    },
    summary: {
      en: "Structured trimester-by-trimester pregnancy monitoring, 8-week Crown-Rump Length (CRL) dating scans, nutritional guidance, and safe delivery planning.",
      ur: "حمل کے ہر سہ ماہی مرحلے کی نگرانی، 8 ہفتے کا ابتدائی الٹراساؤنڈ (CRL)، غذائی رہنمائی اور محفوظ زچگی کی منصوبہ بندی۔"
    }
  },
  {
    id: "focus-pcos-infertility",
    serviceSlug: "pcos-hormonal-health",
    blogSlug: "understanding-pcos-hormonal-balance",
    icon: "sparkles",
    badge: {
      en: "Hormonal & Fertility",
      ur: "ہارمونز اور زرخیزی"
    },
    title: {
      en: "PCOS, Hormonal Balance & Infertility Treatments",
      ur: "پی سی او ایس (PCOS)، ہارمونل توازن اور بانجھ پن کا علاج"
    },
    summary: {
      en: "Evidence-based evaluation for irregular periods, Polycystic Ovary Syndrome (PCOS), ovulation tracking, and compassionate couple fertility support.",
      ur: "بے قاعدہ ماہواری، پی سی او ایس، بیضہ دانی کی کارکردگی (Ovulation) اور اولاد کے حصول کے لیے جدید طبی اصولوں پر مبنی مشاورت۔"
    }
  },
  {
    id: "focus-uti-infections",
    serviceSlug: "general-gynecology",
    blogSlug: "uti-prevention-and-care",
    icon: "shield-plus",
    badge: {
      en: "Confidential Treatment",
      ur: "رازدارانہ علاج"
    },
    title: {
      en: "UTI & Common Women's Health Issues",
      ur: "پیشاب کی نالی کا انفیکشن (UTI) اور خواتین کے عام مسائل"
    },
    summary: {
      en: "Timely, private diagnosis and relief for urinary tract infections, pelvic discomfort, vaginal infections, and heavy or painful menstruation.",
      ur: "پیشاب میں جلن یا انفیکشن (UTI)، پیڑو کا درد، نسوانی انفیکشن اور تکلیف دہ ماہواری کا باوقار اور رازدارانہ علاج۔"
    }
  },
  {
    id: "focus-pregnancy-symptoms",
    serviceSlug: "antenatal-postnatal-care",
    blogSlug: "pregnancy-cramps-vs-labour",
    icon: "activity",
    badge: {
      en: "Maternal Safety",
      ur: "ماں اور بچے کی حفاظت"
    },
    title: {
      en: "Pregnancy Symptoms Guide (Cramps vs. Labour)",
      ur: "حمل کی علامات کی رہنمائی (عام کھنچاؤ بمقابلہ زچگی کا درد)"
    },
    summary: {
      en: "Clear clinical guidance on distinguishing normal pregnancy stretching and Braxton Hicks from true labour contractions and warning signs.",
      ur: "حمل کے دوران پیٹ کے عام کھنچاؤ اور حقیقی زچگی کے درد (Labour Pain) میں فرق پہچاننے اور بروقت ہسپتال رجوع کرنے کی اہم معلومات۔"
    }
  }
];

/**
 * 4 Clinical Service Categories (`content/services.ts`).
 * Powers `/[locale]/services` and `/[locale]/services/[slug]`.
 *
 * [CONFIRM WITH CLIENT — Review clinical scope and patient preparation notes]
 */
export const clinicalServices: ClinicalService[] = [
  {
    slug: "antenatal-postnatal-care",
    icon: "baby",
    title: {
      en: "Antenatal & Postnatal Care",
      ur: "حمل سے پہلے، دورانِ حمل اور زچگی کے بعد نگہداشت"
    },
    subtitle: {
      en: "Comprehensive pregnancy monitoring, 8-week CRL scans, high-risk obstetrics, and postpartum recovery in Multan & Khangarh.",
      ur: "ملتان اور خان گڑھ میں حمل کی مکمل نگرانی، 8 ہفتے کا ابتدائی الٹراساؤنڈ، ہائی رسک حمل اور زچگی کے بعد کی دیکھ بھال۔"
    },
    shortDescription: {
      en: "8-week CRL dating scans, regular trimester checkups, high-risk pregnancy monitoring, ultrasound guidance, and postnatal maternal care.",
      ur: "8 ہفتے کا ابتدائی اسکین، باقاعدہ چیک اپ، ہائی رسک حمل کی نگرانی، الٹراساؤنڈ رہنمائی اور زچگی کے بعد ماں کی صحت۔"
    },
    whatItIs: {
      en: "Antenatal and postnatal care provides continuous medical support for both mother and baby from conception through childbirth and the six-week postpartum recovery period. Early consultations include confirming fetal viability and accurate gestational age via an 8-week Crown-Rump Length (CRL) ultrasound scan, monitoring blood pressure and hemoglobin, and identifying gestational diabetes or hypertension early.",
      ur: "حمل اور زچگی کے بعد کی نگہداشت کا مقصد ماں اور بچے دونوں کی صحت کو حمل کے آغاز سے لے کر پیدائش اور زچگی کے بعد کے ابتدائی ہفتوں تک محفوظ بنانا ہے۔ اس میں 8 ہفتے کی عمر میں ابتدائی الٹراساؤنڈ (CRL Scan) کے ذریعے بچے کی نشوونما اور متوقع تاریخِ پیدائش کا درست تعین، بلڈ پریشر، خون کی کمی (ہیموگلوبن) اور شوگر کی بروقت جانچ شامل ہے۔"
    },
    whenToSeeDoctor: [
      {
        en: "As soon as you have a positive home pregnancy test or miss a menstrual period (ideally between 6 and 8 weeks for an initial CRL dating scan).",
        ur: "گھر پر حمل کا ٹیسٹ مثبت آتے ہی یا ماہواری رکنے کے فوراً بعد (بہتر ہے کہ 6 سے 8 ہفتے کے درمیان ابتدائی الٹراساؤنڈ کروایا جائے)۔"
      },
      {
        en: "If you have a history of high blood pressure, diabetes, thyroid disorders, previous Cesarean section, or recurrent pregnancy loss.",
        ur: "اگر آپ کو پہلے سے ہائی بلڈ پریشر، شوگر، تھائی رائیڈ، سابقہ آپریشن (C-Section) یا بار بار حمل ضائع ہونے کا مسئلہ رہا ہو۔"
      },
      {
        en: "If you experience persistent nausea/vomiting, abdominal cramping, spotting, swelling of hands/feet, or changes in fetal movement.",
        ur: "اگر دورانِ حمل شدید متلی، پیٹ میں درد، خون کے دھبے، ہاتھ پاؤں پر سوجن یا بچے کی حرکت میں کمی محسوس ہو۔"
      },
      {
        en: "Six weeks after delivery (or earlier if needed) for incision/perineal healing check, breastfeeding support, and family spacing advice.",
        ur: "زچگی کے بعد ٹانکوں کی صحت یابی، دودھ پلانے سے متعلق رہنمائی اور خاندانی وقفے کے مشورے کے لیے۔"
      }
    ],
    whatToExpect: [
      {
        en: "Detailed medical & obstetric history review in a calm, respectful consultation room.",
        ur: "پرسکون اور باوقار ماحول میں آپ کی سابقہ طبی اور زچگی کی مکمل ہسٹری کا جائزہ۔"
      },
      {
        en: "Baseline vitals (blood pressure, weight), gestational dating via ultrasound (8-week CRL scan and growth scans), and essential blood/urine screening.",
        ur: "بلڈ پریشر اور وزن کا معائنہ، الٹراساؤنڈ کے ذریعے بچے کی نشوونما کی جانچ اور ضروری خون و پیشاب کے ٹیسٹ۔"
      },
      {
        en: "Personalized trimester nutrition plan (folic acid, iron, calcium, vitamin D) tailored for Southern Punjab dietary habits.",
        ur: "حمل کے مرحلے کے مطابق فولک ایسڈ، آئرن، کیلشیم اور متوازن خوراک کا باقاعدہ شیڈول۔"
      },
      {
        en: "Clear guidance on distinguishing normal pregnancy discomforts from true labour symptoms, plus a structured delivery plan.",
        ur: "حمل کی عام علامات اور زچگی کے حقیقی درد میں فرق کی وضاحت اور محفوظ ڈلیوری کی منصوبہ بندی۔"
      }
    ],
    keyHighlights: [
      {
        en: "8-Week Crown-Rump Length (CRL) Early Pregnancy & Viability Scans",
        ur: "8 ہفتے کا ابتدائی حمل اور نشوونما کا الٹراساؤنڈ اسکین (CRL)"
      },
      {
        en: "Routine First, Second & Third Trimester Antenatal Checkups",
        ur: "پہلی، دوسری اور تیسری سہ ماہی کے باقاعدہ چیک اپ"
      },
      {
        en: "High-Risk Pregnancy Monitoring (Anemia, Gestational Diabetes, Pre-eclampsia)",
        ur: "ہائی رسک حمل کی خصوصی نگرانی (خون کی کمی، شوگر اور بلڈ پریشر)"
      },
      {
        en: "Postnatal Recovery, Lactation Guidance & Maternal Wellness",
        ur: "زچگی کے بعد ماں کی صحت یابی اور بچے کی خوراک کی رہنمائی"
      }
    ],
    faqs: [
      {
        id: "faq-antenatal-crl",
        question: {
          en: "Why is the 8-week CRL ultrasound scan important in early pregnancy?",
          ur: "حمل کے آٹھویں ہفتے میں سی آر ایل (CRL) الٹراساؤنڈ اسکین کیوں ضروری ہے؟"
        },
        answer: {
          en: "Between 7 and 10 weeks of pregnancy, measuring the baby's Crown-Rump Length (CRL) provides the most accurate estimated due date (EDD), confirms a healthy intrauterine pregnancy with fetal heartbeat, and identifies twin pregnancies early.",
          ur: "حمل کے 7 سے 10 ہفتوں کے درمیان بچے کی لمبائی (Crown-Rump Length) کی پیمائش سے پیدائش کی متوقع تاریخ (EDD) کا سب سے درست اندازہ ہوتا ہے، دل کی دھڑکن کی تصدیق ہوتی ہے اور صحت مند حمل کا اطمینان ہو جاتا ہے۔"
        }
      },
      {
        id: "faq-antenatal-frequency",
        question: {
          en: "How often should I schedule antenatal visits during pregnancy?",
          ur: "حمل کے دوران ڈاکٹر سے کتنے عرصے بعد معائنہ کروانا چاہیے؟"
        },
        answer: {
          en: "For an uncomplicated pregnancy, visits are typically scheduled every 4 weeks until 28 weeks, every 2 weeks from 28 to 36 weeks, and weekly from 36 weeks until delivery. High-risk pregnancies may require closer monitoring.",
          ur: "نارمل حمل میں 28 ہفتے تک ہر مہینے، 28 سے 36 ہفتے تک ہر دو ہفتے بعد، اور 36 ہفتے سے زچگی تک ہر ہفتے معائنہ تجویز کیا جاتا ہے۔ ہائی رسک حمل میں ڈاکٹر کی ہدایت کے مطابق جلد معائنہ ہو سکتا ہے۔"
        }
      }
    ],
    seoTitle: {
      en: "Antenatal & Pregnancy Care in Multan & Khangarh | Dr. Tooba Iqbal",
      ur: "ملتان اور خان گڑھ میں حمل اور زچگی کی نگہداشت | ڈاکٹر طوبیٰ اقبال"
    },
    seoDescription: {
      en: "Consult Dr. Tooba Iqbal (MBBS, MCPS) for antenatal checkups, 8-week CRL ultrasound guidance, high-risk pregnancy monitoring, and postnatal care in Multan and Khangarh.",
      ur: "ملتان اور خان گڑھ میں حمل کے باقاعدہ معائنے، 8 ہفتے کے الٹراساؤنڈ اور محفوظ زچگی کے لیے ڈاکٹر طوبیٰ اقبال (MBBS, MCPS) سے رجوع کریں۔"
    },
    whatsappInquiryText: {
      en: "Assalam-o-Alaikum, I would like to book an Antenatal / Pregnancy checkup with Dr. Tooba Iqbal.",
      ur: "السلام علیکم، میں ڈاکٹر طوبیٰ اقبال سے حمل کے معائنے (Antenatal Checkup) کے لیے اپائنٹمنٹ لینا چاہتی ہوں۔"
    }
  },
  {
    slug: "infertility-family-planning",
    icon: "calendar-heart",
    title: {
      en: "Infertility & Family Planning",
      ur: "بانجھ پن کی تشخیص اور خاندانی منصوبہ بندی"
    },
    subtitle: {
      en: "Structured fertility workups, ovulation tracking, hormonal evaluation, and confidential family spacing counseling.",
      ur: "اولاد کے حصول کے لیے مکمل طبی جانچ، بیضہ دانی کی نگرانی، ہارمونز کا معائنہ اور خاندانی وقفے کی مشاورت۔"
    },
    shortDescription: {
      en: "Hormonal imbalance assessment, ovulation tracking, follicular monitoring, pre-conception care, and personalized fertility counseling.",
      ur: "ہارمونل عدم توازن کی تشخیص، اوولیشن ٹریکنگ، فولیکلر مانیٹرنگ اور اولاد کے حصول کے لیے جامع مشاورت۔"
    },
    whatItIs: {
      en: "Fertility and family planning care supports couples who are preparing to conceive or experiencing difficulty achieving pregnancy, as well as families seeking safe birth spacing. Rather than rushing into invasive procedures, evaluation begins with a thorough review of cycle regularity, ovulation confirmation, thyroid and prolactin levels, pelvic ultrasound, and male factor baseline testing.",
      ur: "بانجھ پن اور خاندانی منصوبہ بندی کی اس سروس میں ان جوڑوں کی مکمل رہنمائی کی جاتی ہے جو اولاد کے خواہشمند ہیں یا حمل ٹھہرنے میں تاخیر کا سامنا کر رہے ہیں، نیز ان خاندانوں کو بھی مشورہ دیا جاتا ہے جو بچوں کی پیدائش میں محفوظ وقفہ چاہتے ہیں۔ علاج کا آغاز ماہواری کے نظام، ہارمونز، الٹراساؤنڈ اور بنیادی ٹیسٹوں کے مرحلہ وار جائزے سے کیا جاتا ہے۔"
    },
    whenToSeeDoctor: [
      {
        en: "If you are under 35 and have been trying to conceive for 12 months without success, or over 30–35 and trying for 6 months.",
        ur: "اگر آپ کی عمر 35 سال سے کم ہے اور ایک سال کی کوشش کے باوجود حمل نہیں ٹھہرا، یا عمر 30 تا 35 سال سے زائد ہے اور 6 ماہ گزر چکے ہیں۔"
      },
      {
        en: "If you have irregular, absent, or very painful menstrual cycles, or a known diagnosis of PCOS or endometriosis.",
        ur: "اگر آپ کی ماہواری بے قاعدہ ہے، وقت پر نہیں آتی، شدید درد کے ساتھ آتی ہے یا آپ کو پی سی او ایس (PCOS) کا مسئلہ ہے۔"
      },
      {
        en: "If you have experienced two or more consecutive miscarriages and want a pre-conception workup.",
        ur: "اگر پہلے دو یا زائد بار حمل ضائع (Miscarriage) ہو چکا ہو اور آپ اگلے حمل سے قبل مکمل معائنہ کروانا چاہتی ہوں۔"
      },
      {
        en: "When seeking safe, reversible contraceptive options for healthy birth spacing after childbirth.",
        ur: "زچگی کے بعد ماں اور بچے کی صحت کے لیے محفوظ خاندانی وقفے کے طریقوں پر مشاورت کے لیے۔"
      }
    ],
    whatToExpect: [
      {
        en: "Private, judgment-free consultation reviewing both partners' medical history and timeline.",
        ur: "مکمل رازداری اور احترام کے ساتھ میاں بیوی کی طبی ہسٹری اور سابقہ رپورٹس کا تفصیلی جائزہ۔"
      },
      {
        en: "Targeted cycle-day hormone profile (FSH, LH, AMH, TSH, Prolactin) and pelvic ultrasound follicular tracking.",
        ur: "ماہواری کے مخصوص دنوں میں ہارمونز کے ٹیسٹ اور الٹراساؤنڈ کے ذریعے انڈے بننے کے عمل (Follicular Study) کی نگرانی۔"
      },
      {
        en: "Evidence-based ovulation induction, metabolic optimization, and timed guidance when clinically indicated.",
        ur: "ضرورت کے مطابق اوولیشن کی ادویات، طرزِ زندگی میں بہتری اور حمل کے موزوں دنوں کی رہنمائی۔"
      },
      {
        en: "Clear discussion of next steps, including tubal patency evaluation or tertiary reproductive referral when appropriate.",
        ur: "علاج کے ہر مرحلے کی شفاف وضاحت اور ضرورت پڑنے پر ٹیوبز کے ٹیسٹ یا مزید اعلیٰ مراکز کی طرف بروقت رہنمائی۔"
      }
    ],
    keyHighlights: [
      {
        en: "Pre-Conception Health & Folate/Rubella Readiness Check",
        ur: "حمل سے قبل صحت کا جائزہ اور حفاظتی تیاری"
      },
      {
        en: "Ovulation Tracking & Follicular Ultrasound Monitoring",
        ur: "اوولیشن ٹریکنگ اور فولیکلر الٹراساؤنڈ مانیٹرنگ"
      },
      {
        en: "Secondary Infertility & Recurrent Pregnancy Loss Evaluation",
        ur: "ثانوی بانجھ پن اور بار بار حمل ضائع ہونے کی وجوہات کی تشخیص"
      },
      {
        en: "Confidential Postpartum Contraception & Birth Spacing Counseling",
        ur: "بچوں کی پیدائش میں محفوظ وقفے کے لیے رازدارانہ مشاورت"
      }
    ],
    faqs: [
      {
        id: "faq-fertility-bring-reports",
        question: {
          en: "Should I bring previous lab reports and ultrasounds to my first fertility visit?",
          ur: "کیا پہلے معائنے پر اپنی پرانی لیبارٹری رپورٹس اور الٹراساؤنڈ ساتھ لانا ضروری ہیں؟"
        },
        answer: {
          en: "Yes. Bringing any previous hormone tests, pelvic ultrasounds, HSG reports, or semen analysis helps avoid repeating unnecessary tests and saves both time and cost.",
          ur: "جی ہاں۔ اپنے سابقہ ہارمون ٹیسٹ، الٹراساؤنڈ یا دیگر رپورٹس ساتھ لانے سے غیر ضروری ٹیسٹ دوبارہ کروانے کی ضرورت نہیں پڑتی اور وقت و اخراجات کی بچت ہوتی ہے۔"
        }
      },
      {
        id: "faq-fertility-cycle-day",
        question: {
          en: "Which day of my menstrual cycle is best for a fertility evaluation?",
          ur: "بانجھ پن کے معائنے کے لیے ماہواری کے کون سے دن آنا بہتر ہوتا ہے؟"
        },
        answer: {
          en: "You can schedule an initial consultation on any day. If baseline hormone blood tests or follicular scans are needed, Dr. Tooba will guide you on scheduling them specifically on Day 2–3 or Day 10–14 of your cycle.",
          ur: "ابتدائی مشاورت کسی بھی دن کی جا سکتی ہے۔ اگر مخصوص ہارمون ٹیسٹ یا فولیکلر اسکین درکار ہوں تو ڈاکٹر طوبیٰ آپ کو ماہواری کے دوسرے/تیسرے دن یا دسویں سے چودہویں دن بلانے کی رہنمائی کریں گی۔"
        }
      }
    ],
    seoTitle: {
      en: "Infertility & Family Planning Specialist in Multan & Khangarh | Dr. Tooba Iqbal",
      ur: "ملتان اور خان گڑھ میں بانجھ پن اور فیملی پلاننگ کا علاج | ڈاکٹر طوبیٰ اقبال"
    },
    seoDescription: {
      en: "Confidential fertility assessment, ovulation tracking, hormonal evaluation, and family planning care with Dr. Tooba Iqbal (MBBS, MCPS) in Multan and Khangarh.",
      ur: "ملتان اور خان گڑھ میں اولاد کے حصول کی مشاورت، اوولیشن ٹریکنگ اور ہارمونل علاج کے لیے ڈاکٹر طوبیٰ اقبال سے وقت لیں۔"
    },
    whatsappInquiryText: {
      en: "Assalam-o-Alaikum, I would like to schedule a Fertility / Family Planning consultation with Dr. Tooba Iqbal.",
      ur: "السلام علیکم، میں ڈاکٹر طوبیٰ اقبال سے فرٹیلٹی / فیملی پلاننگ مشاورت کے لیے اپائنٹمنٹ لینا چاہتی ہوں۔"
    }
  },
  {
    slug: "pcos-hormonal-health",
    icon: "sparkles",
    title: {
      en: "Hormonal Health & PCOS",
      ur: "ہارمونل صحت اور پی سی او ایس (PCOS) کا علاج"
    },
    subtitle: {
      en: "Long-term management for Polycystic Ovary Syndrome (PCOS), irregular periods, insulin resistance, and hormonal skin/hair symptoms.",
      ur: "پولی سسٹک اووری سنڈروم (PCOS)، بے قاعدہ ماہواری، وزن کے مسائل اور ہارمونل تبدیلیوں کا جامع علاج۔"
    },
    shortDescription: {
      en: "Irregular cycles, PCOS management, weight & insulin resistance support, hirsutism/acne care, and perimenopausal hormonal balance.",
      ur: "بے قاعدہ ماہواری، پی سی او ایس، وزن اور انسولین کا توازن، چہرے کے غیر ضروری بال/کیل مہاسے اور ہارمونل مسائل۔"
    },
    whatItIs: {
      en: "Polycystic Ovary Syndrome (PCOS) and related endocrine conditions are among the most common hormonal concerns affecting young women and mothers in Pakistan. PCOS is not simply 'cysts on the ovaries'—it is a metabolic and hormonal condition involving irregular ovulation, androgen excess, and often insulin resistance. Effective management combines personalized nutrition, metabolic care, cycle regulation, and fertility-preserving medical therapy.",
      ur: "پولی سسٹک اووری سنڈروم (PCOS) اور ہارمونز کا عدم توازن پاکستان میں نوجوان لڑکیوں اور خواتین میں پایا جانے والا ایک عام لیکن قابلِ علاج مسئلہ ہے۔ اس کی وجہ سے ماہواری میں بے قاعدگی، وزن میں اضافہ، چہرے پر غیر ضروری بال یا کیل مہاسے اور حمل ٹھہرنے میں دشواری ہو سکتی ہے۔ درست تشخیص، متوازن طرزِ زندگی اور مناسب ادویات سے اس کیفیت کو بہترین طریقے سے کنٹرول کیا جا سکتا ہے۔"
    },
    whenToSeeDoctor: [
      {
        en: "Your menstrual cycles consistently come more than 35 days apart, fewer than 8 times a year, or stop for several months.",
        ur: "اگر آپ کی ماہواری 35 دن سے زیادہ کے وقفے سے آتی ہے، سال میں آٹھ بار سے کم ہوتی ہے یا کئی ماہ تک رک جاتی ہے۔"
      },
      {
        en: "You notice unexplained weight gain around the waist, persistent hormonal acne, thinning scalp hair, or excess facial/body hair (hirsutism).",
        ur: "اگر وزن میں تیزی سے اضافہ ہو، چہرے یا جسم پر غیر معمولی بال آئیں، کیل مہاسے ہوں یا سر کے بال تیزی سے گر رہے ہوں۔"
      },
      {
        en: "You have been told you have 'polycystic ovaries' on an ultrasound and want to understand what it means for your future marriage or pregnancy.",
        ur: "اگر الٹراساؤنڈ میں پی سی او (PCO) بتایا گیا ہو اور آپ اپنی صحت یا مستقبل کی ازدواجی زندگی کے بارے میں درست رہنمائی چاہتی ہوں۔"
      },
      {
        en: "You experience mood changes, severe premenstrual symptoms (PMS), hot flashes, or cycle changes in your late 30s and 40s.",
        ur: "اگر آپ کو ماہواری سے قبل شدید مزاج کی تبدیلی، تھکن یا 35 سے 45 سال کی عمر میں ہارمونل تبدیلیاں محسوس ہو رہی ہوں۔"
      }
    ],
    whatToExpect: [
      {
        en: "Diagnosis using international Rotterdam criteria—evaluating clinical symptoms, hormone levels, and ultrasound findings together rather than relying on ultrasound alone.",
        ur: "عالمی طبی معیار (Rotterdam Criteria) کے مطابق علامات، ہارمون ٹیسٹ اور الٹراساؤنڈ تینوں کو مدنظر رکھتے ہوئے مستند تشخیص۔"
      },
      {
        en: "Screening for insulin resistance, thyroid function (TSH), prolactin, and vitamin D deficiency.",
        ur: "انسولین ریزسٹنس، تھائی رائیڈ (TSH)، پرولیکٹن اور وٹامن ڈی کی کمی کی جانچ۔"
      },
      {
        en: "Goal-oriented treatment tailored to whether you are an unmarried young woman seeking cycle regularity or a married woman planning pregnancy.",
        ur: "غیر شادی شدہ بچیوں کے لیے ماہواری کی باقاعدگی اور شادی شدہ خواتین کے لیے حمل کے حصول کے مطابق الگ اور محفوظ علاج۔"
      },
      {
        en: "Practical, sustainable Pakistani dietary and physical activity guidance without crash dieting.",
        ur: "روزمرہ پاکستانی خوراک کے مطابق قابلِ عمل غذائی اور طرزِ زندگی کی ہدایات۔"
      }
    ],
    keyHighlights: [
      {
        en: "Adolescent & Adult PCOS Diagnosis & Cycle Regulation",
        ur: "نوجوان لڑکیوں اور خواتین میں پی سی او ایس کی تشخیص اور ماہواری کی بحالی"
      },
      {
        en: "Insulin Resistance, Metabolic Health & Sustainable Weight Guidance",
        ur: "انسولین ریزسٹنس، میٹابولزم اور وزن کے توازن کی رہنمائی"
      },
      {
        en: "Medical Care for Hormonal Acne & Hirsutism (Excess Facial Hair)",
        ur: "ہارمونل کیل مہاسوں اور غیر ضروری بالوں کا طبی علاج"
      },
      {
        en: "Thyroid, Prolactin & Perimenopausal Hormone Evaluation",
        ur: "تھائی رائیڈ، پرولیکٹن اور مینوپاز سے متعلق ہارمونل مسائل کا حل"
      }
    ],
    faqs: [
      {
        id: "faq-pcos-pregnancy",
        question: {
          en: "Can women with PCOS have a healthy pregnancy?",
          ur: "کیا پی سی او ایس (PCOS) کی مریضہ نارمل حمل اور اولاد کی نعمت حاصل کر سکتی ہیں؟"
        },
        answer: {
          en: "Yes, the vast majority of women with PCOS conceive successfully with appropriate lifestyle adjustments, insulin-sensitizing care, and targeted ovulation support when needed. Early management significantly improves reproductive outcomes.",
          ur: "جی ہاں، پی سی او ایس کا مطلب ہرگز مستقل بانجھ پن نہیں ہے۔ درست طرزِ زندگی، ہارمونل توازن اور ڈاکٹر کی نگرانی میں ادویات کے استعمال سے اکثر خواتین کامیابی سے ماں بنتی ہیں۔"
        }
      },
      {
        id: "faq-pcos-unmarried",
        question: {
          en: "Is it safe for unmarried young women to seek treatment for irregular periods?",
          ur: "کیا غیر شادی شدہ لڑکیوں کے لیے بے قاعدہ ماہواری کا علاج کروانا محفوظ ہے؟"
        },
        answer: {
          en: "Absolutely. Addressing irregular cycles, anemia, or PCOS early in adolescence or young adulthood protects uterine health, improves skin and metabolic wellness, and never requires invasive examinations.",
          ur: "بالکل۔ غیر شادی شدہ بچیوں میں ماہواری کی بے قاعدگی یا خون کی کمی کا بروقت علاج مستقبل کی صحت کے لیے نہایت اہم ہے اور اس میں صرف بیرونی پیٹ کا الٹراساؤنڈ اور خون کے ٹیسٹ کیے جاتے ہیں۔"
        }
      }
    ],
    seoTitle: {
      en: "PCOS Treatment & Hormonal Balance in Multan & Khangarh | Dr. Tooba Iqbal",
      ur: "ملتان اور خان گڑھ میں پی سی او ایس (PCOS) اور ہارمونل علاج | ڈاکٹر طوبیٰ اقبال"
    },
    seoDescription: {
      en: "Evidence-based PCOS treatment, irregular period care, and hormonal health management by Dr. Tooba Iqbal (MBBS, MCPS) in Multan and Khangarh.",
      ur: "ملتان اور خان گڑھ میں بے قاعدہ ماہواری اور پی سی او ایس (PCOS) کے مستند علاج کے لیے ڈاکٹر طوبیٰ اقبال سے مشورہ کریں۔"
    },
    whatsappInquiryText: {
      en: "Assalam-o-Alaikum, I would like to book a PCOS / Hormonal Health consultation with Dr. Tooba Iqbal.",
      ur: "السلام علیکم، میں ڈاکٹر طوبیٰ اقبال سے پی سی او ایس / ہارمونل مسائل کے معائنے کے لیے اپائنٹمنٹ لینا چاہتی ہوں۔"
    }
  },
  {
    slug: "general-gynecology",
    icon: "shield-plus",
    title: {
      en: "General Gynecology",
      ur: "عمومی امراضِ نسواں اور احتیاطی صحت"
    },
    subtitle: {
      en: "Confidential treatment for UTIs, pelvic pain, abnormal uterine bleeding, fibroids, and preventive wellness screenings after age 30.",
      ur: "پیشاب کی نالی کے انفیکشن (UTI)، پیڑو کے درد، زیادہ ماہواری، رسولیوں اور 30 سال کے بعد احتیاطی چیک اپ۔"
    },
    shortDescription: {
      en: "UTIs, pelvic pain, menstrual irregularities, vaginal infections, ovarian cysts/fibroids, and preventive screenings after 30.",
      ur: "پیشاب کا انفیکشن، پیڑو کا درد، ماہواری کی خرابیاں، نسوانی انفیکشن اور 30 سال کے بعد احتیاطی معائنے۔"
    },
    whatItIs: {
      en: "General gynecology covers everyday symptoms that affect a woman's comfort, energy, and long-term reproductive health—including urinary tract infections (UTIs), vaginal discharge or itching, painful or heavy menstrual bleeding (menorrhagia), uterine fibroids, ovarian cysts, and routine preventive checkups after turning 30. Early evaluation prevents chronic discomfort and anemia.",
      ur: "عمومی امراضِ نسواں کے تحت ان تمام طبی مسائل کا علاج کیا جاتا ہے جو خواتین کی روزمرہ زندگی اور صحت کو متاثر کرتے ہیں—جیسے پیشاب کی نالی کا انفیکشن (UTI)، نسوانی خارجہ یا خارش، ماہواری میں شدید درد یا ضرورت سے زیادہ خون آنا، رحم کی رسولیاں (Fibroids)، اووری کی سسٹ اور 30 سال کی عمر کے بعد احتیاطی طبی معائنہ۔"
    },
    whenToSeeDoctor: [
      {
        en: "Burning sensation during urination, frequent urge to urinate, cloudy urine, or lower abdominal/back pain (signs of a UTI).",
        ur: "پیشاب کرتے وقت جلن، بار بار پیشاب کی حاجت، پیشاب کا رنگ گدلا ہونا یا ناف کے نیچے اور کمر میں درد (UTI کی علامات)۔"
      },
      {
        en: "Heavy menstrual bleeding that lasts longer than 7 days, passes large clots, or causes fatigue and low hemoglobin (anemia).",
        ur: "ماہواری کا 7 دن سے زیادہ جاری رہنا، بہت زیادہ خون آنا یا اس کے باعث شدید کمزوری اور خون کی کمی ہونا۔"
      },
      {
        en: "Unusual vaginal discharge, persistent itching, pelvic pressure, or bleeding between periods.",
        ur: "غیر معمولی نسوانی رطوبت، خارش، پیڑو میں بوجھ یا ماہواری کے دنوں کے علاوہ خون کے دھبے آنا۔"
      },
      {
        en: "You have recently turned 30 and want a comprehensive preventive women's health and cervical screening review.",
        ur: "اگر آپ کی عمر 30 سال یا اس سے زائد ہو چکی ہے اور آپ اپنی مکمل احتیاطی صحت اور اسکریننگ کروانا چاہتی ہیں۔"
      }
    ],
    whatToExpect: [
      {
        en: "Respectful, private symptom review where you can discuss sensitive concerns comfortably.",
        ur: "مکمل رازداری اور احترام کے ساتھ معائنہ جہاں آپ بلا جھجھک اپنا مسئلہ بیان کر سکتی ہیں۔"
      },
      {
        en: "Focused diagnostic testing such as routine urine examination/culture for UTIs, CBC for anemia, or pelvic ultrasound for fibroids and cysts.",
        ur: "ضرورت کے مطابق پیشاب کا ٹیسٹ (Urine R/E & Culture)، خون کی کمی کی جانچ (CBC) یا پیٹ کا الٹراساؤنڈ۔"
      },
      {
        en: "Targeted antibiotic or medical therapy to resolve acute infections and prevent recurrent UTIs.",
        ur: "انفیکشن کے مکمل خاتمے اور اسے دوبارہ ہونے سے روکنے کے لیے مستند ادویات اور احتیاطی تدابیر۔"
      },
      {
        en: "Age-appropriate preventive health roadmap covering bone density, iron stores, breast self-awareness, and cervical health.",
        ur: "عمر کے تقاضوں کے مطابق ہڈیوں کی مضبوطی، آئرن کی کمی کے تدارک اور احتیاطی اسکریننگ کا مکمل پلان۔"
      }
    ],
    keyHighlights: [
      {
        en: "Urinary Tract Infection (UTI) Diagnosis, Relief & Recurrence Prevention",
        ur: "پیشاب کی نالی کے انفیکشن (UTI) کا فوری علاج اور دوبارہ ہونے سے بچاؤ"
      },
      {
        en: "Heavy or Painful Menstrual Bleeding (Menorrhagia & Dysmenorrhea) Care",
        ur: "تکلیف دہ یا زیادہ ماہواری اور خون کی کمی (Anemia) کا علاج"
      },
      {
        en: "Non-Surgical & Medical Management of Ovarian Cysts & Uterine Fibroids",
        ur: "اووری کی سسٹ اور رحم کی رسولیوں کی تشخیص و علاج"
      },
      {
        en: "Turning 30 Preventive Women's Health & Cervical Wellness Checkups",
        ur: "30 سال کی عمر کے بعد خواتین کا خصوصی احتیاطی ہیلتھ چیک اپ"
      }
    ],
    faqs: [
      {
        id: "faq-general-uti",
        question: {
          en: "Why do urinary tract infections (UTIs) keep coming back, and when should I see a gynecologist?",
          ur: "پیشاب کا انفیکشن (UTI) بار بار کیوں ہوتا ہے اور ڈاکٹر سے کب رجوع کرنا چاہیے؟"
        },
        answer: {
          en: "Incomplete antibiotic courses, dehydration in warm Southern Punjab weather, holding urine for long periods, or underlying diabetes can cause recurrent UTIs. If burning or frequency lasts more than 24–48 hours or returns after self-medication, a proper urine test and targeted prescription are essential.",
          ur: "گرمی کے موسم میں پانی کا کم استعمال، پیشاب روکے رکھنا، شوگر یا بغیر ٹیسٹ کے ادھوری اینٹی بائیوٹک کھانا بار بار انفیکشن کی بڑی وجوہات ہیں۔ اگر جلن یا تکلیف 24 سے 48 گھنٹے میں ٹھیک نہ ہو تو خود سے دوا لینے کے بجائے مستند معائنہ کروائیں۔"
        }
      },
      {
        id: "faq-general-turning-30",
        question: {
          en: "What checkups are recommended for women after turning 30?",
          ur: "30 سال کی عمر کے بعد خواتین کے لیے کون سے طبی ٹیسٹ اور معائنے ضروری ہیں؟"
        },
        answer: {
          en: "After 30, an annual checkup checking blood pressure, complete blood count (hemoglobin/ferritin), thyroid profile (TSH), fasting blood sugar, vitamin D, breast examination, and cervical health screening (for married women) helps catch silent health shifts early.",
          ur: "30 سال کی عمر کے بعد سال میں ایک بار بلڈ پریشر، خون اور آئرن کی مقدار (CBC)، تھائی رائیڈ (TSH)، شوگر، وٹامن ڈی اور شادی شدہ خواتین کے لیے سروائیکل اسکریننگ کروانا مستقبل کی بڑی بیماریوں سے بچاؤ میں مددگار ثابت ہوتا ہے۔"
        }
      }
    ],
    seoTitle: {
      en: "General Gynecology, UTI & Women's Health in Multan & Khangarh | Dr. Tooba Iqbal",
      ur: "ملتان اور خان گڑھ میں امراضِ نسواں اور UTI کا علاج | ڈاکٹر طوبیٰ اقبال"
    },
    seoDescription: {
      en: "Consult Dr. Tooba Iqbal (MBBS, MCPS) in Multan and Khangarh for UTI treatment, pelvic pain, menstrual irregularities, fibroids, and preventive health after 30.",
      ur: "پیشاب کے انفیکشن (UTI)، ماہواری کی بے قاعدگی، پیڑو کے درد اور 30 سال کے بعد احتیاطی چیک اپ کے لیے ڈاکٹر طوبیٰ اقبال سے رابطہ کریں۔"
    },
    whatsappInquiryText: {
      en: "Assalam-o-Alaikum, I would like to book a General Gynecology consultation with Dr. Tooba Iqbal.",
      ur: "السلام علیکم، میں ڈاکٹر طوبیٰ اقبال سے گائنی معائنے کے لیے اپائنٹمنٹ لینا چاہتی ہوں۔"
    }
  }
];

/**
 * 4 Key FAQs displayed on the Home Page (`page.tsx`) and injected as `FAQPage` JSON-LD.
 */
export const homeFaqs: FaqItem[] = [
  {
    id: "home-faq-locations-timings",
    question: {
      en: "Where are Dr. Tooba Iqbal's clinics located in Multan and Khangarh, and what are the consultation timings?",
      ur: "ملتان اور خان گڑھ میں ڈاکٹر طوبیٰ اقبال کے کلینک کہاں واقع ہیں اور معائنے کے اوقات کیا ہیں؟"
    },
    answer: {
      en: "In Multan, Dr. Tooba Iqbal practices at Doctors Hospital / Smile Clinic (Near High Court, Gillani Colony, Ghous-e-Azam Road) from Tuesday to Saturday (call +92 310 1777649 to confirm your evening slot). In Khangarh, she practices at Awan Surgical Centre every Monday from 2:00 PM to 6:00 PM (phone: 0336-6038107).",
      ur: "ملتان میں ڈاکٹر طوبیٰ اقبال ڈاکٹرز ہسپتال / سمائل کلینک (نزد ہائی کورٹ، گیلانی کالونی، غوث اعظم روڈ) میں منگل تا ہفتہ معائنہ کرتی ہیں (فون: 0310-1777649)۔ خان گڑھ میں اعوان سرجیکل سینٹر میں ہر پیر کو دوپہر 2:00 سے شام 6:00 بجے تک دستیاب ہوتی ہیں (فون: 0336-6038107)۔"
    }
  },
  {
    id: "home-faq-8week-crl",
    question: {
      en: "When should I book my first pregnancy (antenatal) checkup and ultrasound scan?",
      ur: "حمل کی تصدیق کے بعد پہلا معائنہ اور الٹراساؤنڈ کب کروانا چاہیے؟"
    },
    answer: {
      en: "You should schedule your first antenatal visit as soon as your pregnancy test is positive—ideally between 6 and 8 weeks. An 8-week Crown-Rump Length (CRL) scan confirms baby's heartbeat, establishes an accurate due date, and lets you start essential folic acid and prenatal care early.",
      ur: "حمل کا ٹیسٹ مثبت آتے ہی 6 سے 8 ہفتے کے درمیان پہلا معائنہ کروانا چاہیے۔ آٹھویں ہفتے کا سی آر ایل (CRL) الٹراساؤنڈ اسکین بچے کی دھڑکن اور پیدائش کی درست تاریخ متعین کرنے اور بروقت فولک ایسڈ شروع کرنے کے لیے نہایت اہم ہے۔"
    }
  },
  {
    id: "home-faq-pcos-care",
    question: {
      en: "How are PCOS and irregular menstrual periods diagnosed and treated at the clinic?",
      ur: "کلینک میں پی سی او ایس (PCOS) اور بے قاعدہ ماہواری کی تشخیص اور علاج کیسے کیا جاتا ہے؟"
    },
    answer: {
      en: "PCOS evaluation combines a confidential symptom history, targeted hormone blood tests, and a pelvic ultrasound. Treatment is personalized to your life stage—focusing on cycle regularity, metabolic & weight support, skin/hair symptom relief, or ovulation support if you are planning a pregnancy.",
      ur: "پی سی او ایس کی تشخیص کے لیے علامات، ہارمونز کے ٹیسٹ اور الٹراساؤنڈ کا جامع جائزہ لیا جاتا ہے۔ علاج ہر مریضہ کی ضرورت کے مطابق کیا جاتا ہے، چاہے مقصد ماہواری کو باقاعدہ بنانا ہو، وزن اور ہارمونز کا توازن ہو یا شادی شدہ خواتین میں حمل کا حصول ہو۔"
    }
  },
  {
    id: "home-faq-booking-privacy",
    question: {
      en: "How can I book an appointment, and is my personal information kept confidential?",
      ur: "اپائنٹمنٹ بک کرنے کا طریقہ کیا ہے اور کیا میری ذاتی معلومات صیغہء راز میں رکھی جاتی ہیں؟"
    },
    answer: {
      en: "You can request an appointment using our online booking form, call the clinic directly, or message on WhatsApp (+92 310 1777649). We practice strict data minimization: only your name, phone number, preferred clinic, and a brief visit reason are collected, and you should never enter sensitive medical history online.",
      ur: "آپ آن لائن فارم، فون کال یا واٹس ایپ (0310-1777649) کے ذریعے باآسانی اپائنٹمنٹ لے سکتی ہیں۔ ہم مریضہ کی رازداری کا مکمل خیال رکھتے ہیں اور آن لائن فارم میں صرف نام، فون نمبر، کلینک اور مختصر وجہ پوچھی جاتی ہے۔"
    }
  }
];

export function getServiceBySlug(slug: string): ClinicalService | undefined {
  return clinicalServices.find((service) => service.slug === slug);
}

export function getAllServicesFaqs(): FaqItem[] {
  return clinicalServices.flatMap((service) => service.faqs);
}
