// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: "#D427DEFF",
        dark: "#1E1E1E",
        light: "#FFFFFF",
      },
      fontFamily: { sans: ["Inter", "sans-serif"] },
    },
  },
  // Em v4 o `content` pode ser omitido; se quiser, pode deixar também.
};
