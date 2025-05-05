
  /** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: [
        '<rootDir>/src/**/*.test.ts',
        '<rootDir>/src/**/*.spec.ts'
      ],
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
      '^.+\\.jsx?$': 'babel-jest',       // new: transform JS too
    },
    // transformIgnorePatterns: [
    //   '/node_modules/(?!(?:@auth0/nextjs-auth0)/)'  // do transform auth0 pkg
    // ],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
      '^@auth0/nextjs-auth0/server$': '<rootDir>/node_modules/@auth0/nextjs-auth0/dist/server/index.js'
    },
  };
  