import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales } from "@/i18n";

const PUBLIC_FILE_REGEX = /\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff2|txt|xml|json)$/i;

/**
 * Builds the strict Content-Security-Policy header value with a per-request cryptographic nonce.
 */
export function buildCspHeader(nonce: string): string {
  const directives = [
    "default-src 'self';",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://challenges.cloudflare.com;`,
    "style-src 'self' 'unsafe-inline';",
    "img-src 'self' data: blob:;",
    "font-src 'self';",
    "frame-src https://www.google.com https://maps.google.com https://challenges.cloudflare.com;",
    "connect-src 'self' https://challenges.cloudflare.com;",
    "object-src 'none';",
    "base-uri 'self';",
    "frame-ancestors 'none';",
    "form-action 'self';",
    "upgrade-insecure-requests;"
  ];
  return directives.join(" ");
}

/**
 * Applies all required security headers (CSP with nonce, HSTS, X-Content-Type-Options,
 * Referrer-Policy, Permissions-Policy, COOP, X-Frame-Options) to a NextResponse.
 */
export function applySecurityHeaders(
  response: NextResponse,
  nonce: string
): NextResponse {
  response.headers.set("x-nonce", nonce);
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
  response.headers.set("Content-Security-Policy", buildCspHeader(nonce));
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()"
  );
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("X-Frame-Options", "DENY");
  return response;
}

export function middleware(request: NextRequest): NextResponse {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const { pathname, search } = request.nextUrl;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set(
    "Content-Security-Policy",
    buildCspHeader(nonce)
  );

  // Bypass locale prefix redirection for API routes, static files, and SEO metadata files
  const isBypassedRoute =
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/.well-known/") ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/fonts/") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/favicon.ico" ||
    PUBLIC_FILE_REGEX.test(pathname);

  if (isBypassedRoute) {
    const response = NextResponse.next({
      request: {
        headers: requestHeaders
      }
    });
    return applySecurityHeaders(response, nonce);
  }

  // Check if the pathname already starts with a supported locale (/en or /ur)
  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (!pathnameHasLocale) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname =
      pathname === "/" ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`;
    redirectUrl.search = search;

    const redirectResponse = NextResponse.redirect(redirectUrl, 307);
    return applySecurityHeaders(redirectResponse, nonce);
  }

  const activeLocale = pathname.startsWith("/ur") ? "ur" : "en";
  requestHeaders.set("x-locale", activeLocale);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });
  return applySecurityHeaders(response, nonce);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)"
  ]
};
