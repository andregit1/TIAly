// src/models/User.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/config');
const Role = require('./Role'); // Import Role model

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'users' // Specify the table name
});

// Define associations
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });

module.exports = User;
