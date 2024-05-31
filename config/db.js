require('dotenv').config();
const process = require('process');

const development = {
  database: `${process.env.POSTGRES_DB}`,
  username: `${process.env.POSTGRES_USER}`,
  password: `${process.env.POSTGRES_PASSWORD}`,
  dialect: 'postgres',
  dialectOptions: {
    // pg options here
  },
};

module.exports = {
  development
}
