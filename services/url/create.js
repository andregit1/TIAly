require('dotenv').config(); // Initialize dotenv
const redis = require('../../config/ioredis');
const db = require('../../models');
const { Url } = db;
const generateSlug = require('../../utils/generateSlug');
const CACHE_EXPIRATION = process.env.REDIS_CACHE_EXPIRATION || 3600; // Default to 3600 if not set

const createShortenedUrl = async (req, res) => {
  try {
    const { slug, originalUrl } = req.body;
    let finalSlug = slug;
    const currentDomain = process.env.DOMAIN;
    let isCustomized = false;

    if (finalSlug) {
      // Check cache first
      const cachedSlug = await redis.get(`slug:${finalSlug}`);
      if (cachedSlug) {
        return res.status(400).json({ message: 'Slug already exists' });
      }

      // Check the database if not in cache
      const existingUrl = await Url.findOne({ where: { slug: finalSlug } });
      if (existingUrl) {
        // Update the cache to indicate this slug is taken
        await redis.set(`slug:${finalSlug}`, 'exists', 'EX', CACHE_EXPIRATION);
        return res.status(400).json({ message: 'Slug already exists' });
      }

      isCustomized = true;
    } else {
      finalSlug = await generateSlug();
    }

    const url = await Url.create({ domain: currentDomain, slug: finalSlug, originalUrl, isCustom: isCustomized });

    // Store in cache
    await redis.set(`url:${finalSlug}`, JSON.stringify(url), 'EX', CACHE_EXPIRATION);

    res.json(url);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

module.exports = {
  createShortenedUrl
}