import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './src/**/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#18B8BE',
        secondary: '#046478',
        tertiary: '#2196F3',
      },
    },
  },
  plugins: [],
};
export default config;
