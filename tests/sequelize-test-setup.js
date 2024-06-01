const { Sequelize } = require('sequelize');
const app = require('../app'); // Assuming your Express app is exported from app.js
const bcrypt = require('bcryptjs');
const assert = require('assert');
const request = require('supertest');
let server; // Declare a variable to hold the server instance

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:', // Use in-memory SQLite database for testing
  logging: false, // Disable logging for tests
});

// Define your models
const User = sequelize.define('User', {
  username: Sequelize.STRING,
  password: Sequelize.STRING,
});

const Role = sequelize.define('Role', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
});

const Url = sequelize.define('Url', {
  domain: Sequelize.STRING, 
  slug: Sequelize.STRING,
  originalUrl: Sequelize.TEXT,
  clickCount: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  isCustom: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
})

const UrlAccessLog = sequelize.define('UrlAccessLog', {
  urlId: Sequelize.INTEGER,
  ipAddress: Sequelize.STRING,
  userAgent: Sequelize.STRING,
})

// Define associations
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
Role.hasMany(User, { foreignKey: 'roleId' });
Url.hasMany(UrlAccessLog, { foreignKey: 'urlId' });

// Run migrations and sync models before tests
before(async function() {
  this.timeout(10000); // Increase timeout for setup if necessary

  // This will drop existing tables and re-create them
  await sequelize.sync({ force: true });

  // Seed the database with roles and users
  await Role.create({ name: 'admin' }); // Create a role "admin"
  await User.create({ username: 'admin', password: 'admin123', roleId: 1 }); // Create a user with roleId = 1 (admin role)

  // Start the Express server
  server = app.listen(3001); // Use a different port for testing
});

// Cleanup after all tests have finished
after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close(err => (err ? reject(err) : resolve()));
    });
  }

  await sequelize.close();

  // Forcefully exit the process
  setTimeout(() => {
    process.exit(0);
  }, 1000); // Delay to allow for debugging output
});

module.exports = {
  sequelize,
  assert,
  request,
  app,
  bcrypt,
  User,
  Role
}
