const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

// Add a question and associate it with a quiz
router.post('/questions', questionController.insertQuestion);

// Update a question
router.put('/questions/:id', questionController.updateQuestion);

// Delete a question and remove it from the quiz
router.delete('/questions/:id', questionController.deleteQuestion);

// Get questions for a specific quiz
router.get('/quizzes/question/:quizId', questionController.getQuestionsForQuiz);

module.exports = router;
