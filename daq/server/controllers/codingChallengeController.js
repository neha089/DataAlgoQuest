const CodingChallenge = require('../models/CodingChallenge');
const { validationResult } = require('express-validator');
const ChallengeAttempt = require('../models/ChallengeAttempt'); // Ensure you have this model
// const User = require('../models/User'); // Ensure you have this model if needed

// Create a new coding challenge
exports.createChallenge = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, problem_statement, link, level, data_structure_id, revision } = req.body;
    const newChallenge = new CodingChallenge({ title, problem_statement, link, level, data_structure_id, revision });
    await newChallenge.save();
    res.status(201).json({ message: 'Challenge created successfully', challenge: newChallenge });
  } catch (error) {
    console.error('Error creating challenge:', error); // Log error
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
    console.error('Error updating challenge:', error); // Log error
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
    console.error('Error deleting challenge:', error); // Log error
    res.status(500).json({ message: 'Server error' });
  }
};

const mongoose = require('mongoose');

// Find a coding challenge by ID
exports.getChallengeById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const challenge = await CodingChallenge.findById(id);

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    res.json(challenge);
  } catch (error) {
    console.error('Error retrieving challenge:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// Find a coding challenge by title
exports.getChallengeByTitle = async (req, res) => {
  try {
    const { title } = req.params;
    const challenge = await CodingChallenge.findOne({ title: new RegExp(title, 'i') });

    if (!challenge) {
      return res.status(404).json({ message: 'No challenge found' });
    }

    res.json(challenge);
  } catch (error) {
    console.error('Error retrieving challenge by title:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all coding challenges
exports.getChallenge = async (req, res) => {
  try {
    const challenges = await CodingChallenge.find();
    if (challenges.length === 0) {
      return res.status(404).json({ message: 'No challenges found' });
    }
    res.json(challenges);
  } catch (error) {
    console.error('Error retrieving challenges:', error);
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
    console.error('Error retrieving revision challenges:', error); // Log error
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all coding challenges for a specific data structure
// Get all coding challenges for a specific data structure
exports.getChallenges = async (req, res) => {
  try {
    const { data_structure_id } = req.params;

    // Validate if the data_structure_id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(data_structure_id)) {
      return res.status(400).json({ message: 'Invalid data structure ID format' });
    }

    const challenges = await CodingChallenge.find({ data_structure_id });

    if (challenges.length === 0) {
      return res.status(404).json({ message: 'No challenges found for this data structure' });
    }

    res.json(challenges);
  } catch (error) {
    console.error('Error retrieving challenges for data structure:', error); // Log error
    res.status(500).json({ message: 'Server error' });
  }
};

// Submit a challenge attempt
exports.submitChallenge = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { challenge_id } = req.body;
    const userId = req.user.id; // Assuming user ID is attached to req.user

    // Validate if the challenge_id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(challenge_id)) {
      return res.status(400).json({ message: 'Invalid challenge ID format' });
    }

    // Fetch the challenge to determine its difficulty
    const challenge = await CodingChallenge.findById(challenge_id);

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    // Determine the score based on the difficulty
    let score;
    switch (challenge.level.toLowerCase()) {
      case 'hard':
        score = 10;
        break;
      case 'medium':
        score = 7;
        break;
      case 'easy':
        score = 5;
        break;
      default:
        score = 0; // Default score if difficulty is not recognized
        break;
    }

    // Create a new challenge attempt
    const newAttempt = new ChallengeAttempt({
      user_id: userId,
      challenge: challenge_id,
      score,
      solved: false,
    });

    await newAttempt.save();
    res.status(201).json({ message: 'Challenge submitted successfully', score });
  } catch (error) {
    console.error('Error submitting challenge:', error); // Log error
    res.status(500).json({ message: 'Server error' });
  }
};


