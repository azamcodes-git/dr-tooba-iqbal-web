
## 1. ROLE & EXECUTION RULES FOR THE AI AGENT
Act as a Senior Full-Stack Engineer (10+ years experience) and Healthcare UX Specialist.
You are building a production-ready, secure, SEO-optimized, mobile-first Next.js (App Router) website in strict TypeScript for **Dr. Tooba Iqbal (MBBS, MCPS)**, a private-practice Gynecologist & Obstetrician in **Multan and Khangarh, Pakistan**.

### Non-Negotiable Agent Rules:
- **Never write partial files or `// TODO` placeholders** in code logic. Write complete, compilable TypeScript/TSX.
- **Medical & PMDC Compliance**: Flag any unconfirmed clinical credentials, hospital names, timings, or medical blog copy with a clear `[CONFIRM WITH CLIENT]` comment in the `/content/*` config files so the client can review before launch. Never make guaranteed outcome claims or comparative "best doctor" claims.
- **Mobile-First for Southern Punjab**: Over 85% of patients browse on Android phones over 3G/4G mobile data. Every interactive element (`<button>`, `<a>`, `<input>`, `<select>`, accordion header) MUST have a minimum tap height of `48px` (`min-h-tap`). Keep client-side JS minimal.

---

## 2. CLIENT PROFILE & SINGLE SOURCE OF TRUTH (`/content/*`)
All doctor credentials, locations, services, testimonials, and localized strings must be rendered from typed files in `/content/` so they can be updated in one place:
- **Doctor Name**: Dr. Tooba Iqbal
- **Title**: Gynecologist & Obstetrician
- **Credentials**: MBBS, MCPS `[CONFIRM WITH CLIENT — PMDC Reg No: PENDING]`
- **Primary Practice Areas**: Multan and Khangarh, Southern Punjab, Pakistan
- **Social Links**:
  - Instagram: `https://www.instagram.com/dr.tooba_gynecologist` (`@dr.tooba_gynecologist`)
  - Facebook: `https://www.facebook.com/drtoobgynecologist` (`/drtoobgynecologist`)
- **Primary WhatsApp CTA**: `https://wa.me/923101777649`
- **Languages**: English (`/en`, LTR, default) and Urdu (`/ur`, RTL, `dir="rtl"`).
- **Target Local SEO Keywords**: `"gynecologist in Multan"`, `"gynecologist in Khangarh"`, `"female gynecologist"`, `"PCOS treatment Multan"`, `"antenatal care Multan"`.

### Clinic Locations (`/content/locations.ts`):
1. **Multan Clinic**
   - Hospital / Clinic Name: `Doctors Hospital / Smile Clinic` `[CONFIRM exact display name]`
   - Address: `Near High Court, Gillani Colony, Ghous-e-Azam Road, Multan, Punjab, Pakistan`
   - Timings: `Tuesday to Saturday` `[CONFIRM exact hours, e.g., 4:00 PM – 8:00 PM]`
   - Phone (Display): `+92 310 1777649`
   - Phone (E.164 `tel:` link): `tel:+923101777649`
   - WhatsApp Link: `https://wa.me/923101777649`
2. **Khangarh Clinic**
   - Hospital / Clinic Name: `Awan Surgical Centre, Khangarh`
   - Address: `Awan Surgical Centre, Khangarh, Muzaffargarh District, Punjab, Pakistan`
   - Timings: `Every Monday, 2:00 PM to 6:00 PM`
   - Phone (Display): `0336-6038107`
   - Phone (E.164 `tel:` link): `tel:+923366038107`

---

## 3. DESIGN SYSTEM & WCAG 2.1 AA CONTRAST RULES (`tailwind.config.ts`)
Define these exact custom color tokens in `tailwind.config.ts`:
- `brand-plum`: `#6B1D4F` (headings, primary buttons, sticky header; hover `#56163F`; light `#852964`)
- `brand-rose`: `#D88BA9` (borders, dividers, decorative accents; alt `#E8A5C1`)
- `canvas`: `#FDF6F8` (warm hygienic page background)
- `card-tint`: `#F9EBF1` (service cards, tip boxes, accordion panels)
- `ink`: `#2D1524` (primary body text; muted `#5C3A4D` for secondary captions)
- `whatsapp`: `#10B981` (WhatsApp CTA background; hover `#0EA572`; pair with `whatsapp-ink: #052E16` or `ink: #2D1524`)

