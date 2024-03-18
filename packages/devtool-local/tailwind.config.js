/** @type {import('tailwindcss').Config} */
import theme from '../frontend/tailwind.config.js';
theme.content = [
  '../frontend/src/pages/**/*.{ts,tsx}',
  '../frontend/src/components/**/*.{ts,tsx}',
  '../frontend/src/app/**/*.{ts,tsx}',
  '../frontend/src/**/*.{ts,tsx}',
];
export default theme;
