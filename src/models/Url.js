// src/models/Url.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/config');

const Url = sequelize.define('Url', {
	slug: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true
	},
	originalUrl: {
		type: DataTypes.TEXT,
		allowNull: false
	}
}, {
    tableName: 'urls', // Specify the table name
		paranoid: true // Enables soft deletes
});

module.exports = { Url, sequelize };
