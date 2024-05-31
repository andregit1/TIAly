// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('../middleware/auth');

router.post('/signup', authController.signup);
router.post('/signin', passport.authenticate('local'), authController.signin);
router.get('/signout', authController.signout);

module.exports = router;
