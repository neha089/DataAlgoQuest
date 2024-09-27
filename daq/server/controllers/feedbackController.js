const Feedback = require('../models/Feedback');
const { validationResult } = require('express-validator');

// Submit feedback or review
exports.submitFeedback = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { user_id, bug, feedback } = req.body;
    const newFeedback = new Feedback({ user_id, bug, feedback });
    await newFeedback.save();

    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

