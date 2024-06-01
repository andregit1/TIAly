require('dotenv').config();
const process = require('process');

const development = {
  database: `${process.env.POSTGRES_DB}`,
  username: `${process.env.POSTGRES_USER}`,
  password: `${process.env.POSTGRES_PASSWORD}`,
  host: `${process.env.DB_HOST}` || "localhost",
  dialect: 'postgres',
  dialectOptions: {
    // pg options here
  },
};

const test = {
  dialect: 'sqlite',
  storage: ':memory:', // Use in-memory database for testing
};

module.exports = {
  development,
  test,
};
