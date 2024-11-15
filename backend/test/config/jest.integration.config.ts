import commonConfig from './jest.common.config';
import type { Config } from 'jest';

const config: Config = {
  ...commonConfig,
  testRegex: 'test/.*/.*\\.repository\\.test\\.ts$',
  globalSetup: '<rootDir>/test/config/globalSetup.ts',
  globalTeardown: '<rootDir>/test/config/globalTeardown.ts',
};

export default config;
