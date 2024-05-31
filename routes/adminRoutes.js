// src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authorize = require('../middleware/authorize');

// Ensure authentication and authorization for admin routes
router.use(authorize('admin')); // Only admin can access these routes

router.get('/urls', adminController.listUrls);
router.get('/urls/:id', adminController.getUrl);
router.post('/urls', adminController.createUrl);
router.put('/urls/:id', adminController.updateUrl);
router.delete('/urls/:id', adminController.deleteUrl);

module.exports = router;
