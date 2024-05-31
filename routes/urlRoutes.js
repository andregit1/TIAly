const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');

/**
 * @swagger
 * tags:
 *   name: URL
 *   description: API endpoints for URL management
 */

/**
 * @swagger
 * /urls/{slug}:
 *   get:
 *     summary: Redirect to the original URL associated with the provided slug
 *     tags: [URL]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         description: The slug associated with the URL
 *         schema:
 *           type: string
 *     responses:
 *       '301':
 *         description: Successfully redirected to the original URL
 *       '404':
 *         description: URL not found
 */
router.get('/:slug', urlController.redirect);

/**
 * @swagger
 * /urls:
 *   post:
 *     summary: Create a new URL
 *     tags: [URL]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Url'
 *     responses:
 *       '201':
 *         description: URL created successfully
 *       '400':
 *         description: Bad request
 */
router.post('/', urlController.createUrl);

module.exports = router;
