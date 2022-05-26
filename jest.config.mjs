export default {
  globals: {
    "ts-jest": {
      tsconfig: {
        esModuleInterop: true,
        jsx: "react-jsx",
      },
    },
  },
  globalSetup: "./dev/jest/global-setup.ts",
  preset: "ts-jest/presets/default",
  setupFilesAfterEnv: ["./dev/jest/setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  transformIgnorePatterns: ["/node_modules/", "\\.pnp\\.[^\\/]+$"],
};
