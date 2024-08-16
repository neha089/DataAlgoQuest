const Question = require('../models/Question');

// Insert a new question
exports.insertQuestion = async (req, res) => {
    try {
        const { question, options, correct_answer } = req.body;
        const newQuestion = new Question({ question, options, correct_answer });
        await newQuestion.save();
        res.status(201).json({ message: 'Question created successfully', data: newQuestion });
    } catch (error) {
        res.status(500).json({ message: 'Error creating question', error: error.message });
    }
};

// Get all questions
exports.getQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving questions', error: error.message });
    }
};

// Get a single question by ID
exports.getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.status(200).json(question);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving question', error: error.message });
    }
};

// Update a question by ID
exports.updateQuestion = async (req, res) => {
    try {
        const { question, options, correct_answer } = req.body;
        const updatedQuestion = await Question.findByIdAndUpdate(
            req.params.id,
            { question, options, correct_answer },
            { new: true, runValidators: true }
        );
        if (!updatedQuestion) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.status(200).json({ message: 'Question updated successfully', data: updatedQuestion });
    } catch (error) {
        res.status(500).json({ message: 'Error updating question', error: error.message });
    }
};

// Delete a question by ID
exports.deleteQuestion = async (req, res) => {
    try {
        const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
        if (!deletedQuestion) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.status(200).json({ message: 'Question deleted successfully', data: deletedQuestion });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting question', error: error.message });
    }
};
