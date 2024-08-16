const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

// Route to insert a new question
router.post('/questions', questionController.insertQuestion);

// Route to get all questions
router.get('/questions', questionController.getQuestions);

// Route to get a single question by ID
router.get('/questions/:id', questionController.getQuestionById);

// Route to update a question by ID
router.put('/questions/:id', questionController.updateQuestion);

// Route to delete a question by ID
router.delete('/questions/:id', questionController.deleteQuestion);

module.exports = router;
