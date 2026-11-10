import enMessages from "../content/messages/en.json";
import urMessages from "../content/messages/ur.json";

export const locales = ["en", "ur"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export type Messages = typeof enMessages;

const dictionaries: Record<Locale, Messages> = {
  en: enMessages,
  ur: urMessages
};

/**
 * Type guard verifying if a string is a supported locale ('en' | 'ur').
 */
export function isValidLocale(value: string | undefined | null): value is Locale {
  return value === "en" || value === "ur";
}

/**
 * Resolves any input string into a safe Locale ('en' fallback).
 */
export function resolveLocale(value: string | undefined | null): Locale {
  return isValidLocale(value) ? value : defaultLocale;
}

/**
 * Returns text direction ('ltr' for English, 'rtl' for Urdu).
 */
export function getLocaleDirection(locale: Locale): "ltr" | "rtl" {
  return locale === "ur" ? "rtl" : "ltr";
}

/**
 * Returns the localized dictionary for the requested locale.
 */
export function getMessages(locale: Locale): Messages {
  return dictionaries[locale] ?? dictionaries.en;
}

/**
 * Helper to select localized text from an inline `{ en, ur }` object.
 */
export function localize<T>(
  record: { en: T; ur: T },
  locale: Locale
): T {
  return record[locale] ?? record.en;
}

/**
 * Constructs a locale-prefixed internal route path (e.g., `/en/services`).
 */
export function localePath(locale: Locale, path = ""): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (cleanPath === "/") {
    return `/${locale}`;
  }
  return `/${locale}${cleanPath}`;
}
