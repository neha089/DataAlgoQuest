const express = require('express');
const { check } = require('express-validator');
const userController = require('../controllers/userController');

const router = express.Router();

// Create a new user
router.post(
  '/',
  [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 })
  ],
  userController.createUser
);

// Get all users
router.get('/', userController.getAllUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// Update user by ID
router.put(
  '/:id',
  [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').optional().isLength({ min: 6 })
  ],
  userController.updateUser
);

// Delete user by ID
router.delete('/:id', userController.deleteUser);

module.exports = router;
