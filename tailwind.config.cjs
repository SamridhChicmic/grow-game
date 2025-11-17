/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "lg-heart": "rgba(254, 246, 244, 0.12)",
        primary: "#4483EB",
        accent: "#4483EB",

        "dark-650": "#2b2f3d",
        "dark-700": "#22242F",
        "dark-750": "#1F232D",
        "dark-800": "#1B1E27",
        "dark-850": "#171921",
        "couch-grey": "#666",
        // body: "var(--background-color)",
        body: "#15171e",
        "game-green": "#21d833",
      },

      gridTemplateColumns: {
        gamesGrid: "repeat(auto-fit, minmax(220px, 1fr))",
        gamesGridSm: "repeat(auto-fit, minmax(150px, 1fr))",
      },
      keyframes: {
        "slide-in": {
          "0%": {
            opacity: 0,
            transform: "translateX(-80px)",
          },
          "100%": {
            opacity: 1,
            transform: "translateX(0)",
          },
        },
      },
      animation: {
        "slide-in": "slide-in 0.3s ease-out forwards",
      },
    },
  },
  plugins: [],
};
