const express = require('express');
const { body } = require('express-validator');
const quizController = require('../controllers/quizController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Validation rules
const submitQuizValidation = [
  body('quiz_id').notEmpty().withMessage('Quiz ID is required'),
  body('score').isNumeric().withMessage('Score must be a number')
];

// Routes
router.get('/:data_structure_id', quizController.getQuizzes);
router.post('/', [
  body('title').notEmpty().withMessage('Title is required'),
  body('data_structure_id').notEmpty().withMessage('Data structure ID is required'),
  body('questions').isArray().withMessage('Questions must be an array')
], authMiddleware, quizController.createQuiz);
router.put('/:id', [
  body('title').optional().notEmpty().withMessage('Title should not be empty'),
  body('data_structure_id').optional().notEmpty().withMessage('Data structure ID should not be empty'),
  body('questions').optional().isArray().withMessage('Questions must be an array')
], authMiddleware, quizController.updateQuiz);
router.delete('/:id', authMiddleware, quizController.deleteQuiz);
router.post('/:quiz_id/questions', [
  body('question').notEmpty().withMessage('Question is required'),
  body('options').isArray().withMessage('Options must be an array'),
  body('correct_answer').notEmpty().withMessage('Correct answer is required')
], authMiddleware, quizController.addQuestion);
router.put('/questions/:id', [
  body('question').optional().notEmpty().withMessage('Question should not be empty'),
  body('options').optional().isArray().withMessage('Options must be an array'),
  body('correct_answer').optional().notEmpty().withMessage('Correct answer should not be empty')
], authMiddleware, quizController.updateQuestion);
router.delete('/questions/:id', authMiddleware, quizController.deleteQuestion);
router.post('/:id/submit', submitQuizValidation, authMiddleware, quizController.submitQuiz);
router.get('/score', authMiddleware, quizController.getQuizScores);

module.exports = router;
