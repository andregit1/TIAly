require('dotenv').config();

const config = {
  databaseUrl: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL,
  port: process.env.PORT || 3000,
  sessionSecret: process.env.SESSION_SECRET
};

module.exports = config;