### Strict Accessibility & Contrast Guardrails:
1. **Never use `brand-rose` (`#D88BA9`) for text on `canvas` (`#FDF6F8`) or `card-tint` (`#F9EBF1`)** — its contrast ratio is `2.6:1` (fails WCAG AA). Restrict `brand-rose` strictly to borders, dividers, and decorative backgrounds paired with `ink` or `brand-plum` text.
2. **WhatsApp CTA Contrast Fix**: White text (`#FFFFFF`) on `#10B981` is `2.54:1` (fails WCAG AA). Always render `#10B981` buttons with dark text (`#052E16` or `#2D1524`), which achieves `7.2:1`–`8.9:1` (WCAG AAA) for outdoor Android readability.
3. **Self-Hosted Typography (`next/font/local`)**:
   - Zero runtime requests to `fonts.googleapis.com` or `fonts.gstatic.com`.
   - Headings: `Poppins` (`600`, `700`, `800`) via `--font-poppins`.
   - Body (English): `Inter` (`400`, `500`) via `--font-inter`.
   - Urdu (`/ur` routes ONLY): `Jameel Noori Nastaleeq` (`JameelNooriNastaleeq.woff2`) via `--font-jameel-noori` (`font-urdu`), with `18px` (`1.125rem`) base size, `line-height: 2.0`, and `word-spacing: 0.05em` on RTL routes.
4. **Visual Tone**: Warm, calm, clean, hygienic, respectful. Use tasteful line icons (SVG); **no explicit anatomical imagery**.

---

## 4. COMPLETE FOLDER TREE TO GENERATE
Instruct the agent in Antigravity to scaffold and populate this exact directory structure:

