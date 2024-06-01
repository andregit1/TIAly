// config/redisClient.js
const IORedis = require('ioredis');
const redis = new IORedis();

module.exports = redis;
