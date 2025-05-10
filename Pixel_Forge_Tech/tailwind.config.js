/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./App.{js,jsx,ts,tsx}",
      "./src/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            light: '#6366f1',
            DEFAULT: '#4f46e5',
            dark: '#4338ca',
          },
          secondary: {
            light: '#94a3b8',
            DEFAULT: '#64748b',
            dark: '#475569',
          },
        },
      },
    },
    plugins: [],
  }