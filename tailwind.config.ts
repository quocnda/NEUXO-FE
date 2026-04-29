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
        '3xl': '36px',
        '2xl': '24px',
        xl: '16px',
        lg: '12px',
        md: '8px',
        sm: '4px',
        haft: '50%',
      },
      boxShadow: {
        active: '0 0 80px 0 rgba(0, 0, 0, 0.10)',
        DEFAULT: '0 4px 8px 0 rgba(16,24,40,0.15)',
        custom: '3px 0px 4.1px 0px rgba(0, 0, 0, 0.06)',
        popover1: '0px 32px 48px -8px rgba(0, 0, 0, 0.1)',
        popover2: '0px 0px 14px -4px rgba(0, 0, 0, 0.08)',
        popover3: '0px 40px 64px -12px rgba(0, 0, 0, 0.08)',
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
