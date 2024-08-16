const express = require('express');
const { check } = require('express-validator');
const quizController = require('../controllers/quizController');

const router = express.Router();

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

module.exports = router;
