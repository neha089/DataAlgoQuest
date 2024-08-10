const CodingChallenge = require('../models/CodingChallenge');
const { validationResult } = require('express-validator');

// Create a new coding challenge
exports.createChallenge = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, problem_statement, level, data_structure_id, revision } = req.body;
    const newChallenge = new CodingChallenge({ title, problem_statement, level, data_structure_id, revision });
    await newChallenge.save();
    res.status(201).json({ message: 'Challenge created successfully', challenge: newChallenge });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a coding challenge by ID
exports.updateChallenge = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { title, problem_statement, level, data_structure_id, revision } = req.body;

    const updatedChallenge = await CodingChallenge.findByIdAndUpdate(id, { title, problem_statement, level, data_structure_id, revision }, { new: true });

    if (!updatedChallenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    res.json({ message: 'Challenge updated successfully', challenge: updatedChallenge });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a coding challenge by ID
exports.deleteChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedChallenge = await CodingChallenge.findByIdAndDelete(id);

    if (!deletedChallenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    res.json({ message: 'Challenge deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Find a coding challenge by ID
exports.getChallengeById = async (req, res) => {
  try {
    const { id } = req.params;
    const challenge = await CodingChallenge.findById(id);

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    res.json(challenge);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Find coding challenges by name
exports.getChallengesByName = async (req, res) => {
  try {
    const { name } = req.query; // Assuming name is passed as a query parameter
    const challenges = await CodingChallenge.find({ title: new RegExp(name, 'i') });

    if (challenges.length === 0) {
      return res.status(404).json({ message: 'No challenges found' });
    }

    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all coding challenges where revision is true
exports.getChallengesForRevision = async (req, res) => {
  try {
    const challenges = await CodingChallenge.find({ revision: true });

    if (challenges.length === 0) {
      return res.status(404).json({ message: 'No revision challenges found' });
    }

    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Existing methods
exports.getChallenges = async (req, res) => {
  try {
    const { data_structure_id } = req.params;
    const challenges = await CodingChallenge.find({ data_structure_id });
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.submitChallenge = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { challenge_id, score } = req.body;
    const userId = req.user.id; // Assuming user ID is attached to req.user

    const newAttempt = new ChallengeAttempt({
      user_id: userId,
      challenge: challenge_id,
      score,
      solved: false,
    });

    await newAttempt.save();
    res.status(201).json({ message: 'Challenge submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getChallengeStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const attempts = await ChallengeAttempt.find({ user_id: userId, solved: true }).populate('challenge');

    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
