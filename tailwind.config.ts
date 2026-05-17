/* eslint-disable global-require */
const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      screens: {
        '2xl': '1440px',
      },
    },
    extend: {
      fontSize: {
        xxs: '0.625rem',
        sm: ['14px', '22px'],
        base: ['16px', '24px'],
        lg: ['16px', '24px'],
        'display-1': ['48px', '56px'],
        'display-2': ['40px', '48px'],
        'headline-1': ['32px', '40px'],
        'headline-2': ['24px', '32px'],
        'title-1': ['20px', '28px'],
        'title-2': ['18px', '26px'],
        'body-1': ['16px', '24px'],
        'body-2': ['14px', '22px'],
        'body-3': ['13px', '20px'],
        'caption-1': ['12px', '16px'],
        'caption-2': ['11px', '14px'],
        '3xl': ['30px', '38px'],
        plusIcon: ['56px', '24px'],
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
        serif: ['var(--font-serif)', ...fontFamily.serif],
      },
      flex: {
        full: '0 0 100%',
      },
      backgroundImage: {
        'popover-content': 'linear-gradient(0deg, #DADADA 0%, #FFF 45.31%)',
      },
      maxWidth: {
        auth: 'var(--auth-container)',
      },
      minWidth: {
        dialog: '1100px',
      },
      width: {
        sidebar: 'var(--w-sidebar)',
      },
      height: {
        header: 'var(--header-h)',
        'btn-lg': '3.6875rem',
        'btn-md': '2.6875rem',
        'btn-sm': '2.1875rem',
        'h-img': {
          height: '5rem',
        },
      },
      zIndex: {
        header: 999,
      },
      borderWidth: {
        DEFAULT: '1.5px',
        '0': '0',
        '2': '2px',
        '3': '3px',
        '4': '4px',
        '6': '6px',
        '8': '8px',
      },
      borderColor: {
        rgba: 'rgba(180, 210, 240, 0.25)',
      },
      colors: {
        border: {
          DEFAULT: 'hsl(var(--border))',
        },
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        surface: 'hsl(var(--surface))',
        background: {
          DEFAULT: 'hsl(var(--background))',
        },
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsla(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          light: 'hsl(var(--success-light))',
          disabled: 'hsl(var(--success-disabled))',
        },
        error: {
          DEFAULT: 'hsl(var(--error))',
          light: 'hsl(var(--error-light))',
          disabled: 'hsl(var(--error-disabled))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          light: 'hsl(var(--warning-light))',
          disabled: 'hsl(var(--warning-disabled))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          light: 'hsl(var(--info-light))',
          disabled: 'hsl(var(--info-disabled))',
        },
        divider: 'hsl(var(--divider))',
        neutral: {
          '0': '#FFFFFF',
          '10': '#FCFCFC',
          '20': '#F4F4F4',
          '30': '#EFEFEF',
          '40': '#6F767E',
          '50': '#33383F',
          '60': '#272B30',
          '70': '#1A1D1F',
          '80': '#111315',
        },
        shades: {
          '0': '#9A9FA5',
          '10': '#6F767E',
          '20': '#6F767E66',
          '30': '#11131580',
        },
        main: {
          DEFAULT: '#2A85FF',
          green: '#83BF6E',
          red: '#FF6A55',
          purple: '#8E59FF',
        },
        secondary: {
          orange: '#FFBC99',
          purple: '#CABDFF',
          blue: '#B1E5FC',
          green: '#B5E4CA',
          yellow: '#FFD88D',
        },
        disabled: {
          grey: '#E6E6E6',
          green: '#D4F3CF',
          yellow: '#FFF0C6',
        },
      },

      borderRadius: {
        '3xl': 'var(--radius-3xl)',
        '2xl': 'var(--radius-2xl)',
        xl: 'var(--radius-xl)',
        lg: 'var(--radius-lg)',
        md: 'var(--radius-md)',
        sm: 'var(--radius-sm)',
        haft: '50%',
      },
      boxShadow: {
        active: '0 24px 48px -16px rgba(15, 23, 42, 0.35)',
        DEFAULT: '0 1px 2px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.12)',
        custom: '0 6px 16px -10px rgba(15, 23, 42, 0.25)',
        popover1: '0 20px 40px -16px rgba(15, 23, 42, 0.25)',
        popover2: '0 4px 12px -4px rgba(15, 23, 42, 0.18)',
        popover3: '0 32px 56px -20px rgba(15, 23, 42, 0.28)',
        btn: '0 1px 2px rgba(15, 23, 42, 0.08), 0 1px 1px rgba(15, 23, 42, 0.04)',
      },
      keyframes: {
        bing: {
          '0%': {
            boxShadow: '0 0 0 0 rgba(255, 255, 255, 0.7)',
          },
          '100%': {
            boxShadow: '0 0 20px 20px rgba(255, 255, 255, 0)',
          },
        },
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        lineUp: {
          '0%': { opacity: '0', transform: 'translateX(80%)' },
          '20%': { opacity: '0' },
          '50%': { opacity: '1', transform: 'translateX(0%)' },
          '100%': { opacity: '1', transform: 'translateX(0%)' },
        },
        typing: {
          '0%': {
            width: '0%',
            visibility: 'hidden',
          },
          '60%': {
            width: '100%',
          },
        },
        blink: {
          '50%': {
            borderColor: 'transparent',
          },
          '100%': {
            borderColor: '#f4901e',
          },
        },
        'text-fade-in': {
          '0%': {
            transform: 'rotateX(180deg)',
            opacity: 0,
          },
          '35%': {
            transform: 'rotateX(120deg)',
            opacity: 0,
          },
          '65%': {
            opacity: 0,
          },
          '100%': {
            transform: 'rotateX(360deg)',
            opacity: 1,
          },
        },
        'text-fade-out': {
          '0%': {
            transform: 'rotateX(0deg)',
            opacity: 1,
          },
          '35%': {
            transform: 'rotateX(-40deg)',
            opacity: 1,
          },
          '65%': {
            opacity: 0,
          },
          '100%': {
            transform: 'rotateX(180deg)',
            opacity: 0,
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'text-fade-out': 'text-fade-out 1.2s',
        'text-fade-in': 'text-fade-in 1.2s',
        lineUp: 'lineUp 2s ease-out',
        bing: 'bing 1.5s infinite ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};

export {};
