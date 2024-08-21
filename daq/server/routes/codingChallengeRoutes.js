const express = require('express');
const { body } = require('express-validator');
const challengeController = require('../controllers/codingChallengeController');
const router = express.Router();

// Validation rules
const submitChallengeValidation = [
  body('challenge_id').notEmpty().withMessage('Challenge ID is required'),
  body('user_id').notEmpty().withMessage('User ID is required')
];

const solvedChallengeValidation = [
  body('user_id').notEmpty().withMessage('User ID is required')
];

// Routes
router.get('/', challengeController.getChallenge);
router.post('/', [
  body('title').notEmpty().withMessage('Title is required'),
  body('problem_statement').notEmpty().withMessage('Problem statement is required'),
  body('link').notEmpty().withMessage('Link is required'),
  body('level').notEmpty().isIn(['hard', 'medium', 'easy']).withMessage('Level is required and must be one of hard, medium, easy'),
  body('data_structure_id').notEmpty().withMessage('Data structure ID is required')
], challengeController.createChallenge);

router.put('/:id', [
  body('title').optional().notEmpty().withMessage('Title should not be empty'),
  body('problem_statement').optional().notEmpty().withMessage('Problem statement should not be empty'),
  body('level').optional().isIn(['hard', 'medium', 'easy']).withMessage('Level must be one of hard, medium, easy'),
  body('data_structure_id').optional().notEmpty().withMessage('Data structure ID should not be empty'),
  body('revision').optional().isBoolean().withMessage('Revision should be a boolean')
], challengeController.updateChallenge);

router.delete('/:id', challengeController.deleteChallenge);
router.get('/find/:id', challengeController.getChallengeById);
router.get('/dschallenge/:data_structure_id', challengeController.getChallenge_with_ds);
router.get('/find/title/:title', challengeController.getChallengeByTitle);
router.get('/revision', challengeController.getChallengesForRevision);

router.post('/submit', submitChallengeValidation, challengeController.submitChallenge);

// Corrected route
router.get('/status', solvedChallengeValidation, challengeController.solveChallengesAsync);

module.exports = router;
