// src/routes/authRoutes.js
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
 *             $ref: '#/components/schemas/UserSignup'
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
 *             $ref: '#/components/schemas/UserSignin'
 *     responses:
 *       '200':
 *         description: User signed in successfully
 *       '401':
 *         description: Unauthorized
 */
router.post('/signin', passport.authenticate('local'), authController.signin);

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
