/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',      // ← use built-in jsdom
    testMatch: [
      '<rootDir>/src/**/*.test.ts',
      '<rootDir>/src/**/*.spec.ts'
    ],
    moduleFileExtensions: ['ts','tsx','js','jsx','json'],
    transform: {
      '^.+\\.tsx?$': 'ts-jest'
    },
    moduleDirectories: ['node_modules','src'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1'   // ← map "@/lib/..." → "src/lib/..."
    },
  };
  