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

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return next(new HttpError('Login failed, please try again later.', 500));
  }

  if (!existingUser) {
    return next(new HttpError('Invalid credentials, could not log you in.', 403));
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    return next(new HttpError('Could not log you in, please check your credentials and try again.', 500));
  }

  if (!isValidPassword) {
    return next(new HttpError('Invalid credentials, could not log you in.', 403));
  }

  // Create a JWT token
  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  } catch (err) {
    return next(new HttpError('Login failed, please try again later.', 500));
  }

  res.json({ userId: existingUser.id, email: existingUser.email, token });
});


module.exports = router;
