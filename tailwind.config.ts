import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Brand saffron — calibrated to design prototype ──────────────────
        saffron: {
          50:  "#fffaf5",
          100: "#fff0e0",
          200: "#fdd9b5",
          300: "#f9be80",
          400: "#F4A04A", // light saffron — lotus icons, stats on dark bg
          500: "#E8740C", // PRIMARY — CTAs, accents, selection
          600: "#C95E08", // dark — hover / pressed state
          700: "#a34a06",
          800: "#7d3805",
          900: "#5c2904",
        },
        // ── Brand teal — calibrated to design prototype ─────────────────────
        teal: {
          50:  "#f0f9f9",
          100: "#d4eced",
          200: "#a9d9da",
          300: "#7dc5c7",
          400: "#52b2b4",
          500: "#279fa2",
          600: "#0D6B6E", // PRIMARY — links, nav text, body teal
          700: "#0A5557", // DARK — stats bar, contact section bg
          800: "#074042",
          900: "#052c2d",
        },
        // ── Cream / warm whites ─────────────────────────────────────────────
        cream: {
          DEFAULT: "#FAF7F2", // page background
          dark:    "#F1E9DC", // hero gradient end
          card:    "#FFFDF9", // cards, nav bg
        },
        // ── Ink / near-blacks ───────────────────────────────────────────────
        ink: {
          DEFAULT: "#1C1C1A", // body text, dark section bg
          deep:    "#141413", // footer background
          muted:   "rgba(28,28,26,0.72)", // secondary body text
        },
        // ── Section accent backgrounds ──────────────────────────────────────
        saffron_card: "#FFF6EC",
        teal_card:    "#E9F3F3",
      },

      fontFamily: {
        // DM Sans — primary UI/body font (matches design prototype)
        sans:       ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        // Rozha One — display / headings / brand name
        rozha:      ["var(--font-rozha)", "serif"],
        // Bengali script
        bengali:    ["var(--font-noto-bengali)", "serif"],
        // Hindi / Devanagari script
        devanagari: ["var(--font-noto-devanagari)", "sans-serif"],
        // Yatra One — Indic display font for hero branding
        yatra:      ["var(--font-yatra)", "serif"],
      },

      borderRadius: {
        card:  "20px",
        card2: "22px",
        pill:  "99px",
        input: "14px",
      },

      boxShadow: {
        card:       "0 14px 34px -26px rgba(28,28,26,0.5)",
        "card-hover": "0 22px 44px -18px rgba(13,107,110,0.55)",
        saffron:    "0 6px 16px -6px rgba(232,116,12,0.7)",
        "saffron-lg": "0 12px 28px -12px rgba(232,116,12,0.9)",
        teal:       "0 22px 50px -22px rgba(13,107,110,0.6)",
        whatsapp:   "0 12px 28px -8px rgba(37,211,102,0.7)",
      },

      backgroundImage: {
        "hero-radial":    "radial-gradient(120% 90% at 50% 30%, #FFFDF9 0%, #FAF7F2 42%, #F1E9DC 100%)",
        "stats-gradient": "linear-gradient(120deg, #0D6B6E, #0A5557)",
        "teacher-gradient": "linear-gradient(160deg, #E9F3F3, #DDEDED)",
        "contact-gradient": "linear-gradient(160deg, #0D6B6E, #0A4F51)",
        "saffron-radial":  "radial-gradient(circle at 50% 40%, #F4A04A, #E8740C 60%, #C95E08)",
        "text-saffron":    "linear-gradient(100deg, #E8740C, #C95E08)",
        "scroll-rail":     "linear-gradient(to top, #E8740C, #0D6B6E)",
        "saffron-card-bg": "linear-gradient(160deg, #FFF6EC, #FBE9D4)",
        "teal-card-bg":    "linear-gradient(160deg, #E9F3F3, #D7EAEA)",
        "dot-grid":        "radial-gradient(rgba(13,107,110,0.10) 1.3px, transparent 1.3px)",
      },

      backgroundSize: {
        "dot-grid": "26px 26px",
      },

      keyframes: {
        "nyc-pulse": {
          "0%,100%": {
            boxShadow: "0 8px 24px rgba(232,116,12,.35), 0 0 0 0 rgba(232,116,12,.45)",
          },
          "50%": {
            boxShadow: "0 10px 30px rgba(232,116,12,.45), 0 0 0 14px rgba(232,116,12,0)",
          },
        },
        "nyc-bounce": {
          "0%,100%": { transform: "translateY(0)" },
          "50%":     { transform: "translateY(-7px)" },
        },
        "nyc-spin": {
          to: { transform: "rotate(360deg)" },
        },
        "nyc-rise": {
          from: { opacity: "0", transform: "translateY(22px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "nyc-fadein": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "nyc-fade60": {
          from: { opacity: "0" },
          to:   { opacity: "0.6" },
        },
        "nyc-breathe": {
          "0%,100%": { transform: "scale(1)" },
          "50%":     { transform: "scale(1.08)" },
        },
        "nyc-reveal": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },

      animation: {
        "nyc-spin":    "nyc-spin 220s linear infinite",
        "nyc-pulse":   "nyc-pulse 3s ease-in-out infinite",
        "nyc-bounce":  "nyc-bounce 2s ease-in-out infinite",
        "nyc-spin-slow": "nyc-spin 220s linear infinite",
        "nyc-rise":    "nyc-rise 0.8s ease-out both",
        "nyc-fadein":  "nyc-fadein 0.6s ease-out both",
        "nyc-fade60":  "nyc-fade60 0.6s ease-out both",
        "nyc-breathe": "nyc-breathe 3s ease-in-out infinite",
        "nyc-reveal":  "nyc-reveal 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
