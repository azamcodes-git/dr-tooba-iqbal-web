import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "@/env";

/**
 * Per-IP Rate Limiter (`src/lib/security/rate-limit.ts`)
 *
 * Enforces max 5 requests per 10 minutes (600 seconds) per client IP.
 * Uses Upstash Redis when `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
 * are configured, with an automatic bounded LRU in-memory sliding-window fallback
 * for local development and automated test suites.
 */

export const RATE_LIMIT_MAX_REQUESTS = 5;
export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_MEMORY_KEYS = 5000;

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAtMs: number;
  retryAfterSeconds: number;
}

const memoryBuckets = new Map<string, number[]>();

let upstashLimiter: Ratelimit | null = null;

function getUpstashLimiter(): Ratelimit | null {
  if (upstashLimiter) {
    return upstashLimiter;
  }
  if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
    const redis = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN
    });
    upstashLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(RATE_LIMIT_MAX_REQUESTS, "10 m"),
      prefix: "drtooba:ratelimit:appointments"
    });
    return upstashLimiter;
  }
  return null;
}

function checkInMemoryRateLimit(
  identifier: string,
  nowMs: number = Date.now()
): RateLimitResult {
  const windowStart = nowMs - RATE_LIMIT_WINDOW_MS;
  const existingTimestamps = memoryBuckets.get(identifier) ?? [];
  const activeTimestamps = existingTimestamps.filter((ts) => ts > windowStart);

  if (activeTimestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    const oldestTimestamp = activeTimestamps[0] ?? nowMs;
    const resetAtMs = oldestTimestamp + RATE_LIMIT_WINDOW_MS;
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((resetAtMs - nowMs) / 1000)
    );
    memoryBuckets.set(identifier, activeTimestamps);
    return {
      allowed: false,
      limit: RATE_LIMIT_MAX_REQUESTS,
      remaining: 0,
      resetAtMs,
      retryAfterSeconds
    };
  }

  activeTimestamps.push(nowMs);

  // Evict oldest key if map exceeds LRU capacity
  if (!memoryBuckets.has(identifier) && memoryBuckets.size >= MAX_MEMORY_KEYS) {
    const oldestKey = memoryBuckets.keys().next().value;
    if (oldestKey) {
      memoryBuckets.delete(oldestKey);
    }
  }

  memoryBuckets.set(identifier, activeTimestamps);

  const remaining = Math.max(
    0,
    RATE_LIMIT_MAX_REQUESTS - activeTimestamps.length
  );
  const resetAtMs = (activeTimestamps[0] ?? nowMs) + RATE_LIMIT_WINDOW_MS;

  return {
    allowed: true,
    limit: RATE_LIMIT_MAX_REQUESTS,
    remaining,
    resetAtMs,
    retryAfterSeconds: Math.max(1, Math.ceil((resetAtMs - nowMs) / 1000))
  };
}

/**
 * Checks whether the client IP is within the 5 requests / 10 minutes rate limit.
 */
export async function checkAppointmentRateLimit(
  ipAddress: string
): Promise<RateLimitResult> {
  const normalizedIp = (ipAddress || "127.0.0.1").trim();
  const distributedLimiter = getUpstashLimiter();

  if (distributedLimiter) {
    try {
      const res = await distributedLimiter.limit(normalizedIp);
      const nowMs = Date.now();
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((res.reset - nowMs) / 1000)
      );
      return {
        allowed: res.success,
        limit: res.limit,
        remaining: res.remaining,
        resetAtMs: res.reset,
        retryAfterSeconds
      };
    } catch {
      // Fail gracefully to in-memory limiter if Upstash network is unreachable
      return checkInMemoryRateLimit(normalizedIp);
    }
  }

  return checkInMemoryRateLimit(normalizedIp);
}

/**
 * Resets the in-memory rate limit buckets (used in isolated unit/API tests).
 */
export function resetInMemoryRateLimit(): void {
  memoryBuckets.clear();
}
