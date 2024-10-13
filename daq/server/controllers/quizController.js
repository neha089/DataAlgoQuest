const HttpError = require('../models/http-error');
const Quiz = require('../models/Quiz');
const { validationResult } = require('express-validator');
const QuizAttempt=require('../models/quizAttempt');
const Progress=require('../models/progress');
const mongoose = require('mongoose');
const User=require('../models/User');
const getQuestionByQuizId=async (req, res, next) => {
  const { quizId } = req.params;

try {
    // Fetch the quiz by quizId and populate its associated questions
    const quiz = await Quiz.findById(quizId).populate('question');

    if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found' });
    }

    // Return the questions associated with the quiz
    res.json(quiz.question);
} catch (error) {
    res.status(500).json({ error: 'Failed to fetch questions for the quiz' });
}
}
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
    // Fetch the quiz along with its associated questions
    quiz = await Quiz.findById(quizId).populate('question');
    if (!quiz) {
      return next(new HttpError('Quiz not found.', 404));
    }
  } catch (err) {
    console.error("Error fetching quiz: ", err.message || err);
    return next(new HttpError('Something went wrong, could not retrieve the quiz.', 500));
  }

  try {
    // Delete each question associated with the quiz
    const questions = quiz.question;
    for (const question of questions) {
      const deletedQuestion = await Question.findByIdAndDelete(question._id);
      if (!deletedQuestion) {
        console.error(`Error: Question with ID ${question._id} not found.`);
        return next(new HttpError('Failed to delete some questions.', 500));
      }
      console.log(`Question with ID ${question._id} deleted.`);
    }
  } catch (err) {
    console.error("Error deleting questions: ", err.message || err);
    return next(new HttpError('Something went wrong, could not delete related questions.', 500));
  }

  try {
    // Delete the quiz itself
    const deletedQuiz = await Quiz.findByIdAndDelete(quizId);
    if (!deletedQuiz) {
      console.error(`Error: Quiz with ID ${quizId} not found.`);
      return next(new HttpError('Quiz not found when trying to delete.', 404));
    }
    res.status(200).json({ message: 'Quiz and related questions deleted successfully.' });
  } catch (err) {
    console.error("Error deleting quiz: ", err.message || err);
    return next(new HttpError('Something went wrong, could not delete quiz.', 500));
  }
};




//get all quiz by ds_id
const getQuizzesByDataStructureId = async (req, res, next) => {
  const { data_structure_id } = req.params;

  let quizzes;
  try {
    quizzes = await Quiz.find({ data_structure_id })
      .populate('question')
      .populate('data_structure_id');
  } catch (err) {
    const error = new HttpError('Fetching quizzes failed, please try again later.', 500);
    return next(error);
  }
  const totalQuizzes = quizzes.length;
  res.json({ totalQuizzes,quizzes: quizzes.map(quiz => quiz.toObject({ getters: true })) });
};

