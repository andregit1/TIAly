// src/routes/urlRoutes.js
const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');
const authorize = require('../middleware/authorize');

router.get('/:slug', urlController.redirect);
router.post('/' , urlController.createUrl);

module.exports = router;
