module.exports = {
  purge: ["index.html", "src/**/*.js"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      gridTemplateRows: {
        layout: "minmax(0, 1fr) 4rem",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
