/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./providers/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-blue-600',
    'text-white',
    'bg-blue-500',
    'bg-blue-700',
    'text-gray-100',
    'text-gray-200',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
