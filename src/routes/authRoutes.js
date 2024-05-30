// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authService = require('../services/authService');

router.post('/signup', authController.signup);
router.post('/signin', authService.authenticate('local'), authController.signin);
router.get('/signout', authController.signout);

module.exports = router;
