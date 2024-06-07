const redis = require('../config/ioredis');
const db = require('../models');
const { Url, UrlAccessLog } = db;
const { createShortenedUrl } = require('../services/url/create')
const CACHE_EXPIRATION = process.env.REDIS_CACHE_EXPIRATION || 3600; // Default to 3600 if not set

exports.redirect = async (req, res) => {
  const { slug } = req.params;
  try {
    // Check cache first
    const cachedUrl = await redis.get(`url:${slug}`);
    let url;
    if (cachedUrl) {
      url = JSON.parse(cachedUrl);
    } else {
      // Fetch from database if not in cache
      url = await Url.findOne({ where: { slug } });
      if (url) {
        // Store in cache
        await redis.set(`url:${slug}`, JSON.stringify(url), 'EX', CACHE_EXPIRATION);
        // return res.status(404).send('URL not found');
      }
    }

    // Log access
    await UrlAccessLog.create({
      urlId: url.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    // Increment clickCount in Redis
    await redis.incr(`url:${slug}:clickCount`);

    res.redirect(301, url.originalUrl);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.createUrl = async (req, res) => {
  await createShortenedUrl(req, res)
};

exports.getClickCount = async (req, res) => {
  const { slug } = req.body;
  try {
    const clickCount = await redis.get(`url:${slug}:clickCount`);

    res.status(200).json({ clickCount });
  } catch (err) {
    res.status(500).send(err);
  }
};
