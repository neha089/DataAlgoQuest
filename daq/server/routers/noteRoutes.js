const express = require('express');
const noteController = require('../controllers/noteController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Routes
router.post('/data-structure/:data_structure_id', authMiddleware, noteController.addNoteToDataStructure);
router.post('/coding-challenge/:coding_challenge_id', authMiddleware, noteController.addNoteToCodingChallenge);
router.get('/data-structure/:data_structure_id', authMiddleware, noteController.getNotesForDataStructure);
router.get('/coding-challenge/:coding_challenge_id', authMiddleware, noteController.getNotesForCodingChallenge);
router.get('/all', authMiddleware, noteController.getAllUserNotes); // New route for fetching all user notes

module.exports = router;
