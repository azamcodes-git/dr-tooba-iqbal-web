import type { LocalizedText } from "./site";

export type ClinicLocationId = "multan" | "khangarh";

export interface OpeningHoursSpec {
  dayOfWeek: string[];
  opens: string;
  closes: string;
}

export interface ClinicLocation {
  id: ClinicLocationId;
  city: LocalizedText;
  name: LocalizedText;
  hospitalOrClinicBadge: LocalizedText;
  address: LocalizedText;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
  timings: LocalizedText;
  daysSummary: LocalizedText;
  hoursSummary: LocalizedText;
  activeDaysOfWeek: number[]; // JS Date.getDay(): 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  scheduleMismatchWarning: LocalizedText;
  phoneDisplay: string;
  phoneTel: string;
  phoneE164: string;
  whatsappUrl: string;
  mapEmbedUrl: string;
  mapDirectionsUrl: string;
  mapTitle: LocalizedText;
  geo: {
    latitude: number;
    longitude: number;
  };
  openingHoursSpecification: OpeningHoursSpec[];
  confirmationNote: string;
}

/**
 * Single Source of Truth for Dr. Tooba Iqbal's Multan and Khangarh practice locations.
 *
 * [CONFIRM WITH CLIENT — Confirm exact display name for Multan clinic ("Doctors Hospital / Smile Clinic")
 * and exact evening consultation hours (e.g., 4:00 PM – 8:00 PM) before launch.]
 */
