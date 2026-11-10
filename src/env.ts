import { z } from "zod";

const HEX_KEY_64_REGEX = /^[0-9a-fA-F]{64}$/;
const E164_DIGITS_REGEX = /^\d{10,15}$/;

/**
 * Public environment variables safe to expose to both browser and server bundles.
 */
const clientEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url("NEXT_PUBLIC_SITE_URL must be a valid full URL (e.g., https://drtoobaiqbal.com)")
    .default("http://localhost:3000")
    .transform((url) => url.replace(/\/+$/, "")),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_TURNSTILE_SITE_KEY is required")
    .default("1x00000000000000000000AA"),
  NEXT_PUBLIC_WHATSAPP_NUMBER: z
    .string()
    .regex(
      E164_DIGITS_REGEX,
      "NEXT_PUBLIC_WHATSAPP_NUMBER must contain 10 to 15 international digits without '+'"
    )
    .default("923101777649")
});

/**
 * Server-only environment variables combined with public variables.
 */
const serverEnvSchema = clientEnvSchema
  .extend({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    ENABLE_DB_STORAGE: z
      .enum(["true", "false"])
      .default("false"),
    DATABASE_URL: z
      .string()
      .url("DATABASE_URL must be a valid PostgreSQL connection URL")
      .optional()
      .or(z.literal("")),
    PII_ENCRYPTION_KEY: z
      .string()
      .regex(
        HEX_KEY_64_REGEX,
        "PII_ENCRYPTION_KEY must be a 64-character hexadecimal string (32 bytes for AES-256-GCM)"
      )
      .default("000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f"),
    PII_BLIND_INDEX_KEY: z
      .string()
      .regex(
        HEX_KEY_64_REGEX,
        "PII_BLIND_INDEX_KEY must be a 64-character hexadecimal string (32 bytes for HMAC-SHA256)"
      )
      .default("f1e1d1c1b1a191817161514131211101f0e0d0c0b0a090807060504030201000"),
    TURNSTILE_SECRET_KEY: z
      .string()
      .min(1, "TURNSTILE_SECRET_KEY is required")
      .default("1x0000000000000000000000000000000AA"),
    UPSTASH_REDIS_REST_URL: z
      .string()
      .url("UPSTASH_REDIS_REST_URL must be a valid URL when set")
      .optional()
      .or(z.literal("")),
    UPSTASH_REDIS_REST_TOKEN: z
      .string()
      .optional()
      .default(""),
    RESEND_API_KEY: z
      .string()
      .optional()
      .default(""),
    NOTIFY_EMAIL_TO: z
      .string()
      .email("NOTIFY_EMAIL_TO must be a valid email address")
      .default("clinic@drtoobaiqbal.com"),
    NOTIFY_EMAIL_FROM: z
      .string()
      .min(3, "NOTIFY_EMAIL_FROM is required")
      .default("Dr. Tooba Iqbal Clinic <bookings@drtoobaiqbal.com>"),
    SMTP_HOST: z
      .string()
      .optional()
      .default(""),
    SMTP_PORT: z.coerce
      .number()
      .int()
      .min(1)
      .max(65535)
      .default(587),
    SMTP_USER: z
      .string()
      .optional()
      .default(""),
    SMTP_PASS: z
      .string()
      .optional()
      .default(""),
    CRON_SECRET: z
      .string()
      .min(16, "CRON_SECRET must be at least 16 characters long")
      .default("dev-only-cron-secret-minimum-16-chars")
  })
  .superRefine((data, ctx) => {
    if (data.ENABLE_DB_STORAGE === "true" && !data.DATABASE_URL) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["DATABASE_URL"],
        message: "DATABASE_URL is required when ENABLE_DB_STORAGE is set to 'true'"
      });
    }
    if (
      data.UPSTASH_REDIS_REST_URL &&
      data.UPSTASH_REDIS_REST_URL.length > 0 &&
      !data.UPSTASH_REDIS_REST_TOKEN
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["UPSTASH_REDIS_REST_TOKEN"],
        message:
          "UPSTASH_REDIS_REST_TOKEN is required when UPSTASH_REDIS_REST_URL is configured"
      });
    }
  });

export type ClientEnv = z.infer<typeof clientEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

/**
 * Validates environment variables against the Zod schema.
 * Safe to invoke in tests or at application startup.
 */
export function parseEnv(
  rawEnv: Record<string, string | undefined> = process.env
): ServerEnv {
  const normalizedInput: Record<string, string | undefined> = {
    NODE_ENV: rawEnv.NODE_ENV || "development",
    NEXT_PUBLIC_SITE_URL: rawEnv.NEXT_PUBLIC_SITE_URL || undefined,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY:
      rawEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY || undefined,
    NEXT_PUBLIC_WHATSAPP_NUMBER:
      rawEnv.NEXT_PUBLIC_WHATSAPP_NUMBER || undefined,
    ENABLE_DB_STORAGE: rawEnv.ENABLE_DB_STORAGE || undefined,
    DATABASE_URL: rawEnv.DATABASE_URL || undefined,
    PII_ENCRYPTION_KEY: rawEnv.PII_ENCRYPTION_KEY || undefined,
    PII_BLIND_INDEX_KEY: rawEnv.PII_BLIND_INDEX_KEY || undefined,
    TURNSTILE_SECRET_KEY: rawEnv.TURNSTILE_SECRET_KEY || undefined,
    UPSTASH_REDIS_REST_URL: rawEnv.UPSTASH_REDIS_REST_URL || undefined,
    UPSTASH_REDIS_REST_TOKEN: rawEnv.UPSTASH_REDIS_REST_TOKEN || undefined,
    RESEND_API_KEY: rawEnv.RESEND_API_KEY || undefined,
    NOTIFY_EMAIL_TO: rawEnv.NOTIFY_EMAIL_TO || undefined,
    NOTIFY_EMAIL_FROM: rawEnv.NOTIFY_EMAIL_FROM || undefined,
    SMTP_HOST: rawEnv.SMTP_HOST || undefined,
    SMTP_PORT: rawEnv.SMTP_PORT || undefined,
    SMTP_USER: rawEnv.SMTP_USER || undefined,
    SMTP_PASS: rawEnv.SMTP_PASS || undefined,
    CRON_SECRET: rawEnv.CRON_SECRET || undefined
  };

  const parsed = serverEnvSchema.safeParse(normalizedInput);

  if (!parsed.success) {
    const formattedErrors = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(
      `Invalid environment configuration detected at startup:\n${formattedErrors}`
    );
  }

  return parsed.data;
}

export const clientEnv: ClientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || undefined,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY:
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || undefined,
  NEXT_PUBLIC_WHATSAPP_NUMBER:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || undefined
});

export const env: ServerEnv =
  typeof window === "undefined"
    ? parseEnv(process.env)
    : ({
        ...clientEnv,
        NODE_ENV: (process.env.NODE_ENV as ServerEnv["NODE_ENV"]) || "development",
        ENABLE_DB_STORAGE: "false",
        DATABASE_URL: "",
        PII_ENCRYPTION_KEY: "",
        PII_BLIND_INDEX_KEY: "",
        TURNSTILE_SECRET_KEY: "",
        UPSTASH_REDIS_REST_URL: "",
        UPSTASH_REDIS_REST_TOKEN: "",
        RESEND_API_KEY: "",
        NOTIFY_EMAIL_TO: "",
        NOTIFY_EMAIL_FROM: "",
        SMTP_HOST: "",
        SMTP_PORT: 587,
        SMTP_USER: "",
        SMTP_PASS: "",
        CRON_SECRET: ""
      } satisfies ServerEnv);
