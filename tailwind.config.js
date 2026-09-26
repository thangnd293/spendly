import colors from "./constants/colors";

function toCssVariables(palette) {
  return Object.fromEntries(
    Object.entries(palette).map(([name]) => [name, `var(--color-${name})`]),
  );
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: toCssVariables(colors.light),
    },
  },
  plugins: [],
};
