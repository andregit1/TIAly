const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authorize = require('../middleware/authorize');

// Ensure authentication and authorization for admin routes
router.use(authorize('admin')); // Only admin can access these routes

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: API endpoints for admin operations
 */

/**
 * @swagger
 * /admin/urls:
 *   get:
 *     summary: Retrieve all URLs
 *     tags: [Admin]
 *     responses:
 *       '200':
 *         description: Successfully retrieved URLs
 *       '401':
 *         description: Unauthorized
 */
router.get('/urls', adminController.listUrls);

/**
 * @swagger
 * /admin/urls/{id}:
 *   get:
 *     summary: Retrieve a single URL by ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the URL to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully retrieved the URL
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: URL not found
 */
router.get('/urls/:id', adminController.getUrl);

/**
 * @swagger
 * /admin/urls:
 *   post:
 *     summary: Create a new URL
 *     tags: [Admin]
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
router.post('/urls', adminController.createUrl);

/**
 * @swagger
 * /admin/urls/{id}:
 *   put:
 *     summary: Update an existing URL by ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the URL to update
 *         schema:
 *           type: string
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
 *       '200':
 *         description: URL updated successfully
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: URL not found
 */
router.put('/urls/:id', adminController.updateUrl);

/**
 * @swagger
 * /admin/urls/{id}:
 *   delete:
 *     summary: Delete a URL by ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the URL to delete
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: URL deleted successfully
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: URL not found
 */
router.delete('/urls/:id', adminController.deleteUrl);

module.exports = router;
