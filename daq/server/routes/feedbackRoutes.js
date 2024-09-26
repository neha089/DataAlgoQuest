const express = require('express');
const { body } = require('express-validator');
const feedbackController = require('../controllers/feedbackController');
const router = express.Router();

// Validation rules
const feedbackValidation = [
  body('user_id').notEmpty().withMessage('User ID is required'),
  body('bug').optional().isString().withMessage('Bug description must be a string'),
  body('feedback').isInt({ min: 1, max: 5 }).withMessage('Feedback must be between 1 and 5')
];

// Routes
router.post('/', feedbackValidation, feedbackController.submitFeedback);
router.get('/', feedbackController.getFeedbacks); 

module.exports = router;
