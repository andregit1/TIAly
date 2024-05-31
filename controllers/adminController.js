const db = require('../models');
const { Url } = db;
const generateSlug = require('../utils/generateSlug');
const { createShortenedUrl } = require('../services/url/create')
const redis = require('../config/ioredis');
const CACHE_EXPIRATION = process.env.REDIS_CACHE_EXPIRATION || 3600; // Default to 3600 if not set

exports.listUrls = async (req, res) => {
  try {
    const urls = await Url.findAll({
      order: [
        ['isCustom', 'DESC'], // Custom slugs first
        ['createdAt', 'DESC']
      ]
    });
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
  await createShortenedUrl(req, res)
};

exports.updateUrl = async (req, res) => {
  try {
    const url = await Url.findByPk(req.params.id);
    if (!url) {
      return res.status(404).send('Not Found');
    }

    const { slug, originalUrl } = req.body;
    let newSlug = url.slug; // Default to the current slug if not updating
		let isCustomized = false;

    // If slug is provided and different, check uniqueness
    if (slug && slug !== url.slug) {
      // Check cache first
      const cachedSlug = await redis.get(`slug:${slug}`);
      if (cachedSlug) {
        return res.status(400).send('Slug already in use. Please provide a unique slug.');
      }

      // Check the database if not in cache
      const existingUrl = await Url.findOne({ where: { slug } });
      if (existingUrl) {
        // Update the cache to indicate this slug is taken
        await redis.set(`slug:${slug}`, 'exists', 'EX', CACHE_EXPIRATION);
        return res.status(400).send('Slug already in use. Please provide a unique slug.');
      }

      newSlug = slug;
			isCustomized = true
    }

    // If originalUrl is provided and different, consider regenerating the slug if required
    if (originalUrl && originalUrl !== url.originalUrl) {
      newSlug = slug ? newSlug : await generateSlug();
    }

    await url.update({ slug: newSlug, originalUrl, isCustom: isCustomized });

    // Update the cache with the new slug and URL data
    await redis.set(`url:${newSlug}`, JSON.stringify(url), 'EX', CACHE_EXPIRATION);
    
		if (newSlug !== url.slug) {
      await redis.del(`url:${url.slug}`); // Delete the old cache entry if the slug has changed
    }

    res.json(url);
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
