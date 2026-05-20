/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Core palette
        ivory: "#FAF7F2",
        cream: "#F5F0E8",
        parchment: "#EDE8DE",

        pink: {
          dust: "#E8C5C0",
          soft: "#DDA8A0",
          muted: "#C98F87",
        },

        gold: {
          soft: "#D4B896",
          warm: "#C9A87C",
          deep: "#B8905E",
        },

        sage: {
          light: "#C8D5C0",
          soft: "#A8BFA0",
          muted: "#8DAA84",
        },

        // Semantic aliases
        bg: "#FAF7F2", // ivory
        surface: "rgba(255,252,248,0.72)", // glass surface
        border: "rgba(210,200,188,0.55)", // soft warm border
        text: "#5C5148", // warm dark brown
        "text-h": "#2E2520", // headings
        "text-sm": "#9A8F85", // muted text
        accent: "#C9A87C", // soft gold
        "accent-2": "#C98F87", // dusty pink accent
        "accent-3": "#8DAA84", // sage accent
      },

      fontFamily: {
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
        display: ["'Cormorant Garamond'", "Georgia", "serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },

      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
        "4xl": "2.5rem",
      },

      backdropBlur: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
      },

      boxShadow: {
        glass: "0 4px 24px rgba(90,70,50,0.08), 0 1px 4px rgba(90,70,50,0.06)",
        "glass-md":
          "0 8px 40px rgba(90,70,50,0.12), 0 2px 8px rgba(90,70,50,0.08)",
        "glass-lg":
          "0 16px 64px rgba(90,70,50,0.15), 0 4px 16px rgba(90,70,50,0.10)",
        soft: "0 2px 12px rgba(90,70,50,0.07)",
        glow: "0 0 24px rgba(201,168,124,0.25)",
      },

      backgroundImage: {
        // Subtle warm grain texture via CSS gradient
        "warm-grain": `
          radial-gradient(ellipse at 20% 50%, rgba(232,197,192,0.18) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 20%, rgba(212,184,150,0.15) 0%, transparent 55%),
          radial-gradient(ellipse at 60% 80%, rgba(200,213,192,0.12) 0%, transparent 50%)
        `,
        "glass-gradient":
          "linear-gradient(135deg, rgba(255,252,248,0.85) 0%, rgba(250,247,242,0.65) 100%)",
      },

      animation: {
        "fade-up": "fadeUp 0.5s ease both",
        "fade-in": "fadeIn 0.4s ease both",
        shimmer: "shimmer 2s linear infinite",
      },

      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