// Submit a quiz attempt
const submitQuiz = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  console.log('Request body:', req.body);  // Log the received request body

  try {
    const { quiz_id, user_id, answers } = req.body;

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(quiz_id)) {
      return res.status(400).json({ message: 'Invalid quiz ID format' });
    }
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ message: 'Answers field is required and should be an object' });
    }

    // Fetch quiz
    const quiz = await Quiz.findById(quiz_id).populate('question').exec();
    if (!quiz) {
      console.log('Quiz not found');
      return res.status(404).json({ message: 'Quiz not found' });
    }
    console.log('Quiz fetched:', quiz);  // Log fetched quiz details

    // Fetch user and progress
    let user = await User.findById(user_id).populate('progress');
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('User fetched:', user);  // Log fetched user details

    // Initialize progress if not exists
    if (!user.progress) {
      console.log('Creating new progress for user');
      const newProgress = new Progress({
        quiz_scores: 0,
        challenge_scores: 0,
      });
      await newProgress.save();

      user.progress = newProgress._id;
      await user.save();
      user = await User.findById(user_id).populate('progress');  // Re-fetch user with progress
    }
    console.log('User progress:', user.progress);  // Log user's progress

    // Calculate score
    let score = 0;
    quiz.question.forEach((question, index) => {
      const questionId = question._id.toString();
      const userAnswer = answers[index];
      console.log(`Question ID: ${questionId}, User answer: ${userAnswer}, Correct answer: ${question.correct_answer}`);

      if (userAnswer && userAnswer.trim().toLowerCase() === question.correct_answer.trim().toLowerCase()) {
        score += 1;
      }
    });
    console.log('Calculated score:', score);  // Log calculated score

    // Check for existing quiz attempt
    const existingAttempt = await QuizAttempt.findOne({ user_id, quiz_id });
    if (existingAttempt) {
      console.log('Existing attempt found, updating...');
      existingAttempt.current_score = score;
      if (score > existingAttempt.highest_score) {
        existingAttempt.highest_score = score;
      }
      existingAttempt.updated_at = Date.now();
      await existingAttempt.save();

      user.progress.quiz_scores += existingAttempt.highest_score;
      await user.progress.save();
      return res.status(200).json({
        message: 'Quiz resubmitted successfully',
        current_score: score,
        highest_score: existingAttempt.highest_score,
      });
    } else {
      console.log('No previous attempt, creating new attempt...');
      const newAttempt = new QuizAttempt({
        user_id,
        quiz_id,
        current_score: score,
        highest_score: score,
        completed_at: Date.now(),
        updated_at: Date.now(),
      });
      await newAttempt.save();

      user.progress.quiz_scores += score;
      await user.progress.save();

      return res.status(200).json({
        message: 'Quiz submitted successfully',
        current_score: score,
      });
    }

  } catch (error) {
    console.error('Error during quiz submission:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//solve specific ds quiz by user
const solveQuizDs = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  try {
      const user_id = req.params.userId;
      const data_structure_id = req.query.data_structure_id; // Get data structure ID from query parameters

      // Validate if the user_id is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(user_id)) {
          return res.status(400).json({ message: 'Invalid user ID format' });
      }

      // Validate if the data_structure_id is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(data_structure_id)) {
          return res.status(400).json({ message: 'Invalid data structure ID format' });
      }

      // Step 1: Find all quiz attempts where the user_id matches
      const quizAttempts = await QuizAttempt.find({ user_id });

      if (quizAttempts.length === 0) {
          return res.status(404).json({ message: 'No quiz attempts found for this user' });
      }

      // Step 2: Extract all unique quiz IDs from the quiz attempts
      const quizIds = quizAttempts.map(attempt => attempt.quiz_id);

      // Step 3: Use the quiz IDs to find the corresponding quizzes from the quizzes collection, 
      // and filter by the provided data structure ID
      const quizzes = await Quiz.find({ 
          _id: { $in: quizIds },
          data_structure_id // Ensure that the quizzes belong to the specific data structure
      });

      if (quizzes.length === 0) {
          return res.status(404).json({ message: 'No quizzes found for the provided quiz IDs and data structure' });
      }

      const solvedQuizzes = quizzes.map(quiz => {
          const attempt = quizAttempts.find(attempt => attempt.quiz_id.equals(quiz._id));
          if (attempt) {
              return {
                  quiz_id: quiz._id,
                  title: quiz.title,
                  highest_Score: attempt.highest_score,
                  completed_at: attempt.completed_at,
                  updated_at: attempt.updated_at
              };
          }
      }).filter(Boolean);
      
      const totalSolvedQuizzes = solvedQuizzes.length;

      // Step 4: Return the list of quizzes back to the client
      return res.status(200).json({ totalSolvedQuizzes, solvedQuizzes });
  } catch (error) {
      console.error('Error retrieving solved quizzes:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
  }
};

  //get all submitted or solved quizes
  const solveQuizAsync = async (req, res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        //const { user_id } = req.body; // Expecting user_id from query parameters
        const user_id=req.params.userId;

        // Validate if the user_id is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(user_id)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        // Step 1: Find all quiz attempts where the user_id matches
        const quizAttempts = await QuizAttempt.find({ user_id });

        if (quizAttempts.length === 0) {
            return res.status(404).json({ message: 'No quiz attempts found for this user' });
        }

        // Step 2: Extract all unique quiz IDs from the quiz attempts
        const quizIds = quizAttempts.map(attempt => attempt.quiz_id);

        // Step 3: Use the quiz IDs to find the corresponding quizzes from the quizzes collection
        const quizzes = await Quiz.find({ _id: { $in: quizIds } });

        if (quizzes.length === 0) {
            return res.status(404).json({ message: 'No quizzes found for the provided quiz IDs' });
        }
        const solvedQuizzes = quizzes.map(quiz => {
          const attempt = quizAttempts.find(attempt => attempt.quiz_id.equals(quiz._id));
          if(attempt){
            return{
              quiz_id: quiz._id,
              title: quiz.title,
              highest_Score: attempt.highest_score,
              completed_at: attempt.completed_at,
              updated_at: attempt.updated_at
            };
          }
        }).filter(Boolean);
        const totalSolvedQuizzes = solvedQuizzes.length;
        // Step 4: Return the list of quizzes back to the client
        return res.status(200).json({ totalSolvedQuizzes, solvedQuizzes });
    } catch (error) {
        console.error('Error retrieving solved quizzes:', error); // Better error visibility
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

//get quiz with highest score user
const getQuizWithHighestScoreUser = async (req, res,next) => {
  try {
    const quiz_id = req.params.quizId; // Get quizId from URL parameters

    // Validate quizId
    if (!mongoose.Types.ObjectId.isValid(quiz_id)) {
      return res.status(400).json({ message: 'Invalid quiz ID format' });
    }

    // Step 1: Find all attempts for the given quiz ID
    const attempts = await QuizAttempt.find({ quiz_id}).populate('user_id');

    if (attempts.length === 0) {
      return res.status(404).json({ message: 'No attempts found for this quiz' });
    }

    // Step 2: Determine the highest score
    const highestScore = Math.max(...attempts.map(attempt => attempt.highest_score));

    // Step 3: Find the user(s) with the highest score
    const topAttempts = attempts.filter(attempt => attempt.highest_score === highestScore);

    // Step 4: Get quiz details
    const quiz = await Quiz.findById(quiz_id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Step 5: Prepare response data
    const response = {
      quiz_id: quiz._id,
      title: quiz.title,
      highest_score: highestScore,
      users: topAttempts.map(attempt => ({
        user_id: attempt.user_id._id,
        name: attempt.user_id.name,
        email: attempt.user_id.email
      }))
    };

    // Step 6: Return the response
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getQuizWithLowestScoreUser = async (req, res) => {
  try {
    const { quizId } = req.params; // Get quizId from URL parameters
    console.log("Received quizId:", quizId);

    // Validate quizId
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      console.error("Invalid quiz ID format:", quizId);
      return res.status(400).json({ message: 'Invalid quiz ID format' });
    }

    // Step 1: Find all attempts for the given quiz ID
    const attempts = await QuizAttempt.find({ quiz_id: quizId }).populate('user_id');
    console.log("Quiz attempts found:", attempts.length);

    if (attempts.length === 0) {
      return res.status(404).json({ message: 'No attempts found for this quiz' });
    }

    // Step 2: Determine the lowest score
    const lowestScore = Math.min(...attempts.map(attempt => attempt.highest_score));
    console.log("Lowest score:", lowestScore);

    // Step 3: Find the users with the lowest score
    const bottomAttempts = attempts.filter(attempt => attempt.highest_score === lowestScore);
    console.log("Users with lowest score:", bottomAttempts.length);

    // Step 4: Get quiz details
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Step 5: Prepare response data
    const response = {
      quiz_id: quiz._id,
      title: quiz.title,
      lowest_score: lowestScore,
      users: bottomAttempts.map(attempt => ({
        user_id: attempt.user_id._id,
        name: attempt.user_id.name,
        email: attempt.user_id.email
      }))
    };

    // Step 6: Return the response
    return res.status(200).json(response);
  } catch (error) {
    console.error('Error retrieving quiz details:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  getQuizzesByDataStructureId,
  submitQuiz,
  solveQuizDs,
  solveQuizAsync,
  getQuizWithHighestScoreUser,
  getQuizWithLowestScoreUser,
  getQuestionByQuizId
};
