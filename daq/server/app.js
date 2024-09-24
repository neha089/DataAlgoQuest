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
app.use('/api/users/profile', profileRoutes);
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
