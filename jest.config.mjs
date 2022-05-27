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
  roots: ["<rootDir>/src/"],
  setupFilesAfterEnv: ["./dev/jest/setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  transformIgnorePatterns: ["/node_modules/", "\\.pnp\\.[^\\/]+$"],
};
