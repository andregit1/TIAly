require('dotenv').config(); // Load environment variables from .env file

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres'
  }
};
