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
 * /{slug}:
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
 * /urls/create:
 *   post:
 *     summary: Create a new URL
 *     tags:
 *       - URL
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               slug:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *                 description: The custom slug for the URL (optional)
 *               originalUrl:
 *                 type: string
 *                 format: uri
 *                 description: The original URL to be shortened
 *     responses:
 *       '201':
 *         description: URL created successfully
 *       '400':
 *         description: Bad request
 */
router.post('/urls/create', urlController.createUrl);

/**
 * @swagger
 * /track-clicks:
 *   post:
 *     summary: Get click count for a specific URL slug
 *     tags: [URL]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               slug:
 *                 type: string
 *                 description: The slug associated with the URL
 *     responses:
 *       '200':
 *         description: Successfully retrieved click count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clickCount:
 *                   type: number
 *                   description: The current click count for the URL
 *       '500':
 *         description: Internal server error
 */

router.post('/track-clicks', urlController.getClickCount);

module.exports = router;
