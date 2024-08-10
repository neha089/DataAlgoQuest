const express = require('express');
const { body } = require('express-validator');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Validation rules
const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

const loginValidation = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/register', registerValidation, adminController.register);
router.post('/login', loginValidation, adminController.login);
router.get('/users', authMiddleware, adminController.getUsers); // Admin only
router.delete('/users/:id', authMiddleware, adminController.deleteUser); // Admin only
router.get('/feedbacks', authMiddleware, adminController.getFeedbacks); // Admin only

module.exports = router;
