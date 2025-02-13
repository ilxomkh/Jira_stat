/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // Убедись, что пути корректны!
  theme: {
    extend: {
      animation: {
        'slow-spin': 'spin 2s linear infinite', // Увеличил время до 2 секунд
      },
    },
  },
  plugins: [],
};