export const clinicLocations: ClinicLocation[] = [
  {
    id: "multan",
    city: {
      en: "Multan",
      ur: "ملتان"
    },
    // [CONFIRM WITH CLIENT — Confirm exact display name: Doctors Hospital / Smile Clinic]
    name: {
      en: "Multan Clinic — Doctors Hospital / Smile Clinic",
      ur: "ملتان کلینک — ڈاکٹرز ہسپتال / سمائل کلینک"
    },
    hospitalOrClinicBadge: {
      en: "Doctors Hospital / Smile Clinic",
      ur: "ڈاکٹرز ہسپتال / سمائل کلینک"
    },
    address: {
      en: "Near High Court, Gillani Colony, Ghous-e-Azam Road, Multan, Punjab, Pakistan",
      ur: "نزد ہائی کورٹ، گیلانی کالونی، غوث اعظم روڈ، ملتان، پنجاب، پاکستان"
    },
    streetAddress: "Near High Court, Gillani Colony, Ghous-e-Azam Road",
    addressLocality: "Multan",
    addressRegion: "Punjab",
    postalCode: "60000",
    addressCountry: "PK",
    // [CONFIRM WITH CLIENT — Confirm exact hours, e.g., 4:00 PM – 8:00 PM]
    timings: {
      en: "Tuesday to Saturday (Call/WhatsApp to confirm exact slot)",
      ur: "منگل تا ہفتہ (مخصوص وقت کی تصدیق کے لیے کال یا واٹس ایپ کریں)"
    },
    daysSummary: {
      en: "Tuesday – Saturday",
      ur: "منگل تا ہفتہ"
    },
    hoursSummary: {
      en: "4:00 PM – 8:00 PM (Confirm slot via phone/WhatsApp)",
      ur: "شام 4:00 تا رات 8:00 بجے (فون یا واٹس ایپ پر وقت کی تصدیق کریں)"
    },
    activeDaysOfWeek: [2, 3, 4, 5, 6], // Tuesday (2) through Saturday (6)
    scheduleMismatchWarning: {
      en: "Note: The Multan Clinic is normally open Tuesday to Saturday. On Mondays, Dr. Tooba Iqbal practices at Khangarh Clinic (2:00 PM – 6:00 PM). You may still submit this request and our staff will confirm the closest available slot.",
      ur: "نوٹ: ملتان کلینک عام طور پر منگل سے ہفتہ تک کھلا ہوتا ہے۔ پیر کے روز ڈاکٹر طوبیٰ اقبال خان گڑھ کلینک (دوپہر 2 تا شام 6 بجے) میں معائنہ کرتی ہیں۔ آپ پھر بھی درخواست بھیج سکتے ہیں، عملہ قریبی دستیاب وقت کی تصدیق کر دے گا۔"
    },
    phoneDisplay: "+92 310 1777649",
    phoneTel: "tel:+923101777649",
    phoneE164: "+923101777649",
    whatsappUrl: "https://wa.me/923101777649",
    mapEmbedUrl:
      "https://www.google.com/maps?q=Gillani+Colony+Ghous+e+Azam+Road+Near+High+Court+Multan+Pakistan&output=embed",
    mapDirectionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Gillani+Colony+Ghous+e+Azam+Road+Near+High+Court+Multan+Pakistan",
    mapTitle: {
      en: "Google Map showing Multan Clinic near High Court, Gillani Colony, Ghous-e-Azam Road, Multan",
      ur: "ملتان کلینک کا نقشہ — نزد ہائی کورٹ، گیلانی کالونی، غوث اعظم روڈ، ملتان"
    },
    geo: {
      latitude: 30.1864,
      longitude: 71.4886
    },
    openingHoursSpecification: [
      {
        dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "16:00",
        closes: "20:00"
      }
    ],
    confirmationNote:
      "[CONFIRM WITH CLIENT — Verify exact hospital/clinic display name ('Doctors Hospital / Smile Clinic') and exact Tuesday–Saturday consultation hours]"
  },
  {
    id: "khangarh",
    city: {
      en: "Khangarh",
      ur: "خان گڑھ"
    },
    name: {
      en: "Khangarh Clinic — Awan Surgical Centre",
      ur: "خان گڑھ کلینک — اعوان سرجیکل سینٹر"
    },
    hospitalOrClinicBadge: {
      en: "Awan Surgical Centre, Khangarh",
      ur: "اعوان سرجیکل سینٹر، خان گڑھ"
    },
    address: {
      en: "Awan Surgical Centre, Khangarh, Muzaffargarh District, Punjab, Pakistan",
      ur: "اعوان سرجیکل سینٹر، خان گڑھ، ضلع مظفر گڑھ، پنجاب، پاکستان"
    },
    streetAddress: "Awan Surgical Centre, Main Road, Khangarh",
    addressLocality: "Khangarh, Muzaffargarh",
    addressRegion: "Punjab",
    postalCode: "34250",
    addressCountry: "PK",
    timings: {
      en: "Every Monday, 2:00 PM to 6:00 PM",
      ur: "ہر پیر، دوپہر 2:00 بجے سے شام 6:00 بجے تک"
    },
    daysSummary: {
      en: "Every Monday",
      ur: "ہر پیر کے روز"
    },
    hoursSummary: {
      en: "2:00 PM – 6:00 PM",
      ur: "دوپہر 2:00 تا شام 6:00 بجے"
    },
    activeDaysOfWeek: [1], // Monday (1)
    scheduleMismatchWarning: {
      en: "Note: The Khangarh Clinic (Awan Surgical Centre) is held every Monday from 2:00 PM to 6:00 PM. For Tuesday–Saturday appointments, please select the Multan Clinic or our team will schedule you for the next Monday.",
      ur: "نوٹ: خان گڑھ کلینک (اعوان سرجیکل سینٹر) ہر پیر کو دوپہر 2:00 سے شام 6:00 بجے تک ہوتا ہے۔ منگل تا ہفتہ معائنے کے لیے ملتان کلینک منتخب کریں یا ہمارا عملہ آپ کی اپائنٹمنٹ اگلے پیر کے لیے درج کر لے گا۔"
    },
    phoneDisplay: "0336-6038107",
    phoneTel: "tel:+923366038107",
    phoneE164: "+923366038107",
    whatsappUrl: "https://wa.me/923101777649",
    mapEmbedUrl:
      "https://www.google.com/maps?q=Awan+Surgical+Centre+Khangarh+Muzaffargarh+Punjab+Pakistan&output=embed",
    mapDirectionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Awan+Surgical+Centre+Khangarh+Muzaffargarh+Punjab+Pakistan",
    mapTitle: {
      en: "Google Map showing Awan Surgical Centre, Khangarh, Muzaffargarh District",
      ur: "خان گڑھ کلینک کا نقشہ — اعوان سرجیکل سینٹر، خان گڑھ، ضلع مظفر گڑھ"
    },
    geo: {
      latitude: 29.9155,
      longitude: 71.1614
    },
    openingHoursSpecification: [
      {
        dayOfWeek: ["Monday"],
        opens: "14:00",
        closes: "18:00"
      }
    ],
    confirmationNote:
      "[CONFIRM WITH CLIENT — Verify exact map pin coordinates for Awan Surgical Centre, Khangarh]"
  }
];

export function getLocationById(id: ClinicLocationId): ClinicLocation {
  const found = clinicLocations.find((loc) => loc.id === id);
  return found ?? clinicLocations[0]!;
}

/**
 * Checks whether a selected ISO date string (`YYYY-MM-DD`) falls on an active clinic day
 * for the chosen location. Returns a localized gentle schedule notice if mismatched.
 */
export function getScheduleMismatchNotice(
  locationId: ClinicLocationId,
  isoDate: string
): LocalizedText | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
    return null;
  }
  const [yearStr, monthStr, dayStr] = isoDate.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);
  if (!year || !month || !day) {
    return null;
  }

  // Use UTC noon to avoid local timezone day shifts
  const dateObj = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  if (Number.isNaN(dateObj.getTime())) {
    return null;
  }

  const dayOfWeek = dateObj.getUTCDay();
  const location = getLocationById(locationId);

  if (!location.activeDaysOfWeek.includes(dayOfWeek)) {
    return location.scheduleMismatchWarning;
  }

  return null;
}
