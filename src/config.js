require('dotenv').config();

const Sequelize = require('sequelize');
// const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  define: {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true, // Use snake_case for column names
  }
});

const config = {
  sequelize,
  databaseUrl: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL,
  port: process.env.PORT || 3000,
  sessionSecret: process.env.SESSION_SECRET
};

module.exports = config;
