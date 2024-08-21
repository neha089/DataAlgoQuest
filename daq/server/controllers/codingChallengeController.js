const { validationResult } = require('express-validator');

// Import your models
const User = require('../models/User'); // Adjust the path if necessary
const CodingChallenge = require('../models/codingChallenge'); // Adjust the path if necessary
const ChallengeAttempt = require('../models/challengeAttempt'); // Adjust the path if necessary
const Progress = require('../models/progress'); // Adjust the path if necessary

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
exports.getChallenge_with_ds = async (req, res) => {
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
    const { challenge_id, user_id } = req.body; // User ID will come from body

    // Validate if the challenge_id and user_id are valid ObjectIds
    if (!mongoose.Types.ObjectId.isValid(challenge_id)) {
      return res.status(400).json({ message: 'Invalid challenge ID format' });
    }
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    // Fetch the challenge to determine its difficulty
    const challenge = await CodingChallenge.findById(challenge_id);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    // Fetch the user and their progress
    let user = await User.findById(user_id).populate('progress');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if progress exists; if not, create a new Progress object
    if (!user.progress) {
      const newProgress = new Progress({
        quiz_scores: 0,
        challenge_scores: 0,
      });
      await newProgress.save();

      user.progress = newProgress._id;
      await user.save();

      user = await User.findById(user_id).populate('progress'); // Re-fetch user with new progress populated
    }

    // Determine the score based on the difficulty
    let score = 0;
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

    // Update challenge_scores in user's progress
    user.progress.challenge_scores += score;
    await user.progress.save();

    // Create a new challenge attempt
    const newAttempt = new ChallengeAttempt({
      user_id: user_id,
      challenge_id: challenge_id,
      score: score,
      solved: true,
      completed_at: Date.now(), // Fixed typo from Date to date
    });

    await newAttempt.save();
    res.status(201).json({ message: 'Challenge submitted successfully', score });
  } catch (error) {
    console.error('Error submitting challenge:', error); // Log error
    res.status(500).json({ message: 'Server error' });
  }};
  exports.solveChallengesAsync = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    try {
      const { user_id } = req.body; // User ID will come from body
  
      // Validate if the user_id is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(user_id)) {
        return res.status(400).json({ message: 'Invalid user ID format' });
      }
  
      // Step 1: Find all challenge attempts where the user_id matches and the challenge is solved
      const challengeAttempts = await ChallengeAttempt.find({ user_id, solved: true });
  
      // Step 2: Extract all unique challenge IDs from the challenge attempts
      const challengeIds = challengeAttempts.map(attempt => attempt.challenge_id);
  
      // Step 3: Use the challenge IDs to find the corresponding challenges from the CodingChallenge collection
      const challenges = await CodingChallenge.find({ _id: { $in: challengeIds } });
  
      // Step 4: Return the list of challenges back to the client
      return res.status(200).json({ solvedChallenges: challenges });
    } catch (error) {
      console.error('Error retrieving solved challenges:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  