/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#001d37",
        "primary-container": "#16324f",
        "on-primary": "#ffffff",
        "on-primary-container": "#809abd",
        "secondary": "#0267c8",
        "secondary-container": "#e0edff",
        "on-secondary": "#ffffff",
        "background": "#f8f9fc",
        "surface": "#f8f9fc",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f1f5f9",
        "surface-container": "#e2e8f0",
        "surface-container-high": "#cbd5e1",
        "surface-container-highest": "#94a3b8",
        "on-surface": "#0b1c30",
        "on-surface-variant": "#475569",
        "outline": "#94a3b8",
        "outline-variant": "#e2e8f0",
        "error": "#dc2626",
        "error-container": "#fef2f2",
      },
      spacing: {
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2rem",
        "gutter": "1.5rem",
      },
      fontFamily: {
        headline: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        label: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        DEFAULT: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        full: "9999px",
      }
    },
  },
  plugins: [],
}
