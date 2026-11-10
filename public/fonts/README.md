# Self-Hosted WOFF2 Font Architecture (`public/fonts`)

## Why Self-Hosted Fonts?
1. **Patient Privacy & Zero Third-Party Tracking**: This healthcare application enforces a strict `Content-Security-Policy` with `font-src 'self';` and makes **zero runtime requests** to `fonts.googleapis.com` or `fonts.gstatic.com`, preventing patient IP addresses and browser fingerprints from being leaked to third-party font CDNs.
2. **Southern Punjab 3G/4G Performance & Nastaleeq Legibility**: Fonts are self-hosted via `next/font/local` (`src/app/[locale]/layout.tsx`). Urdu (`/ur`) routes exclusively load **Jameel Noori Nastaleeq** (`--font-jameel-noori`) with `preload: false` on English routes, an `18px` (`1.125rem`) base size, `line-height: 2.0`, and `word-spacing: 0.05em` so Urdu Nastaleeq descenders never clip inside `48px` (`min-h-tap`) buttons or inputs.

---

## Typography Mapping (`src/app/[locale]/layout.tsx`)

| CSS Variable | Typeface | Weights | Target Routes | Line-Height / Sizing |
| :--- | :--- | :--- | :--- | :--- |
| `--font-poppins` | **Poppins** | `600` (SemiBold), `700` (Bold), `800` (ExtraBold) | Headings (`h1`–`h6`) | `1.2`–`1.35` |
| `--font-inter` | **Inter** | `400` (Regular), `500` (Medium) | English (`/en`) body & UI controls | `1.5`–`1.65` |
| `--font-jameel-noori` | **Jameel Noori Nastaleeq** | `400` (Regular) | Urdu (`/ur`, `dir="rtl"`) routes ONLY (`font-urdu`) | `18px` (`1.125rem`), `line-height: 2.0`, `word-spacing: 0.05em` |

---

## Installed WOFF2 Files in `public/fonts/`

```text
public/fonts/
├── Poppins-SemiBold.woff2
├── Poppins-Bold.woff2
├── Poppins-ExtraBold.woff2
├── Inter-Regular.woff2
├── Inter-Medium.woff2
└── JameelNooriNastaleeq.woff2
```

### Automated Font Download & Verification Script

Run the automated downloader at any time from the project root to download and verify (`> 10 KB` and valid font header magic bytes) all required font assets:

```bash
node scripts/download-fonts.mjs
```
