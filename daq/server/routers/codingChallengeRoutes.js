const express = require('express');
const { body } = require('express-validator');
const challengeController = require('../controllers/challengeController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Validation rules
const submitChallengeValidation = [
  body('challenge_id').notEmpty().withMessage('Challenge ID is required'),
  body('score').isNumeric().withMessage('Score must be a number')
];

// Routes
router.get('/:data_structure_id', challengeController.getChallenges);
router.post('/', [
  body('title').notEmpty().withMessage('Title is required'),
  body('problem_statement').notEmpty().withMessage('Problem statement is required'),
  body('level').notEmpty().isIn(['hard', 'medium', 'easy']).withMessage('Level is required and must be one of hard, medium, easy'),
  body('data_structure_id').notEmpty().withMessage('Data structure ID is required')
], authMiddleware, challengeController.createChallenge);
router.put('/:id', [
  body('title').optional().notEmpty().withMessage('Title should not be empty'),
  body('problem_statement').optional().notEmpty().withMessage('Problem statement should not be empty'),
  body('level').optional().isIn(['hard', 'medium', 'easy']).withMessage('Level must be one of hard, medium, easy'),
  body('data_structure_id').optional().notEmpty().withMessage('Data structure ID should not be empty'),
  body('revision').optional().isBoolean().withMessage('Revision should be a boolean')
], authMiddleware, challengeController.updateChallenge);
router.delete('/:id', authMiddleware, challengeController.deleteChallenge);
router.get('/find/:id', challengeController.getChallengeById);
router.get('/find', challengeController.getChallengesByName);
router.get('/revision', challengeController.getChallengesForRevision);
router.post('/:id/submit', submitChallengeValidation, authMiddleware, challengeController.submitChallenge);
router.get('/status', authMiddleware, challengeController.getChallengeStatus);

module.exports = router;
