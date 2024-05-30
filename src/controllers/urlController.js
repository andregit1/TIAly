// src/controllers/urlController.js
const db = require('../../models');
const { Url, UrlAccessLog } = db;

exports.redirect = async (req, res) => {
  const { slug } = req.params;
  try {
    const url = await Url.findOne({ where: { slug } });
    if (url) {
      // Log access
      await UrlAccessLog.create({
        urlId: url.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });

      // Increment clickCount field
      await url.increment('clickCount');

      res.redirect(301, url.originalUrl);
    } else {
      res.status(404).send('URL not found');
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
