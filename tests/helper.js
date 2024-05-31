// tests/helper.js

const { Sequelize, DataTypes } = require('sequelize');
const { User, Role, Url, UrlAccessLog } = require('../models');

const sequelize = new Sequelize('sqlite::memory:', {
  logging: false,
});

const UserTest = User.init({
  username: DataTypes.STRING,
  password: DataTypes.STRING,
}, { sequelize, modelName: 'User' });

const RoleTest = Role.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
}, { sequelize, modelName: 'Role' });

const UrlTest = Url.init({
  domain: DataTypes.STRING, 
  slug: DataTypes.STRING,
  originalUrl: DataTypes.TEXT,
  clickCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isCustom: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, { sequelize, modelName: 'Url' });

const UrlAccessLogTest = UrlAccessLog.init({
  urlId: DataTypes.INTEGER,
  ipAddress: DataTypes.STRING,
  userAgent: DataTypes.STRING,
}, { sequelize, modelName: 'UrlAccessLog' });

UserTest.associate({ Role }); // Associate UserTest with RoleTest
RoleTest.associate({ User: UserTest }); // Associate RoleTest with UserTest
UrlTest.associate({ UrlAccessLog: UrlAccessLogTest }); // Associate UrlTest with UrlAccessLogTest

// Run migrations (if needed)
beforeAll(async () => {
  await sequelize.sync({ force: true });
});

// Clear tables after each test
afterEach(async () => {
  await UserTest.destroy({ truncate: true });
  await RoleTest.destroy({ truncate: true });
  await UrlTest.destroy({ truncate: true });
  await UrlAccessLogTest.destroy({ truncate: true });
});

module.exports = { sequelize, UserTest, RoleTest, UrlTest, UrlAccessLogTest };
