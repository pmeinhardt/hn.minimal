function rgbFromVariable(name) {
  return ({ opacityValue }) =>
    typeof opacityValue !== "undefined"
      ? `rgb(var(${name}) / ${opacityValue})`
      : `rgb(var(${name}))`;
}

module.exports = {
  content: ["./src/**/*.{html,tsx}"],
  theme: {
    extend: {
      colors: {
        flamingo: rgbFromVariable("--color-flamingo"),
        sunset: rgbFromVariable("--color-sunset"),
      },
      spacing: {
        "3ch": "3ch",
      },
    },
  },
  plugins: [],
};
