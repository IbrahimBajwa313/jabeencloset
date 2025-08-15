/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom feminine color palette
        rose: {
          50: "hsl(350, 30%, 97%)",
          100: "hsl(350, 25%, 94%)",
          200: "hsl(345, 30%, 88%)",
          300: "hsl(345, 35%, 80%)",
          400: "hsl(345, 50%, 70%)",
          500: "hsl(345, 85%, 65%)",
          600: "hsl(345, 80%, 55%)",
          700: "hsl(340, 75%, 45%)",
          800: "hsl(340, 70%, 35%)",
          900: "hsl(340, 65%, 25%)",
        },
        coral: {
          50: "hsl(15, 40%, 96%)",
          100: "hsl(15, 50%, 92%)",
          200: "hsl(15, 60%, 88%)",
          300: "hsl(15, 65%, 82%)",
          400: "hsl(15, 70%, 75%)",
          500: "hsl(15, 75%, 68%)",
          600: "hsl(15, 80%, 60%)",
          700: "hsl(15, 75%, 50%)",
          800: "hsl(15, 70%, 40%)",
          900: "hsl(15, 65%, 30%)",
        },
        lavender: {
          50: "hsl(280, 30%, 96%)",
          100: "hsl(280, 25%, 92%)",
          200: "hsl(280, 30%, 88%)",
          300: "hsl(280, 35%, 82%)",
          400: "hsl(280, 45%, 75%)",
          500: "hsl(280, 55%, 68%)",
          600: "hsl(280, 60%, 60%)",
          700: "hsl(280, 65%, 50%)",
          800: "hsl(280, 60%, 40%)",
          900: "hsl(280, 55%, 30%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
