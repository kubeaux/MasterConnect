const nextJest = require("next/jest");
const createJestConfig = nextJest({ dir: "./" });

module.exports = createJestConfig({
  testEnvironment: "jsdom",
  setupFilesAfterSetup: ["<rootDir>/jest.setup.js"],
});