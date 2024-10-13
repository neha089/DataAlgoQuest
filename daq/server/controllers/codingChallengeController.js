const { validationResult } = require('express-validator');
const CodingChallenge = require('../models/CodingChallenge');

// Import your models
const ChallengeAttempt = require('../models/ChallengeAttempt'); // Adjust the path if necessary
const Progress = require('../models/progress'); // Adjust the path if necessary
const User = require('../models/User');
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
    const challenges = await CodingChallenge.find().populate('note');
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

    const challenges = await CodingChallenge.find({ data_structure_id }).populate({ path: 'note', select: 'content' });
    if (challenges.length === 0) {
      return res.status(404).json({ message: 'No challenges found for this data structure' });
    }
    const totalChallenges = challenges.length;
    res.json({totalChallenges,challenges});
  } catch (error) {
    console.error('Error retrieving challenges for data structure:', error); // Log error
    res.status(500).json({ message: 'Server error' });
  }
};
// Submit a challenge attempt
exports.submitChallenge = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { challenge_id, user_id, solved } = req.body; 

    // Log input data
    console.log('Request received:', { challenge_id, user_id });

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(challenge_id)) {
      console.error('Invalid challenge ID format:', challenge_id);
      return res.status(400).json({ message: 'Invalid challenge ID format' });
    }
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      console.error('Invalid user ID format:', user_id);
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const challenge = await CodingChallenge.findById(challenge_id);
    if (!challenge) {
      console.error(`Challenge not found for ID: ${challenge_id}`);
      return res.status(404).json({ message: 'Challenge not found' });
    }

    let user = await User.findById(user_id).populate({
      path: 'progress',
      model: 'Progress', // Ensure it's referencing the correct model
    });
    if (!user) {
      console.error(`User not found for ID: ${user_id}`);
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
      console.log('New progress created for user:', user_id);
    }

    // Determine score based on challenge difficulty
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
        console.error(`Unknown challenge level: ${challenge.level}`);
        return res.status(400).json({ message: 'Unknown challenge level' });
    }

    user.progress.challenge_scores += score;
    await user.progress.save();

    // Find or create the challenge attempt for the user
    let attempt = await ChallengeAttempt.findOne({ challenge_id, user_id });

    if (!attempt) {
      attempt = new ChallengeAttempt({
        challenge_id,
        user_id,
        solved,
        score, // Include score in the new attempt
        completed_at: Date.now(),
      });
    } else {
      // Update the existing attempt's solved status and score
      attempt.solved = solved;
      attempt.score = score;
      attempt.completed_at = Date.now(); // Update timestamp for attempt completion
    }

    await attempt.save(); // Save the attempt

    res.status(201).json({ message: 'Challenge submitted successfully', score });
  } catch (error) {
    console.error('Error submitting challenge:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


  exports.solveChallengesAsync = async (req, res) => {
    const errors = validationResult(req);
    const { user_id } =req.query; 
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    try {
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
      if (challenges.length === 0) {
        return res.status(404).json({ message: 'No challenges found for the provided challenge IDs' });
      }

      // Step 4: Count the number of solved challenges
      const totalSolvedChallenges = challenges.length;

      // Step 5: Return the list of challenges back to the client
      return res.status(200).json({  totalSolvedChallenges,solvedChallenges: challenges });
    } catch (error) {
      console.error('Error retrieving solved challenges:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  //get all challenges for specific ds and which is solved by user
  exports.solveChallengesDs = async (req, res) => { 
    const errors = validationResult(req);
    const { user_id, data_structure_id } = req.query; // Get data_structure_id from query parameters
    
    // Validate if any errors exist
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Validate user_id and data_structure_id are valid ObjectIds
      if (!mongoose.Types.ObjectId.isValid(user_id)) {
        return res.status(400).json({ message: 'Invalid user ID format' });
      }
      if (!mongoose.Types.ObjectId.isValid(data_structure_id)) {
        return res.status(400).json({ message: 'Invalid data structure ID format' });
      }

      // Step 1: Find all challenge attempts where user_id matches and the challenge is solved
      const challengeAttempts = await ChallengeAttempt.find({ 
        user_id, 
        solved: true,
      });

      // Step 2: Extract all unique challenge IDs from the challenge attempts
      const challengeIds = challengeAttempts.map(attempt => attempt.challenge_id);

      // Step 3: Use the challenge IDs to find the corresponding challenges from the CodingChallenge collection
      const challenges = await CodingChallenge.find({ 
        _id: { $in: challengeIds }, 
        data_structure_id // Ensure the challenges are filtered by data_structure_id
      });

      if (challenges.length === 0) {
        return res.status(404).json({ message: 'No challenges found for the provided data structure ID' });
      }

      // Step 4: Count the number of solved challenges
      const totalSolvedChallenges = challenges.length;

      // Step 5: Return the list of challenges back to the client
      return res.status(200).json({ totalSolvedChallenges, solvedChallenges: challenges });
      
    } catch (error) {
      console.error('Error retrieving solved challenges:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
};


  exports.RemoveChallengeAttempt =  async (req, res) => {
    const { challenge_id, user_id } = req.params; // Get the challenge_id and user_id from the request body
    try {
        // Validate inputs
        if (!challenge_id || !user_id) {
            return res.status(400).json({ message: 'Challenge ID and User ID are required' });
        }
        if (!mongoose.Types.ObjectId.isValid(challenge_id)) {
          return res.status(400).send('Invalid challenge ID');
        }
        // Remove the challenge attempt
        const result = await ChallengeAttempt.deleteOne({ challenge_id, user_id });
        // Check if any documents were deleted
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Challenge attempt not found' });
        }

        res.status(200).json({ message: 'Challenge attempt removed successfully' });
    } catch (error) {
        console.error('Error removing challenge attempt:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

  