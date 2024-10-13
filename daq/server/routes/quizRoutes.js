const express = require('express');
const { body,check} = require('express-validator');
const quizController = require('../controllers/quizController');

const router = express.Router();

// Validation rules
const submitQuizValidation = [
  body('quiz_id').notEmpty().withMessage('Quiz ID is required'),
  body('user_id').notEmpty().withMessage('User ID is required')
];


// Create a new quiz
router.post(
  '/',
  [
    check('title').not().isEmpty(),
    check('question').isArray().optional(),
    check('data_structure_id').optional().isMongoId(),
  ],
  quizController.createQuiz
);

// Get all quizzes
router.get('/', quizController.getAllQuizzes);

// Get a quiz by ID
router.get('/:id', quizController.getQuizById);

// Update a quiz by ID
router.put(
  '/:id',
  [
    check('title').not().isEmpty(),
    check('question').isArray().optional(),
    check('data_structure_id').optional().isMongoId(),
  ],
  quizController.updateQuiz
);

// Delete a quiz by ID
router.delete('/:id', quizController.deleteQuiz);
// Get quizzes by data_structure_id
router.get('/data-structure/:data_structure_id', quizController.getQuizzesByDataStructureId);
//submit quiz
router.post('/submit', submitQuizValidation, quizController.submitQuiz);
//get all specific ds'quiz which is solved by user
router.get('/solvedDs/:userId',quizController.solveQuizDs);
//get all submitted or solved quizes
router.get('/solved/:userId',quizController.solveQuizAsync);
//get quiz with highest score user
router.get('/highestScore/:quizId',quizController.getQuizWithHighestScoreUser);
//get quiz with lowest score user
router.get('/lowestScore/:quizId',quizController.getQuizWithLowestScoreUser);
router.get('/question/:quizId',quizController.getQuestionByQuizId);

module.exports = router;
