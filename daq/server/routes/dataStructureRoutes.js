const express = require('express');
const visualizationController = require('../controllers/visualizationController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Routes
router.get('/', visualizationController.getDataStructures);
router.get('/find/:name', visualizationController.findDataStructureByName); // New route

module.exports = router;