```text
dr-tooba-iqbal-web/
├── .github/
│   ├── dependabot.yml
│   └── workflows/
│       ├── ci.yml
│       └── cleanup-retention.yml
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│       └── 20261106000000_init/
│           └── migration.sql
├── public/
│   ├── .well-known/
│   │   └── security.txt
│   ├── fonts/
│   │   └── README.md                   # Instructions/script to place WOFF2 subsets
│   └── images/
│       └── doctor-placeholder.svg      # Tasteful vector clinical portrait placeholder
├── content/
│   ├── site.ts                         # Single config for credentials, PMDC, socials, emergency notice
│   ├── locations.ts                    # Multan & Khangarh structured data, timings, E.164 phones, map embeds
│   ├── services.ts                     # 4 clinical service categories + 5 Home focus cards + FAQs
│   ├── testimonials.ts                 # Consent-gated array (`consent: boolean`); all false by default
│   ├── messages/
│   │   ├── en.json                     # English strings
│   │   └── ur.json                     # Urdu RTL strings
│   └── blog/
│       ├── turning-30-reproductive-health.mdx
│       ├── uti-prevention-and-care.mdx
│       ├── pregnancy-cramps-vs-labour.mdx
│       └── understanding-pcos-hormonal-balance.mdx
├── src/
│   ├── env.ts                          # Startup Zod validation for server & NEXT_PUBLIC_ env vars
│   ├── i18n.ts                         # Locale helper ('en' | 'ur')
│   ├── middleware.ts                   # Per-request CSP nonce, HSTS, security headers, locale routing
│   ├── app/
│   │   ├── globals.css                 # Tailwind directives + focus-visible + reduced-motion rules
│   │   ├── [locale]/
│   │   │   ├── layout.tsx              # Root locale layout (Poppins/Inter/Jameel Noori Nastaleeq, Header, Footer, Floating WhatsApp)
│   │   │   ├── page.tsx                # PAGE 1: Home
│   │   │   ├── about/
│   │   │   │   └── page.tsx            # PAGE 2: About Dr. Tooba Iqbal
│   │   │   ├── services/
│   │   │   │   ├── page.tsx            # PAGE 3: Services Accordion/Tabs
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx        # Deep SEO Service Detail Pages
│   │   │   ├── contact/
│   │   │   │   └── page.tsx            # PAGE 4: Clinics, Timings, Lazy Maps & Booking Form
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx            # PAGE 5: Health Tips Index
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx        # Sanitized MDX Blog Post Reader with Medical Review Banner
│   │   │   ├── privacy/
│   │   │   │   └── page.tsx            # PAGE 6a: Privacy Policy
│   │   │   └── disclaimer/
│   │   │       └── page.tsx            # PAGE 6b: Medical Disclaimer
│   │   ├── api/
│   │   │   ├── appointments/
│   │   │   │   └── route.ts            # Hardened POST Booking Route Handler
│   │   │   └── cron/
│   │   │       └── retention/
│   │   │           └── route.ts        # 90-day PII auto-deletion cron endpoint
│   │   ├── robots.ts                   # Dynamic robots.txt
│   │   └── sitemap.ts                  # Dynamic sitemap.xml (/en and /ur)
│   ├── components/
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── QuickInfoBar.tsx
│   │   │   ├── CoreFocusGrid.tsx
│   │   │   ├── ServiceAccordion.tsx
│   │   │   ├── ClinicCards.tsx
│   │   │   ├── TestimonialsSection.tsx
│   │   │   └── AppointmentForm.tsx
│   │   └── seo/
│   │       └── JsonLd.tsx              # Nonce-aware JSON-LD component (Physician, MedicalClinic, FAQPage, BreadcrumbList)
│   └── lib/
│       ├── validation/
│       │   └── appointment.ts          # Zod schema: Pakistani phone -> E.164, future date, 300-char reason
│       ├── security/
│       │   ├── crypto.ts               # AES-256-GCM encryption for stored phone numbers + SHA-256 blind index
│       │   ├── rate-limit.ts           # Upstash Redis + in-memory fallback (5 req / 10 min / IP)
│       │   ├── turnstile.ts            # Cloudflare Turnstile verification
│       │   └── sanitize.ts             # CR/LF header injection stripper + HTML entity escaper
│       ├── email/
│       │   └── notify.ts               # Resend / SMTP notification sender (plain-text + escaped HTML)
│       └── db/
│           └── prisma.ts               # Singleton Prisma client + 90-day purge helper
├── tests/
│   ├── unit/
│   │   └── appointment-schema.test.ts
│   ├── api/
│   │   └── appointments-route.test.ts
│   └── e2e/
│       └── booking-flow.spec.ts
├── .env.example
├── .gitignore
├── .nvmrc
├── next.config.mjs
├── package.json
├── playwright.config.ts
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

---

## 5. PAGE-BY-PAGE REQUIREMENTS

### Shared Layout (`src/app/[locale]/layout.tsx`)
- **Header**: Sticky minimal mobile header (`min-h-tap` 48px+ targets), Doctor name + MBBS/MCPS subtitle, desktop & mobile horizontal pill navigation, `/en` <-> `/ur` language toggle, and `"Book Appointment"` CTA button.
- **Footer**: Emergency medical disclaimer banner, consistent NAP (Name, Address, E.164 `tel:` links) for Multan and Khangarh, Instagram/Facebook links, PMDC placeholder notice, links to `/privacy` and `/disclaimer`, and extra bottom padding (`pb-24 sm:pb-12`) so the floating WhatsApp CTA never obscures footer content or form buttons.
- **Floating WhatsApp Button**: Fixed bottom-right (`https://wa.me/923101777649`), `bg-whatsapp` (`#10B981`) with `text-whatsapp-ink` (`#052E16`).

### Page 1: Home (`src/app/[locale]/page.tsx`)
1. **Hero**:
   - `H1`: `"Expert Gynecological Care & Women's Health in Multan & Khangarh"`
   - `Subheading`: `"Dedicated care for pregnancy, reproductive health, hormonal balance, and specialized treatments."`
   - `CTAs`: `[Book Appointment]` (scrolls to `#book-appointment`) and `[Chat on WhatsApp]` (`https://wa.me/923101777649`).
   - `Visual`: Professional placeholder illustration (`public/images/doctor-placeholder.svg`) rendered with `next/image`, descriptive `alt` text, priority loading for fast LCP.
2. **Quick Info Bar**: Both Multan and Khangarh practice locations with days/timings and one-tap `tel:+92...` links.
3. **Core Health Focus Grid** (5 cards linking to `/services#[slug]`):
   1. Reproductive Health & Turning 30 Care
   2. Antenatal Care & Pregnancy
   3. PCOS, Hormonal Balance & Infertility Treatments
   4. UTI & Common Women's Health Issues
   5. Pregnancy Symptoms Guide (Cramps vs. Labour)
4. **Success Stories / Testimonials (`TestimonialsSection.tsx`)**:
   - Filter entries from `/content/testimonials.ts` by `entry.consent === true`.
   - Ship with all entries set to `consent: false` so the section renders `null` (hidden by default) until documented written patient consent is obtained.
   - Never include patient names, photos, ultrasound scans, identifiable details, or outcome guarantees.
