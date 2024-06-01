const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API endpoints for user authentication
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               roleId:
 *                 type: integer
 *                 example: null
 *                 default: null
 *     responses:
 *       '201':
 *         description: User registered successfully
 *       '400':
 *         description: Bad request
 */
router.post('/signup', authController.signup);

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: Sign in a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User signed in successfully
 *       '401':
 *         description: Unauthorized
 */
router.post('/signin', authController.signin);

/**
 * @swagger
 * /auth/signout:
 *   get:
 *     summary: Sign out the current user
 *     tags: [Authentication]
 *     responses:
 *       '200':
 *         description: User signed out successfully
 *       '401':
 *         description: Unauthorized
 */
router.get('/signout', authController.signout);

module.exports = router;
