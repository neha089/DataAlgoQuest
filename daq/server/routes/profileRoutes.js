const express = require('express');
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Routes
router.get('/progress', authMiddleware, profileController.getProfileProgress);
router.get('/scores', authMiddleware, profileController.getProfileScores);

module.exports = router;
