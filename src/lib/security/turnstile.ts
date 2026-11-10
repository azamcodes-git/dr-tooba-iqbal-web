import { env } from "@/env";

const TURNSTILE_VERIFY_ENDPOINT =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const DUMMY_TEST_SECRET = "1x0000000000000000000000000000000AA";

export interface TurnstileVerificationResult {
  success: boolean;
  errorCodes: string[];
}

interface CloudflareTurnstileResponse {
  success: boolean;
  "error-codes"?: string[];
}

/**
 * Validates a Cloudflare Turnstile token server-side against
 * `https://challenges.cloudflare.com/turnstile/v0/siteverify`.
 */
export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string
): Promise<TurnstileVerificationResult> {
  const trimmedToken = token.trim();
  if (!trimmedToken) {
    return {
      success: false,
      errorCodes: ["missing-input-response"]
    };
  }

  // In non-production test environments using Cloudflare's official dummy secret key,
  // allow deterministic offline verification for test tokens while rejecting explicit failure tokens.
  if (
    env.NODE_ENV !== "production" &&
    env.TURNSTILE_SECRET_KEY === DUMMY_TEST_SECRET
  ) {
    if (trimmedToken === "INVALID_TURNSTILE_TOKEN") {
      return {
        success: false,
        errorCodes: ["invalid-input-response"]
      };
    }
    if (
      env.NODE_ENV === "test" ||
      trimmedToken === "XXXX.DUMMY.TOKEN.XXXX" ||
      trimmedToken.startsWith("dev-turnstile-pass")
    ) {
      return {
        success: true,
        errorCodes: []
      };
    }
  }

  try {
    const formData = new URLSearchParams();
    formData.set("secret", env.TURNSTILE_SECRET_KEY);
    formData.set("response", trimmedToken);
    if (remoteIp) {
      formData.set("remoteip", remoteIp);
    }

    const response = await fetch(TURNSTILE_VERIFY_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData.toString()
    });

    if (!response.ok) {
      return {
        success: false,
        errorCodes: [`http-status-${response.status}`]
      };
    }

    const data = (await response.json()) as CloudflareTurnstileResponse;
    return {
      success: Boolean(data.success),
      errorCodes: data["error-codes"] ?? []
    };
  } catch {
    // In local development with the dummy test key and no internet connection, allow fallback
    if (
      env.NODE_ENV === "development" &&
      env.TURNSTILE_SECRET_KEY === DUMMY_TEST_SECRET
    ) {
      return {
        success: true,
        errorCodes: []
      };
    }
    return {
      success: false,
      errorCodes: ["network-verification-failed"]
    };
  }
}
