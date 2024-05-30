const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/config');

const UrlAccessLog = sequelize.define('UrlAccessLog', {
  urlId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userAgent: {
    type: DataTypes.STRING,
    allowNull: false
  },
  clickCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'url_access_logs' // Specify the table name
});

module.exports = UrlAccessLog;
