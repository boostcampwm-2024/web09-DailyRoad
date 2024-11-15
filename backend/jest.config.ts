const isIntegration = process.env.TEST_ENV === 'integration';

const config = isIntegration
  ? require('./test/config/jest.integration.config').default
  : require('./test/config/jest.common.config').default;

export default config;
