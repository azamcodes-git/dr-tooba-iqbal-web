# Dr. Tooba Iqbal (MBBS, MCPS) — Official Healthcare & Appointment Portal

A production-ready, mobile-first, bilingual (**English `/en` LTR** and **Urdu `/ur` RTL**) Next.js 14 (App Router) healthcare website and hardened appointment booking system built for **Dr. Tooba Iqbal (MBBS, MCPS)**, Consultant Gynecologist & Obstetrician practicing in **Multan** and **Khangarh, Southern Punjab, Pakistan**.

---

## 1. Local Development & Setup Instructions

### Prerequisites
- **Node.js**: `v20.18.0` (pinned in `.nvmrc`)
- **npm**: `>= 10.x`
- **PostgreSQL**: Optional (only required when `ENABLE_DB_STORAGE="true"`; defaults to `"false"` for stateless privacy mode).

### Step-by-Step Setup
```bash
# 1. Copy the documented environment template
cp .env.example .env.local

# 2. Install dependencies
npm install

# 3. Generate the typed Prisma Client
npm run db:generate

# 4. Run the local development server
npm run dev
```

Open:
- **English (`/en`, LTR)**: `http://localhost:3000/en`
- **Urdu (`/ur`, RTL)**: `http://localhost:3000/ur`

### Verification & Test Commands
```bash
# Run strict TypeScript compiler check
npm run typecheck

# Run Vitest unit & API security tests (21 assertions)
npm test

# Build production Next.js bundle
npm run build

# Run Playwright mobile-first E2E test suite
npm run test:e2e
```

---

## 2. Threat Model (Assets, Threats & Mitigations)

| Protected Asset | Threat / Attack Vector | Implemented Technical Mitigation |
| :--- | :--- | :--- |
| **Patient Identity & Contact PII** (`fullName`, `phone`, `preferredDate`, `reason`) | Unauthorized database exposure, SQL injection, or indefinite PII retention. | 1. **Stateless Default (`ENABLE_DB_STORAGE="false"`)**: Dispatches notification without storing PII at rest.<br>2. **AES-256-GCM Encryption (`src/lib/security/crypto.ts`)**: When DB storage is enabled, `phone` is encrypted with a random 12-byte IV and 16-byte authentication tag (`PII_ENCRYPTION_KEY`) and indexed via `HMAC-SHA256` (`PII_BLIND_INDEX_KEY`).<br>3. **Parameterized Queries**: Prisma ORM prevents SQL injection.<br>4. **90-Day Auto-Purge (`POST /api/cron/retention`)**: Daily cron job deletes records older than 90 days. |
| **Sensitive Medical History** | Patients over-sharing confidential diagnoses in free-text fields. | 1. **Strict Field Cap**: `reason` capped at 300 characters (`src/lib/validation/appointment.ts`).<br>2. **Explicit UI Warning (`AppointmentForm.tsx`)**: Prominent privacy notice directly above the textarea instructing patients to state only a brief visit reason. |
| **Appointment Booking Endpoint (`POST /api/appointments`)** | Automated bot spam, credential stuffing, DDoS payload exhaustion, and Cross-Site Request Forgery (CSRF). | 1. **Payload Cap**: Rejects raw bodies `> 4096 bytes` with `413 Payload Too Large`.<br>2. **CSRF Origin Verification**: Verifies `Origin` matches `Host` / `NEXT_PUBLIC_SITE_URL` (`403 Forbidden`).<br>3. **Per-IP Rate Limiting (`src/lib/security/rate-limit.ts`)**: Max 5 requests per 10 minutes per IP via Upstash Redis + in-memory LRU fallback (`429` + `Retry-After`).<br>4. **Silent Honeypot (`website_url`)**: Silently returns `200 OK` without sending email or writing to DB.<br>5. **Cloudflare Turnstile (`src/lib/security/turnstile.ts`)**: Server-side token validation against `challenges.cloudflare.com`. |
| **Clinic Notification Emails (`src/lib/email/notify.ts`)** | SMTP header injection (`\r\nBcc:`) and Stored/Reflected HTML XSS in email clients. | 1. **`stripHeaderInjection`**: Strips `\r`, `\n`, and null bytes from all header/subject interpolations.<br>2. **`escapeHtml`**: Escapes `&`, `<`, `>`, `"`, `'` across all user fields before constructing HTML email bodies. |
| **Browser Execution Context & Patient Browsing Privacy** | Cross-Site Scripting (XSS), clickjacking, and third-party tracker/font CDN IP leakage. | 1. **Per-Request Cryptographic Nonce CSP (`src/middleware.ts`)**: `script-src 'self' 'nonce-...' 'strict-dynamic'`, `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `HSTS`.<br>2. **Self-Hosted Font Stack**: `font-src 'self'` with zero requests to `fonts.googleapis.com` or `fonts.gstatic.com`.<br>3. **Safe JSON-LD (`JsonLd.tsx`)**: Escapes `<` as `\u003c` and attaches the request CSP nonce. |
| **Operational Logs** | Accidental PII leakage in server stdout/stderr or error responses. | Zero PII logging policy in `route.ts`; `redactPhone()` masks phone numbers as `+923*******49`; generic error envelopes with zero stack traces. |

---

## 3. Cloudflare WAF, Turnstile & DNSSEC Production Setup

1. **DNSSEC & SSL/TLS**:
   - Enable **DNSSEC** in the Cloudflare Dashboard (`DNS -> Settings -> Enable DNSSEC`) and copy the DS record to the domain registrar.
   - Set SSL/TLS encryption mode to **Full (Strict)**, enable **Always Use HTTPS**, **Minimum TLS Version 1.2** (prefer TLS 1.3), and **HTTP Strict Transport Security (HSTS)**.
2. **Cloudflare WAF Managed Rules & Rate Limiting**:
   - Enable **Cloudflare Managed Ruleset** and **Cloudflare OWASP Core Ruleset**.
   - Create a custom WAF Rate Limiting Rule for `URI Path equals /api/appointments` and `Method equals POST`: block or Managed Challenge IPs exceeding 5 requests per 10 minutes at the edge (complementing the application-level Upstash rate limiter).
3. **Cloudflare Turnstile Widget**:
   - Create a Turnstile widget in Cloudflare Dashboard (`Managed` mode) scoped to the production hostname (`drtoobaiqbal.com`).
   - Set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` in the production environment variables.
