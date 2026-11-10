import crypto from "node:crypto";
import { env } from "@/env";

/**
 * AES-256-GCM PII Encryption & HMAC-SHA256 Blind Indexing (`src/lib/security/crypto.ts`)
 *
 * - Encrypts normalized E.164 phone numbers using AES-256-GCM with a random 12-byte IV
 *   and 16-byte authentication tag (`ivHex:authTagHex:ciphertextHex`).
 * - Generates a deterministic HMAC-SHA256 blind index for duplicate/lookup queries
 *   without storing plaintext phone numbers.
 * - Provides a zero-PII redaction helper (`+923*******49`) for operational metrics.
 */

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH_BYTES = 12;
const AUTH_TAG_LENGTH_BYTES = 16;

function resolveKeyBuffer(hexKey: string, label: string): Buffer {
  if (!/^[0-9a-fA-F]{64}$/.test(hexKey)) {
    throw new Error(`${label} must be a 64-character hex string (32 bytes)`);
  }
  return Buffer.from(hexKey, "hex");
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * Output format: `<12-byte-iv-hex>:<16-byte-tag-hex>:<ciphertext-hex>`
 */
export function encryptPii(
  plaintext: string,
  hexKey: string = env.PII_ENCRYPTION_KEY
): string {
  const key = resolveKeyBuffer(hexKey, "PII_ENCRYPTION_KEY");
  const iv = crypto.randomBytes(IV_LENGTH_BYTES);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH_BYTES
  });

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final()
  ]);
  const authTag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString("hex")}`;
}

/**
 * Decrypts a payload produced by `encryptPii`.
 * Verifies the 16-byte GCM authentication tag to detect tampering.
 */
export function decryptPii(
  payload: string,
  hexKey: string = env.PII_ENCRYPTION_KEY
): string {
  const parts = payload.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted PII payload format");
  }

  const [ivHex, authTagHex, ciphertextHex] = parts as [string, string, string];
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const ciphertext = Buffer.from(ciphertextHex, "hex");

  if (
    iv.length !== IV_LENGTH_BYTES ||
    authTag.length !== AUTH_TAG_LENGTH_BYTES
  ) {
    throw new Error("Invalid IV or authTag length in encrypted PII payload");
  }

  const key = resolveKeyBuffer(hexKey, "PII_ENCRYPTION_KEY");
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH_BYTES
  });
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final()
  ]);

  return decrypted.toString("utf8");
}

/**
 * Computes a deterministic 64-char hex HMAC-SHA256 blind index for a normalized value.
 */
export function computeBlindIndex(
  normalizedValue: string,
  hexKey: string = env.PII_BLIND_INDEX_KEY
): string {
  const key = resolveKeyBuffer(hexKey, "PII_BLIND_INDEX_KEY");
  return crypto
    .createHmac("sha256", key)
    .update(normalizedValue.trim().toLowerCase(), "utf8")
    .digest("hex");
}

/**
 * Redacts an E.164 phone number for safe operational metrics (e.g. `+923101777649` -> `+923*******49`).
 */
export function redactPhone(phoneE164: string): string {
  const cleaned = phoneE164.trim();
  if (cleaned.length < 7) {
    return "***REDACTED***";
  }
  const prefix = cleaned.slice(0, 4);
  const suffix = cleaned.slice(-2);
  const maskedLength = Math.max(cleaned.length - 6, 4);
  return `${prefix}${"*".repeat(maskedLength)}${suffix}`;
}

/**
 * Timing-safe string comparison for Bearer tokens (e.g., `CRON_SECRET`).
 */
export function timingSafeEqualStrings(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) {
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}
