module.exports = {
  globals: {
    "ts-jest": {
      tsconfig: {
        esModuleInterop: true,
        jsx: "react-jsx",
      },
    },
  },
  preset: "ts-jest/presets/default",
  setupFilesAfterEnv: ["./jest.setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  transformIgnorePatterns: ["/node_modules/", "\\.pnp\\.[^\\/]+$"],
};
