// src/controllers/adminController.js
const db = require('../models');
const { Url } = db;
const generateSlug = require('../utils/generateSlug');

exports.listUrls = async (req, res) => {
	try {
		const urls = await Url.findAll();
		res.json(urls);
	} catch (err) {
		res.status(500).send('Server Error');
	}
};

exports.getUrl = async (req, res) => {
	try {
		const url = await Url.findByPk(req.params.id);
		if (url) {
			res.json(url);
		} else {
			res.status(404).send('Not Found');
		}
	} catch (err) {
		res.status(500).send('Server Error');
	}
};

exports.createUrl = async (req, res) => {
	try {
		const { slug, originalUrl } = req.body;
		let finalSlug = slug;

		// Generate a unique slug if not provided
		if (!finalSlug) {
			finalSlug = await generateSlug();
		}

		const url = await Url.create({ slug: finalSlug, originalUrl });
		res.json(url);
	} catch (err) {
			res.status(500).send('Server Error');
	}
};

exports.updateUrl = async (req, res) => {
	try {
		const url = await Url.findByPk(req.params.id);
		if (url) {
			const { slug, originalUrl } = req.body;
			let newSlug = slug;

			// If slug is provided and different, check uniqueness
			if (slug && slug !== url.slug) {
				const existingUrl = await Url.findOne({ where: { slug } });
				if (existingUrl) {
					return res.status(400).send('Slug already in use. Please provide a unique slug.');
				}
				newSlug = slug;
			}

			// If originalUrl is provided and different, generate new slug
			if (originalUrl && originalUrl !== url.originalUrl) {
				newSlug = await generateSlug();
			}

			await url.update({ slug: newSlug, originalUrl: req.body.originalUrl });
			res.json(url);
		} else {
				res.status(404).send('Not Found');
		}
	} catch (err) {
			res.status(500).send('Server Error');
	}
};

exports.deleteUrl = async (req, res) => {
	try {
		const url = await Url.findByPk(req.params.id);
		if (url) {
			await url.destroy();
			res.json({ message: 'Deleted successfully' });
		} else {
			res.status(404).send('Not Found');
		}
	} catch (err) {
		res.status(500).send('Server Error');
	}
};
