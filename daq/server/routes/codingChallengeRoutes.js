const express = require('express');
const { body } = require('express-validator');
const challengeController = require('../controllers/codingChallengeController');
const router = express.Router();

// Validation rules
// Validation rules
const submitChallengeValidation = [
  body('challenge_id').notEmpty().withMessage('Challenge ID is required')
];

// Routes
router.get('/', challengeController.getChallenge);
router.post('/', [
  body('title').notEmpty().withMessage('Title is required'),
  body('problem_statement').notEmpty().withMessage('Problem statement is required'),
  body('link').notEmpty().withMessage('Link is required'),
  body('level').notEmpty().isIn(['hard', 'medium', 'easy']).withMessage('Level is required and must be one of hard, medium, easy'),
  body('data_structure_id').notEmpty().withMessage('Data structure ID is required')
],
challengeController.createChallenge);

router.put('/:id', [
  body('title').optional().notEmpty().withMessage('Title should not be empty'),
  body('problem_statement').optional().notEmpty().withMessage('Problem statement should not be empty'),
  body('level').optional().isIn(['hard', 'medium', 'easy']).withMessage('Level must be one of hard, medium, easy'),
  body('data_structure_id').optional().notEmpty().withMessage('Data structure ID should not be empty'),
  body('revision').optional().isBoolean().withMessage('Revision should be a boolean')
],
challengeController.updateChallenge);

router.delete('/:id', challengeController.deleteChallenge);
router.get('/find/:id', challengeController.getChallengeById);
// Get all coding challenges for a specific data structure
router.get('/findds/:data_structure_id', challengeController.getChallenges);

// Add this route to search by title
router.get('/find/title/:title', challengeController.getChallengeByTitle);
router.get('/revision', challengeController.getChallengesForRevision);

router.post('/:id/submit', submitChallengeValidation, challengeController.submitChallenge);

router.get('/status', async (req, res) => {
  try {
    const userId = req.user.id;
    const challengeStatuses = await ChallengeAttempt.find({ user_id: userId }).populate('challenge');
    res.json(challengeStatuses);
  } catch (error) {
    console.error('Error retrieving challenge statuses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
