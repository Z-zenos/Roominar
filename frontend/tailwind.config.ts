import { nextui } from '@nextui-org/theme';
import type { Config } from 'tailwindcss';
import { colors } from './src/constant/colors.constant';

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
        '400px': '400px',
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
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [nextui(), require('tailwindcss-animate'), require('tailwind-gradient-mask-image')],
} satisfies Config;

export default config;
