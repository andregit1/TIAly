// src/models/Role.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/config');

const Role = sequelize.define('Role', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'roles' // Specify the table name
});

module.exports = Role;