5. **About Teaser & FAQ Teaser**: Short bio summary linking to `/about`, 4 key FAQs with `FAQPage` JSON-LD, and the embedded `AppointmentForm` section (`#book-appointment`).

### Page 2: About (`src/app/[locale]/about/page.tsx`)
- Credentials (`MBBS, MCPS` — rendered from `/content/site.ts`), PMDC registration number badge (`[CONFIRM WITH CLIENT]`), training timeline placeholders, professional memberships placeholders, and clinical philosophy: *"Compassionate, confidential, evidence-based care for women from adolescence through maternity and menopause."*

### Page 3: Services (`src/app/[locale]/services/page.tsx` & `[slug]/page.tsx`)
- Accessible ARIA Accordion/Tabbed layout + dedicated `/services/[slug]` pages for local SEO:
  1. **Antenatal & Postnatal Care** (`antenatal-postnatal-care`): 8-week CRL scans, regular checkups, high-risk pregnancy monitoring, ultrasound guidance.
  2. **Infertility & Family Planning** (`infertility-family-planning`): hormonal imbalance assessment, ovulation tracking, personalized fertility counseling.
  3. **Hormonal Health & PCOS** (`pcos-hormonal-health`): irregular cycles, weight management, hirsutism/acne, metabolic concerns.
  4. **General Gynecology** (`general-gynecology`): UTIs, pelvic pain, menstrual irregularities, preventive screenings after 30.
- Every service displays: **What it is**, **When to see a doctor**, **What to expect**, and a **Book / WhatsApp CTA**.

### Page 4: Clinics, Timings & Location (`src/app/[locale]/contact/page.tsx`)
- Side-by-side responsive cards for **Multan** and **Khangarh** with exact address, timings, E.164 `tel:` links, WhatsApp links, and lazy-loaded Google Maps `<iframe>` (`loading="lazy"`, `referrerPolicy="no-referrer-when-downgrade"`, titled for screen readers).
- Embedded `AppointmentForm` (`#book-appointment`).

### Page 5: Health Tips / Blog (`src/app/[locale]/blog/page.tsx` & `[slug]/page.tsx`)
- 4 MDX seed articles in `/content/blog/`:
  1. `turning-30-reproductive-health.mdx`
  2. `uti-prevention-and-care.mdx`
  3. `pregnancy-cramps-vs-labour.mdx`
  4. `understanding-pcos-hormonal-balance.mdx`
- Every post displays: Author byline (`Dr. Tooba Iqbal, MBBS, MCPS`), `"Last Medically Reviewed"` date, a `[DRAFT — REQUIRES CLIENT MEDICAL APPROVAL]` flag, and a prominent educational disclaimer box.

### Page 6: Legal (`src/app/[locale]/privacy/page.tsx` & `disclaimer/page.tsx`)
- **Privacy Policy (`/privacy`)**: Explains data minimization (only name, phone, clinic choice, preferred date, short note), purpose (scheduling only), encryption in transit & at rest, 90-day maximum retention policy, zero third-party ad trackers, and contact channel for immediate data deletion.
- **Medical Disclaimer (`/disclaimer`)**: States clearly that website content is educational only, does not establish a doctor-patient relationship or replace an in-person consultation, and directs emergencies to the nearest hospital emergency room.

---

## 6. APPOINTMENT FORM & HARDENED BACKEND (`src/app/api/appointments/route.ts`)

### Form Fields (`AppointmentForm.tsx`):
1. `fullName`: string (2–80 chars, letters/spaces/Urdu characters)
2. `phone`: string (Pakistani mobile/landline format `03XX-XXXXXXX` or `+923XXXXXXXXX`, normalized server-side to E.164 `+923XXXXXXXXX`)
3. `location`: enum (`"multan"` | `"khangarh"`)
4. `preferredDate`: ISO date string (`YYYY-MM-DD`, must be today or up to 60 days in the future; warns if Monday is picked for Multan or Tue–Sat is picked for Khangarh)
5. `reason`: optional short string (`max 300 chars`), accompanied by a visible warning above the textarea:
   > *"Privacy Notice: Please state only a brief reason (e.g., 'Routine antenatal checkup' or 'PCOS consultation'). Do NOT include sensitive or detailed medical history."*