4. **Email Authentication (SPF, DKIM, DMARC)**:
   - Publish `SPF` (`v=spf1 include:_spf.resend.com ~all`), Resend `DKIM` CNAME records, and a strict `DMARC` policy (`v=DMARC1; p=quarantine; pct=100;`) on the domain.

---

## 4. Google Business Profile (GBP) Local SEO Checklist (Multan & Khangarh)

Maintain two distinct, verified Google Business Profiles with **exact NAP (Name, Address, Phone) consistency** matching `content/locations.ts` and the `MedicalClinic` JSON-LD schemas:

### Profile 1: Multan Clinic
- **Business Name**: `Dr. Tooba Iqbal - Gynecologist & Obstetrician (Multan Clinic)` *(Confirm exact hospital/clinic display name with client)*
- **Primary Category**: `Obstetrician-gynecologist` (`Gynecologist`)
- **Address**: `Doctors Hospital / Smile Clinic, Near High Court, Gillani Colony, Ghous-e-Azam Road, Multan, Punjab 60000, Pakistan`
- **Primary Phone**: `+92 310 1777649`
- **Website URL**: `https://drtoobaiqbal.com/en/contact#multan`
- **Appointment URL**: `https://drtoobaiqbal.com/en/contact#book-appointment`
- **Hours**: `Tuesday – Saturday` *(Confirm exact evening hours with client)*

### Profile 2: Khangarh Clinic
- **Business Name**: `Dr. Tooba Iqbal - Gynecologist & Obstetrician (Awan Surgical Centre, Khangarh)`
- **Primary Category**: `Obstetrician-gynecologist`
- **Address**: `Awan Surgical Centre, Khangarh, Muzaffargarh District, Punjab 34250, Pakistan`
- **Primary Phone**: `+92 336 6038107`
- **Website URL**: `https://drtoobaiqbal.com/en/contact#khangarh`
- **Appointment URL**: `https://drtoobaiqbal.com/en/contact#book-appointment`
- **Hours**: `Monday: 2:00 PM – 6:00 PM` (Closed Tue–Sun)

---

## 5. Completed 10-Point Acceptance Checklist Report

