import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ===== NEARU BRAND PALETTE =====
        brand: {
          DEFAULT: 'var(--brand)',
          50: 'var(--brand-50)',
          100: 'var(--brand-100)',
          200: 'var(--brand-200)',
          300: 'var(--brand-300)',
          400: 'var(--brand-400)',
          500: 'var(--brand-500)',
          600: 'var(--brand-600)',
          700: 'var(--brand-700)',
          800: 'var(--brand-800)',
          900: 'var(--brand-900)',
          light: 'var(--brand-light)',
          dark: 'var(--brand-dark)',
          foreground: 'var(--brand-foreground)',
        },

        // ===== SHADCN OVERRIDES =====
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',

        // ===== SURFACE & TEXT =====
        surface: {
          DEFAULT: 'var(--surface)',
          elevated: 'var(--surface-elevated)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },

        // ===== SEMANTIC =====
        success: {
          DEFAULT: 'var(--success)',
          foreground: 'var(--success-foreground)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          foreground: 'var(--warning-foreground)',
        },
        premium: {
          DEFAULT: 'var(--premium)',
          foreground: 'var(--premium-foreground)',
        },

        // ===== SIDEBAR =====
        sidebar: {
          background: 'var(--sidebar-background)',
          foreground: 'var(--sidebar-foreground)',
          primary: 'var(--sidebar-primary)',
          'primary-foreground': 'var(--sidebar-primary-foreground)',
          accent: 'var(--sidebar-accent)',
          'accent-foreground': 'var(--sidebar-accent-foreground)',
          border: 'var(--sidebar-border)',
          ring: 'var(--sidebar-ring)',
        },
      },

      borderRadius: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        pill: '9999px',
      },

      boxShadow: {
        xs: '0 1px 2px rgba(0,0,0,.04)',
        sm: '0 2px 8px rgba(0,0,0,.06)',
        md: '0 4px 16px rgba(0,0,0,.08)',
        lg: '0 8px 32px rgba(0,0,0,.10)',
        xl: '0 16px 48px rgba(0,0,0,.12)',
        card: '0 2px 12px rgba(27,67,50,.06)',
        'card-hover': '0 8px 24px rgba(27,67,50,.12)',
        float: '0 12px 40px rgba(0,0,0,.10)',
        search: '0 4px 20px rgba(0,0,0,.06)',
        brand: '0 2px 8px rgba(27,67,50,.25)',
        'brand-lg': '0 4px 16px rgba(27,67,50,.35)',
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },

      backgroundImage: {
        'gradient-brand':
          'linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%)',
        'gradient-brand-radial':
          'radial-gradient(ellipse at top left, var(--gradient-start) 0%, var(--gradient-end) 100%)',
        'gradient-hero':
          'linear-gradient(180deg, var(--gradient-hero-start) 0%, var(--gradient-hero-end) 100%)',
      },

      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
