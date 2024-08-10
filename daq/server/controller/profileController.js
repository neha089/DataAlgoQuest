const User = require('../models/User');

// Get the logged-in user's progress on quizzes and coding challenges
exports.getProfileProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('progress');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// View the logged-in user's quiz scores and challenge completion status
exports.getProfileScores = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'progress',
      populate: [
        { path: 'quiz_scores', model: 'QuizAttempt' },
        { path: 'challenge_scores', model: 'ChallengeAttempt' }
      ]
    });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      quiz_scores: user.progress.quiz_scores,
      challenge_status: user.progress.challenge_scores
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
