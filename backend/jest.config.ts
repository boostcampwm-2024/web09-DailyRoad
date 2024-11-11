import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testTimeout: 100000,
  testRegex: 'test/.*\\.test\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  globalSetup: '<rootDir>/test/config/globalSetup.ts',
  globalTeardown: '<rootDir>/test/config/globalTeardown.ts',
};

export default config;
