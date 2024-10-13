const express = require('express');
const noteController = require('../controllers/noteController');
const router = express.Router();

// Routes
router.post('/data-structure/:data_structure_id',noteController.addNoteToDataStructure);
router.post('/coding-challenge/:coding_challenge_id',noteController.addNoteToCodingChallenge);
router.get('/data-structure/:data_structure_id',noteController.getNotesForDataStructure);
router.get('/coding-challenge/:coding_challenge_id',noteController.getNotesForCodingChallenge);
router.get('/challenges/:coding_challenge_id',noteController.getNotesByChallengeAndUser);
router.get('/all', noteController.getAllUserNotes); // New route for fetching all user notes
router.put('/note/:note_id', noteController.updateNoteById);
router.delete('/note/:note_id', noteController.deleteNoteById);

module.exports = router;
