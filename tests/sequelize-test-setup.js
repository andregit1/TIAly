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

  // Seed the database with roles
  const adminRole = await Role.create({ name: 'admin' }); // Create a role "admin"

  // Seed the database with users
  const adminUser = await User.create({ username: 'admin', password: 'admin123', roleId: adminRole.id }); // Create a user with roleId = adminRole.id

  // Seed the database with URL and URL Access Log data
  const url1 = await Url.create({
    domain: 'test.ly',
    slug: 'test1',
    originalUrl: 'http://example.com/test1',
    clickCount: 0,
    isCustom: true
  });

  const url2 = await Url.create({
    domain: 'test.ly',
    slug: 'test2',
    originalUrl: 'http://example.com/test2',
    clickCount: 0,
    isCustom: true
  });

  await UrlAccessLog.bulkCreate([
    {
      urlId: url1.id, // Use the id of the created URL
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36'
    },
    {
      urlId: url2.id, // Use the id of the created URL
      ipAddress: '192.168.1.2',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36'
    }
  ]);

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

  // Delete all data from the tables
  await User.destroy({ truncate: true });
  await Role.destroy({ truncate: true });
  await Url.destroy({ truncate: true });
  await UrlAccessLog.destroy({ truncate: true });

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
  Role,
  Url,
  UrlAccessLog
}
