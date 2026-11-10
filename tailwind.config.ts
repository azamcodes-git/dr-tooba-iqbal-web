import type { Config } from "tailwindcss";

/**
 * WCAG 2.1 AA / AAA Healthcare Design System for Dr. Tooba Iqbal (MBBS, MCPS)
 *
 * Strict Contrast Guardrails:
 * 1. NEVER use `brand-rose` (#D88BA9) for text on `canvas` (#FDF6F8) or `card-tint` (#F9EBF1)
 *    — contrast is 2.6:1 (fails WCAG AA). Restrict `brand-rose` strictly to borders, dividers,
 *    and decorative accents paired with `ink` (#2D1524) or `brand-plum` (#6B1D4F) text.
 * 2. ALWAYS pair `whatsapp` (#10B981) backgrounds with `whatsapp-ink` (#052E16) or `ink` (#2D1524)
 *    for 7.2:1–8.9:1 (WCAG AAA) outdoor Android screen readability.
 * 3. Every interactive control must use `min-h-tap` (48px minimum height).
 */
const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx,json}"
  ],
  theme: {
    extend: {
      colors: {
        "brand-plum": {
          DEFAULT: "#6B1D4F",
          hover: "#56163F",
          light: "#852964"
        },
        "brand-rose": {
          DEFAULT: "#D88BA9",
          alt: "#E8A5C1"
        },
        canvas: "#FDF6F8",
        "card-tint": "#F9EBF1",
        ink: {
          DEFAULT: "#2D1524",
          muted: "#5C3A4D"
        },
        whatsapp: {
          DEFAULT: "#10B981",
          hover: "#0EA572",
          ink: "#052E16"
        },
        "whatsapp-ink": "#052E16"
      },
      fontFamily: {
        heading: [
          "var(--font-poppins)",
          "var(--font-jameel-noori)",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif"
        ],
        sans: [
          "var(--font-inter)",
          "var(--font-jameel-noori)",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif"
        ],
        urdu: [
          "var(--font-jameel-noori)",
          "Jameel Noori Nastaleeq",
          "Urdu Typesetting",
          "serif"
        ]
      },
      minHeight: {
        tap: "48px"
      },
      minWidth: {
        tap: "48px"
      },
      spacing: {
        tap: "48px"
      },
      lineHeight: {
        urdu: "2.0"
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(107, 29, 79, 0.08)",
        "card-hover": "0 10px 28px -4px rgba(107, 29, 79, 0.14)"
      }
    }
  },
  plugins: []
};

export default config;