6. `website_url`: hidden honeypot field (`tabIndex={-1}`, `autoComplete="off"`, `aria-hidden="true"`).
7. `cfTurnstileToken`: Cloudflare Turnstile widget token.

### On Success UX:
- Display an accessible confirmation banner (`role="status"`) and a prominent button: **"Send Booking Summary on WhatsApp"**, linking to `https://wa.me/923101777649?text=...` pre-filled with `encodeURIComponent` booking details.

### Server-Side Security Controls (`POST /api/appointments`):
1. **Method & Content-Type Check**: Allow `POST` only; require `Content-Type: application/json`; enforce raw body size `<= 4096 bytes` (return `413` if exceeded).
2. **CSRF Origin Check**: Verify `Origin` header matches `Host` / `NEXT_PUBLIC_SITE_URL`. Reject mismatches with `403`.
3. **Per-IP Rate Limiting (`src/lib/security/rate-limit.ts`)**: Max 5 requests per 10 minutes per IP using Upstash Redis (with automatic in-memory LRU fallback for local dev/tests). Return `429 Too Many Requests` with `Retry-After` header.
4. **Honeypot Check**: If `website_url` is non-empty, silently return `200 OK` (fake success) without sending emails or writing to DB so bots do not adapt.
5. **Cloudflare Turnstile Verification (`src/lib/security/turnstile.ts`)**: Validate token against `https://challenges.cloudflare.com/turnstile/v0/siteverify`.
6. **Strict Zod Validation (`src/lib/validation/appointment.ts`)**: Validate types, lengths, enum values, future date bounds, and normalize Pakistani phone numbers to E.164 (`+92...`).
7. **Header Injection & XSS Prevention (`src/lib/security/sanitize.ts`)**: Strip `\r` and `\n` from all strings used in email subjects/headers; HTML-escape (`&`, `<`, `>`, `"`, `'`) all values interpolated into HTML email templates. Never use `dangerouslySetInnerHTML` with user input.
8. **Dual-Mode Storage (Stateless Default + Optional Encrypted Prisma)**:
   - Controlled by `ENABLE_DB_STORAGE` (`"false"` by default for maximum data minimization).
   - Always dispatches clinic notification via Resend or SMTP (`src/lib/email/notify.ts`).
   - If `ENABLE_DB_STORAGE === "true"`, encrypts `phone` using `AES-256-GCM` (`src/lib/security/crypto.ts` with a random 12-byte IV and 16-byte auth tag) and stores a `SHA-256` HMAC blind index before inserting via Prisma parameterized query.
9. **Zero PII Logging**: Never log request bodies, names, or raw phone numbers. Redact phones as `+923*******49` in any operational metric. Return generic error messages (`400`, `429`, `500`) with zero stack traces.

---

## 7. SECURITY HEADERS, CSP NONCES & SUPPLY CHAIN

### Middleware (`src/middleware.ts`) & `next.config.mjs`:
- Disable `x-powered-by` (`poweredByHeader: false`).
- Generate per-request cryptographic nonce (`Buffer.from(crypto.randomUUID()).toString("base64")`) and set:
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
  - `Content-Security-Policy`:
    - `default-src 'self';`
    - `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://challenges.cloudflare.com;`
    - `style-src 'self' 'unsafe-inline';` (required by Next.js/Tailwind static styles; no external stylesheets)
    - `img-src 'self' data: blob:;`
    - `font-src 'self';`
    - `frame-src https://www.google.com https://maps.google.com https://challenges.cloudflare.com;`
    - `connect-src 'self' https://challenges.cloudflare.com;`
    - `object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; upgrade-insecure-requests;`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()`
  - `Cross-Origin-Opener-Policy: same-origin`
  - `X-Frame-Options: DENY`

---

## 8. SEO & STRUCTURED DATA (`src/components/seo/JsonLd.tsx`)
Render JSON-LD `<script type="application/ld+json" nonce={nonce}>` with `<` escaped as `\u003c`:
1. `Physician` schema for Dr. Tooba Iqbal (`medicalSpecialty: ["Gynecologic", "Obstetric"]`).
2. Two `MedicalClinic` schemas (Multan Clinic and Khangarh Clinic) with `telephone` in E.164, `address`, `geo`, and `openingHoursSpecification`.
3. `FAQPage` schema on Home and Services pages.
4. `BreadcrumbList` schema on interior pages.
