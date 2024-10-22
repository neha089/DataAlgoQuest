const HttpError = require('../models/http-error');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// Create a new user
const createUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return next(new HttpError('Signing up failed, please try again later.', 500));
  }

  if (existingUser) {
    return next(new HttpError('User exists already, please login instead.', 422));
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return next(new HttpError('Could not create user, please try again.', 500));
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  try {
    await createdUser.save();
  } catch (err) {
    return next(new HttpError('Creating user failed, please try again.', 500));
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

// Get all users
const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password').populate('progress');
  } catch (err) {
    return next(new HttpError('Fetching users failed, please try again later.', 500));
  }

  res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

// Get user by ID
const getUserById = async (req, res, next) => {
  const userId = req.params.id;

  let user;
  try {
    user = await User.findById(userId).populate('progress');
  } catch (err) {
    return next(new HttpError('Fetching user failed, please try again later.', 500));
  }

  if (!user) {
    return next(new HttpError('User not found.', 404));
  }

  res.json({ user: user.toObject({ getters: true }) });
};

// Update user by ID
const updateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { name, email, password } = req.body;
  const userId = req.params.id;

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    return next(new HttpError('Something went wrong, could not update user.', 500));
  }

  if (!user) {
    return next(new HttpError('User not found.', 404));
  }

  // If password is provided, hash it before saving
  if (password) {
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
      return next(new HttpError('Could not update user, please try again.', 500));
    }
    user.password = hashedPassword;
  }

  // Update user's name and email
  user.name = name;
  user.email = email;

  // Manually set updated_at to the current date
  user.updated_at = Date.now(); 

  try {
    await user.save(); // Save the updated user document
  } catch (err) {
    return next(new HttpError('Something went wrong, could not update user.', 500));
  }

  // Respond with the updated user data
  res.json({ user: user.toObject({ getters: true }) });
};

const Progress = require('../models/progress');
// Delete user by ID
const deleteUser = async (req, res, next) => {
  const userId = req.params.id;

  try {      
      // Find the user and populate the progress field
      const user = await User.findById(userId).populate('progress');
      if (!user) {
          return next(new HttpError('User not found.', 404));
      }

      // Remove the associated progress
      if (user.progress) {
          await Progress.findByIdAndDelete(user.progress._id);
      }

      // Now delete the user
      await User.findByIdAndDelete(userId);

      res.status(200).json({ message: 'User and associated progress deleted.' });
  } catch (err) {
      return next(new HttpError('Something went wrong, could not delete user and progress.', 500));
  }
};


module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
