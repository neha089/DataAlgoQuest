const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const MongoStore = require('connect-mongo');

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Session Management
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Import Routes
const userRoutes = require('./routes/userRoutes');
// const adminRoutes = require('./routes/adminRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const dataStructureRoutes = require('./routes/dataStructureRoutes');
const noteRoutes = require('./routes/noteRoutes');
const quizRoutes = require('./routes/quizRoutes');
const challengeRoutes = require('./routes/codingChallengeRoutes');
const profileRoutes = require('./routes/profileRoutes');
const questionRoutes = require('./routes/questionRoutes');
const HttpError = require("./models/http-error");

// Use Routes
app.use('/api/users', userRoutes);
// app.use('/api/admin', adminRoutes); // Ensure this is the correct path
app.use('/api/feedback', feedbackRoutes);
app.use('/api/datastructures', dataStructureRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/question', questionRoutes);
const Note = require('./models/Note'); // Adjust path as needed

app.patch('/api/notes/:noteId', async (req, res) => {
    const { noteId } = req.params;
    const { content } = req.body;

    try {
        const updatedNote = await Note.findByIdAndUpdate(
            noteId,
            { content },
            { new: true }
        );

        if (!updatedNote) {
            return res.status(404).json({ error: 'Note not found' });
        }

        res.json(updatedNote);
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ error: 'Failed to update note' });
    }
});
// app.use((req, res, next) => {
//   const error = new HttpError("Could not find this route.", 404);
//   throw error;
// });
const User = require('./models/User');
const ChallengeAttempt = require('./models/ChallengeAttempt');
const QuizAttempt = require('./models/quizAttempt');
app.get('/api/user/profile/:userId', async (req, res) => {
  user_id=req.params.userId;
  try {
      const user = await User.findById(user_id).populate('progress');
      const quizAttempts = await QuizAttempt.find({ user_id: user_id });
      const challengeAttempts = await ChallengeAttempt.find({ user_id: user_id });
      res.json({ user, quizAttempts, challengeAttempts });
  } catch (error) {
      res.status(500).send("Server Error");
  }
});


app.get('/api/attempts-per-day/:user_id', async (req, res) => {
  try {
    const userId = req.params.user_id; // Get user ID from request params
    // Convert userId to ObjectId before using it in the aggregation
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Aggregate Quiz Attempts per day
    const quizAttempts = await QuizAttempt.aggregate([
      { $match: { user_id: userObjectId } }, // match attempts by user
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$updated_at" } },
          count: { $sum: 1 }
        }
      }
    ]);

    // Aggregate Challenge Attempts per day
    const challengeAttempts = await ChallengeAttempt.aggregate([
      { $match: { user_id: userObjectId } }, // match attempts by user
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$completed_at" } },
          count: { $sum: 1 }
        }
      }
    ]);

    // Combine results
    const attemptsPerDay = {};

    quizAttempts.forEach((attempt) => {
      const date = attempt._id;
      if (!attemptsPerDay[date]) attemptsPerDay[date] = 0;
      attemptsPerDay[date] += attempt.count;
    });

    challengeAttempts.forEach((attempt) => {
      const date = attempt._id;
      if (!attemptsPerDay[date]) attemptsPerDay[date] = 0;
      attemptsPerDay[date] += attempt.count;
    });

    res.json({ attemptsPerDay });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/api/user-progress/:user_id', async (req, res) => {
  try {
    const userId = req.params.user_id;
    const user = await User.findById(userId).populate('progress');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user.progress);  // Send progress data
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
