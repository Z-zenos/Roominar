import { nextui } from '@nextui-org/theme';
import type { Config } from 'tailwindcss';
import { colors } from './src/constants/colors.constant';

const config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    './src/**/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  prefix: '',
  theme: {
    fontSize: {
      st: '6px',
      xt: '8px',
      tn: '10px',
      xs: '12px',
      ss: '13px',
      sm: '14px',
      nm: '16px',
      md: '18px',
      xm: '20px',
      lg: '25px',
      xl: '32px',
      hg: '40px',
      xh: '48px',
      sh: '80px',
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        ...colors,
        'Moderate-blue': 'hsl(238, 40%, 52%)',
        'Soft-Red': 'hsl(358, 79%, 66%)',
        'Light-grayish-blue': 'hsl(239, 57%, 85%)',
        'Pale-red': 'hsl(357, 100%, 86%)',
        'Dark-blue': 'hsl(212, 24%, 26%)',
        'Grayish-Blue': 'hsl(211, 10%, 45%)',
        'Light-gray': 'hsl(223, 19%, 93%)',
        'Very-light-gray': 'hsl(228, 33%, 97%)',
        White: 'hsl(0, 0%, 100%)',
        transparent: 'transparent',
        gradient: 'gradient',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
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
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      screens: {
        '1600px': '1600px',
        '1400px': '1400px',
        '1200px': '1200px',
        '1000px': '1000px',
        '800px': '800px',
        '600px': '600px',
        '450px': '450px',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        slide: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        slide: 'slide 1s ease-in-out linear',
        wiggle: 'wiggle 0.3s ease-in-out infinite',
      },
    },
    fontFamily: {
      rubik: ['Rubik', 'sans-serif'],
    },
  },
  plugins: [
    nextui(),
    require('tailwindcss-animate'),
    require('tailwind-gradient-mask-image'),
  ],
} satisfies Config;

export default config;
