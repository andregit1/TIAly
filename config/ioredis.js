const IORedis = require('ioredis');
const redis = new IORedis({
  port: 6379,
  host: "redis",
});

module.exports = redis;
