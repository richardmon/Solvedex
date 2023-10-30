import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/**/*.{ts,tsx}'],  // Ensure this matches your test file patterns
  setupFilesAfterEnv: ['./testSetup.ts'],  // RTL setup
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',  // adjust the right-hand side if your structure is different
  },
};

export default config;
