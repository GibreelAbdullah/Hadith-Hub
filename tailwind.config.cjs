const config = {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    "./node_modules/@skeletonlabs/skeleton/**/*.{html,js,svelte,ts}",
  ],

  theme: {
    extend: {},
  },

  plugins: [require("@skeletonlabs/skeleton/tailwind/theme.cjs")],

  darkMode: "class",
};

module.exports = config;
