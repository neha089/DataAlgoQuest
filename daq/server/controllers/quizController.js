const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const { validationResult } = require('express-validator');

// Create a new quiz
exports.createQuiz = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, data_structure_id, questions } = req.body;
    const newQuiz = new Quiz({ title, data_structure_id, questions });
    await newQuiz.save();
    res.status(201).json({ message: 'Quiz created successfully', quiz: newQuiz });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a quiz by ID
exports.updateQuiz = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { title, data_structure_id, questions } = req.body;

    const updatedQuiz = await Quiz.findByIdAndUpdate(id, { title, data_structure_id, questions }, { new: true });

    if (!updatedQuiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json({ message: 'Quiz updated successfully', quiz: updatedQuiz });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a quiz by ID
exports.deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuiz = await Quiz.findByIdAndDelete(id);

    if (!deletedQuiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a question to a quiz
exports.addQuestion = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { quiz_id } = req.params;
    const { question, options, correct_answer } = req.body;

    const quiz = await Quiz.findById(quiz_id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const newQuestion = new Question({ question, options, correct_answer });
    await newQuestion.save();

    quiz.questions.push(newQuestion._id);
    await quiz.save();

    res.status(201).json({ message: 'Question added successfully', question: newQuestion });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a question by ID
exports.updateQuestion = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { question, options, correct_answer } = req.body;

    const updatedQuestion = await Question.findByIdAndUpdate(id, { question, options, correct_answer }, { new: true });

    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json({ message: 'Question updated successfully', question: updatedQuestion });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a question by ID
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuestion = await Question.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Remove the deleted question from any quizzes
    await Quiz.updateMany({ questions: id }, { $pull: { questions: id } });

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Existing methods
exports.getQuizzes = async (req, res) => {
  try {
    const { data_structure_id } = req.params;
    const quizzes = await Quiz.find({ data_structure_id });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.submitQuiz = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { quiz_id, score } = req.body;
    const userId = req.user.id; // Assuming user ID is attached to req.user

    // Handle quiz submission logic here (e.g., store the score)

    res.status(201).json({ message: 'Quiz submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getQuizScores = async (req, res) => {
  try {
    const userId = req.user.id;
    // Fetch quiz scores for the logged-in user

    res.json({ /* Quiz scores */ });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
