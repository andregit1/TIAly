// src/utils/generateSlug.js
const bcrypt = require('bcryptjs');
const db = require('../models');
const { Url } = db;

const generateSlug = async () => {
	let slug;
	let isUnique = false;

	while (!isUnique) {
		// Generate a random string of sufficient length
		const randomString = await bcrypt.genSalt(12);
		slug = randomString.replace(/\W/g, '').substring(0, 6); 
		const existingUrl = await Url.findOne({ where: { slug } });
		if (!existingUrl) {
			isUnique = true;
		}
	}

	return slug;
};

module.exports = generateSlug;
