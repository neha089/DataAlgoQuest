const HttpError = require('../models/http-error');
const Quiz = require('../models/Quiz');
const { validationResult } = require('express-validator');

// Create a new quiz
const createQuiz = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { title, question, data_structure_id } = req.body;

  const newQuiz = new Quiz({
    title,
    question,
    data_structure_id,
  });

  try {
    await newQuiz.save();
  } catch (err) {
    const error = new HttpError('Creating quiz failed, please try again.', 500);
    return next(error);
  }

  res.status(201).json({ quiz: newQuiz.toObject({ getters: true }) });
};

// Get all quizzes
const getAllQuizzes = async (req, res, next) => {
  let quizzes;
  try {
    quizzes = await Quiz.find().populate('question').populate('data_structure_id');
  } catch (err) {
    const error = new HttpError('Fetching quizzes failed, please try again later.', 500);
    return next(error);
  }

  res.json({ quizzes: quizzes.map(quiz => quiz.toObject({ getters: true })) });
};

// Get quiz by ID
const getQuizById = async (req, res, next) => {
  const quizId = req.params.id;

  let quiz;
  try {
    quiz = await Quiz.findById(quizId).populate('question').populate('data_structure_id');
  } catch (err) {
    const error = new HttpError('Fetching quiz failed, please try again later.', 500);
    return next(error);
  }

  if (!quiz) {
    const error = new HttpError('Quiz not found.', 404);
    return next(error);
  }

  res.json({ quiz: quiz.toObject({ getters: true }) });
};

// Update quiz
const updateQuiz = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { title, question, data_structure_id } = req.body;
  const quizId = req.params.id;

  let quiz;
  try {
    quiz = await Quiz.findById(quizId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update quiz.', 500);
    return next(error);
  }

  if (!quiz) {
    const error = new HttpError('Quiz not found.', 404);
    return next(error);
  }

  quiz.title = title;
  quiz.question = question;
  quiz.data_structure_id = data_structure_id;

  try {
    await quiz.save();
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update quiz.', 500);
    return next(error);
  }

  res.json({ quiz: quiz.toObject({ getters: true }) });
};

// Delete quiz
const deleteQuiz = async (req, res, next) => {
  const quizId = req.params.id;

  let quiz;
  try {
    quiz = await Quiz.findById(quizId).populate('question').populate('data_structure_id');
  } catch (err) {
    const error = new HttpError('Something went wrong, could not delete quiz.', 500);
    return next(error);
  }

  if (!quiz) {
    const error = new HttpError('Quiz not found.', 404);
    return next(error);
  }

  try {
    await quiz.remove();
  } catch (err) {
    const error = new HttpError('Something went wrong, could not delete quiz.', 500);
    return next(error);
  }

  res.status(200).json({ message: 'Quiz deleted.' });
};

module.exports = {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
};
