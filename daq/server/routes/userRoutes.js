const express = require('express');
const { check } = require('express-validator');
const userController = require('../controllers/userController');
const HttpError = require('../models/http-error');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  console.log('Login attempt:', email);

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ message: 'Login failed, please try again later.' });
  }

  if (!existingUser) {
    console.log('User not found');
    return res.status(404).json({ message: 'Email not found' });
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    console.error('Password check error:', err);
    return res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }

  if (!isValidPassword) {
    console.log('Invalid password');
    return res.status(401).json({ message: 'Invalid password' });
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  } catch (err) {
    return res.status(500).json({ message: 'Login failed, please try again later.' });
  }

  console.log('Login successful:', email);
  res.json({ userId: existingUser.id, email: existingUser.email, token });
});


module.exports = router;