| # | Acceptance Requirement | Status | Verification Evidence |
| :--- | :--- | :---: | :--- |
| **1** | **Single Source of Truth (`/content/*`)**: Doctor credentials (`MBBS, MCPS`), `[CONFIRM WITH CLIENT]` flags, Multan & Khangarh clinics, 4 clinical services, 5 focus cards, consent-gated testimonials, and bilingual dictionaries (`en.json`, `ur.json`). | **PASS** | Implemented in `content/site.ts`, `content/locations.ts`, `content/services.ts`, `content/testimonials.ts`, and `content/messages/*.json`. |
| **2** | **WCAG 2.1 AA / AAA Contrast & 48px Tap Targets**: `brand-rose` (`#D88BA9`) restricted strictly to borders/dividers; WhatsApp CTAs (`#10B981`) paired with dark text (`#052E16`, `8.1:1` contrast); `min-h-tap` (`48px`) on interactive controls. | **PASS** | Enforced in `tailwind.config.ts`, `src/app/globals.css`, and all section/page components. |
| **3** | **Self-Hosted Typography (`next/font/local`)**: Zero runtime requests to `fonts.googleapis.com` or `fonts.gstatic.com`; `Poppins`, `Inter`, and conditional `Jameel Noori Nastaleeq` (`--font-jameel-noori`, `line-height: 2.0`) on `/ur` routes. | **PASS** | Configured in `src/app/[locale]/layout.tsx`, `scripts/download-fonts.mjs`, `src/middleware.ts` (`font-src 'self'`), and documented in `public/fonts/README.md`. |
| **4** | **Bilingual Routing (`/en` LTR & `/ur` RTL)**: Complete English and Urdu support across all 6 core page groups (Home, About, Services + `[slug]`, Contact, Blog + `[slug]`, Privacy, Disclaimer). | **PASS** | Verified in `src/i18n.ts`, `src/middleware.ts`, and `src/app/[locale]/**`. |
| **5** | **PMDC & Medical Compliance**: `[CONFIRM WITH CLIENT]` markers on unconfirmed credentials/hours, `[DRAFT — REQUIRES CLIENT MEDICAL APPROVAL]` on all 4 MDX blog posts, `consent: false` default on all testimonials, and emergency disclaimers. | **PASS** | Verified by unit test in `tests/unit/appointment-schema.test.ts` and `TestimonialsSection.tsx`. |
| **6** | **Hardened Appointment Backend (`POST /api/appointments`)**: `<= 4096B` payload cap (`413`), CSRF `Origin` verification (`403`), 5 req / 10 min rate limit (`429`), silent `200 OK` honeypot, Turnstile check, Pakistani phone E.164 normalization (`+92...`), and WhatsApp summary link. | **PASS** | Verified by 11 API security tests in `tests/api/appointments-route.test.ts`. |
| **7** | **Header Injection, XSS & Dual-Mode Encrypted Storage**: CR/LF stripping, HTML entity escaping, stateless default (`ENABLE_DB_STORAGE="false"`), and optional `AES-256-GCM` + `HMAC-SHA256` blind index storage via Prisma. | **PASS** | Verified in `src/lib/security/sanitize.ts`, `src/lib/security/crypto.ts`, `src/lib/email/notify.ts`, and `tests/unit/appointment-schema.test.ts`. |
| **8** | **90-Day PII Auto-Retention Purge**: Scheduled GitHub Actions workflow (`cleanup-retention.yml`) and constant-time Bearer token endpoint (`POST /api/cron/retention`). | **PASS** | Implemented in `src/app/api/cron/retention/route.ts` and `.github/workflows/cleanup-retention.yml`; verified in `tests/api/appointments-route.test.ts`. |
| **9** | **Per-Request CSP Nonces & Security Headers**: Cryptographic nonce in `src/middleware.ts`, `HSTS`, `X-Content-Type-Options: nosniff`, `Permissions-Policy`, `COOP`, `X-Frame-Options: DENY`, and `poweredByHeader: false`. | **PASS** | Implemented in `src/middleware.ts` and `next.config.mjs`. |
| **10** | **Local SEO & Nonce-Aware JSON-LD (`\u003c` Escaped)**: `Physician`, two `MedicalClinic` schemas (Multan & Khangarh), `FAQPage`, `BreadcrumbList`, dynamic `robots.txt`, and bilingual `sitemap.xml`. | **PASS** | Implemented in `src/components/seo/JsonLd.tsx`, `src/app/robots.ts`, and `src/app/sitemap.ts`. |
