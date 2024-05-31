// tests/jest.config.js

module.exports = {
  globalSetup: './jest.setup.js',
  globalTeardown: './jest.teardown.js',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./tests/jest.setup.js'], // Path to your Jest setup file
};
