const Question = require('../models/Question');
const Quiz = require('../models/Quiz'); // Import Quiz model

// Insert a new question and add it to the corresponding quiz
exports.insertQuestion = async (req, res) => {
    try {
        const { question, options, correct_answer, quizId } = req.body; // Include quizId in the request
        const newQuestion = new Question({ question, options, correct_answer });
        await newQuestion.save();

        // Find the corresponding quiz and add the question ID to its questions array
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        
        quiz.question.push(newQuestion._id);
        await quiz.save();

        res.status(201).json({ message: 'Question created and added to quiz successfully', data: newQuestion });
    } catch (error) {
        res.status(500).json({ message: 'Error creating question', error: error.message });
    }
};

// Update an existing question and ensure it's updated in the corresponding quiz
exports.updateQuestion = async (req, res) => {
    try {
        const { question, options, correct_answer } = req.body;
        const updatedQuestion = await Question.findByIdAndUpdate(req.params.id, { question, options, correct_answer }, { new: true });

        if (!updatedQuestion) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.status(200).json({ message: 'Question updated successfully', data: updatedQuestion });
    } catch (error) {
        res.status(500).json({ message: 'Error updating question', error: error.message });
    }
};

// Delete a question and remove its ID from the corresponding quiz
exports.deleteQuestion = async (req, res) => {
    try {
        const question = await Question.findByIdAndDelete(req.params.id);

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Find the quiz that contains the question and remove the question ID from its questions array
        const quiz = await Quiz.findOne({ question: req.params.id });
        if (quiz) {
            quiz.question = quiz.question.filter(qId => qId.toString() !== req.params.id);
            await quiz.save();
        }

        res.status(200).json({ message: 'Question deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting question', error: error.message });
    }
};

// Get all questions for a specific quiz
exports.getQuestionsForQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId).populate('question');
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.status(200).json(quiz.question);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving questions', error: error.message });
    }
};
