const redis = require('../config/ioredis');
const db = require('../models');
const { Url } = db;

const syncClickCounts = async () => {
  try {
    const keys = await redis.keys('url:*:clickCount');

    for (const key of keys) {
      const slug = key.split(':')[1];
      const clickCount = await redis.get(key);

      await Url.update(
        { clickCount },
        { where: { slug } }
      );

      // Clear the click count from Redis
      await redis.del(key);

      // Clear the cached URL entry
      await redis.del(`url:${slug}`);
    }
  } catch (err) {
    console.error('Error syncing click counts:', err);
  }
};

module.exports = syncClickCounts;
