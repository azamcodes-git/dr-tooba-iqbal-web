import { describe, expect, it } from "vitest";
import { getScheduleMismatchNotice } from "@/content/locations";
import { getConsentedTestimonials, testimonials } from "@/content/testimonials";
import {
  computeBlindIndex,
  decryptPii,
  encryptPii,
  redactPhone
} from "@/lib/security/crypto";
import { escapeHtml, stripHeaderInjection } from "@/lib/security/sanitize";
import {
  appointmentSchema,
  getPakistanTodayIso,
  isDateWithinBookingWindow,
  normalizePakistaniPhone
} from "@/lib/validation/appointment";

describe("Pakistani Phone Normalization & Appointment Zod Schema", () => {
  it("normalizes valid Pakistani mobile and landline formats to E.164 (+92...)", () => {
    expect(normalizePakistaniPhone("0310-1777649")).toBe("+923101777649");
    expect(normalizePakistaniPhone("03101777649")).toBe("+923101777649");
    expect(normalizePakistaniPhone("+92 310 1777649")).toBe("+923101777649");
    expect(normalizePakistaniPhone("00923101777649")).toBe("+923101777649");
    expect(normalizePakistaniPhone("0336-6038107")).toBe("+923366038107");
    expect(normalizePakistaniPhone("061-4567890")).toBe("+92614567890");
  });

  it("rejects non-Pakistani or malformed phone numbers", () => {
    expect(normalizePakistaniPhone("12345")).toBeNull();
    expect(normalizePakistaniPhone("+14155552671")).toBeNull();
    expect(normalizePakistaniPhone("+92310177")).toBeNull();
    expect(normalizePakistaniPhone("abc-def-ghij")).toBeNull();
  });

  it("accepts valid English and Urdu patient names and normalizes phone in appointmentSchema", () => {
    const todayIso = getPakistanTodayIso();

    const englishBooking = appointmentSchema.safeParse({
      fullName: "Ayesha Bibi",
      phone: "0310-1777649",
      location: "multan",
      preferredDate: todayIso,
      reason: "Routine 8-week antenatal checkup",
      website_url: "",
      cfTurnstileToken: "XXXX.DUMMY.TOKEN.XXXX",
      locale: "en"
    });
    expect(englishBooking.success).toBe(true);
    if (englishBooking.success) {
      expect(englishBooking.data.phone).toBe("+923101777649");
    }

    const urduBooking = appointmentSchema.safeParse({
      fullName: "عائشہ بی بی",
      phone: "0336-6038107",
      location: "khangarh",
      preferredDate: todayIso,
      reason: "حمل کا معائنہ",
      website_url: "",
      cfTurnstileToken: "XXXX.DUMMY.TOKEN.XXXX",
      locale: "ur"
    });
    expect(urduBooking.success).toBe(true);
    if (urduBooking.success) {
      expect(urduBooking.data.phone).toBe("+923366038107");
    }
  });

  it("rejects XSS payloads in fullName and reasons exceeding 300 characters", () => {
    const todayIso = getPakistanTodayIso();

    const xssName = appointmentSchema.safeParse({
      fullName: "<script>alert(1)</script>",
      phone: "0310-1777649",
      location: "multan",
      preferredDate: todayIso,
      reason: "Checkup",
      cfTurnstileToken: "XXXX.DUMMY.TOKEN.XXXX"
    });
    expect(xssName.success).toBe(false);

    const longReason = appointmentSchema.safeParse({
      fullName: "Fatima Zahra",
      phone: "0310-1777649",
      location: "multan",
      preferredDate: todayIso,
      reason: "A".repeat(301),
      cfTurnstileToken: "XXXX.DUMMY.TOKEN.XXXX"
    });
    expect(longReason.success).toBe(false);
  });

  it("enforces booking date window (today up to 60 days in the future)", () => {
    const refNow = new Date("2026-11-06T12:00:00.000Z");
    expect(isDateWithinBookingWindow("2026-11-05", refNow)).toEqual({
      valid: false,
      reason: "past"
    });
    expect(isDateWithinBookingWindow("2026-11-06", refNow)).toEqual({
      valid: true
    });
    expect(isDateWithinBookingWindow("2027-01-05", refNow)).toEqual({
      valid: true
    });
    expect(isDateWithinBookingWindow("2027-01-06", refNow)).toEqual({
      valid: false,
      reason: "too_far"
    });
  });

  it("flags clinic schedule mismatches for Multan (closed Mon) and Khangarh (open Mon only)", () => {
    // 2026-11-09 is a Monday; 2026-11-10 is a Tuesday
    expect(getScheduleMismatchNotice("multan", "2026-11-09")).not.toBeNull();
    expect(getScheduleMismatchNotice("multan", "2026-11-10")).toBeNull();

    expect(getScheduleMismatchNotice("khangarh", "2026-11-09")).toBeNull();
    expect(getScheduleMismatchNotice("khangarh", "2026-11-10")).not.toBeNull();
  });
});

describe("Security Helpers: AES-256-GCM Encryption, Sanitization & Consent Guardrails", () => {
  it("encrypts and decrypts phone numbers with AES-256-GCM and detects tampering", () => {
    const rawPhone = "+923101777649";
    const encrypted = encryptPii(rawPhone);
    expect(encrypted).not.toContain(rawPhone);
    expect(encrypted.split(":")).toHaveLength(3);
    expect(decryptPii(encrypted)).toBe(rawPhone);

    // Tamper with ciphertext byte
    const [iv, tag, cipher] = encrypted.split(":");
    const tampered = `${iv}:${tag}:${cipher?.slice(0, -2)}ff`;
    expect(() => decryptPii(tampered)).toThrow();
  });

  it("computes deterministic HMAC-SHA256 blind index and redacts phone numbers", () => {
    const idx1 = computeBlindIndex("+923101777649");
    const idx2 = computeBlindIndex("+923101777649");
    expect(idx1).toBe(idx2);
    expect(idx1).toHaveLength(64);
    expect(redactPhone("+923101777649")).toBe("+923*******49");
  });

  it("strips CR/LF header injection sequences and escapes HTML entities", () => {
    expect(
      stripHeaderInjection("Ayesha\r\nBcc: attacker@example.com")
    ).toBe("Ayesha Bcc: attacker@example.com");
    expect(escapeHtml(`<img src=x onerror="alert('xss')">&`)).toBe(
      "&lt;img src=x onerror=&quot;alert(&#39;xss&#39;)&quot;&gt;&amp;"
    );
  });

  it("ships all testimonials with consent: false by default so zero testimonials render", () => {
    expect(testimonials.every((t) => t.consent === false)).toBe(true);
    expect(getConsentedTestimonials()).toHaveLength(0);
  });
});
