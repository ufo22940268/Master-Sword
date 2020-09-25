module.exports = {
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json"
    }
  },
  preset: '@shelf/jest-mongodb',
  moduleFileExtensions: [
    "ts",
    "js"
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  testMatch: [
    "**/test/**/*.test.(ts|js)"
  ],
  bail: 1,
  setupFiles: ["./test/setupJest.ts"],
  testEnvironment: "node"
};
