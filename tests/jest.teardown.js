// tests/jest.teardown.js

const server = require('./server');
const redis = require('../config/ioredis');
const cron = require('node-cron');

afterAll(async () => {
  // Close the server
  server.close();

  // Quit the Redis connection
  await redis.quit();

  // Stop the cron job
  cron.cancelAll();
});
