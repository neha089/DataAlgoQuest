import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const AdminQuestions = () => {
    const { quizId } = useParams(); // Get quizId from the route params
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState({ question: '', options: ['', '', '', ''], correct_answer: '' });
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();

    // Fetch all questions for the selected quiz
    useEffect(() => {
        axios.get(`http://localhost:5000/api/quizzes/question/${quizId}`)
            .then(response => {
                if (Array.isArray(response.data)) {
                    setQuestions(response.data);
                } else {
                    console.error('Fetched data is not an array:', response.data);
                }
            })
            .catch(error => console.error('Error fetching questions:', error));
    }, [quizId]);

    // Handle add or update question
    // Handle add or update question
const handleQuestionSubmit = (e) => {
    e.preventDefault();
    const questionData = { ...newQuestion, quizId }; // Include quizId in the question data

    if (newQuestion._id) {
        // If updating a question
        axios.put(`http://localhost:5000/api/question/questions/${newQuestion._id}`, questionData)
            .then(response => {
                const updatedQuestions = questions.map(q => q._id === newQuestion._id ? response.data.data : q);
                setQuestions(updatedQuestions);
                resetQuestionForm();
                setSuccessMessage('Question updated successfully!');
            })
            .catch(error => setError('Failed to update question.'));
    } else {
        // If adding a new question
        axios.post('http://localhost:5000/api/question/questions', questionData)
            .then(response => {
                setQuestions([...questions, response.data.data]);
                resetQuestionForm();
                setSuccessMessage('Question added successfully!');
            })
            .catch(error => setError('Failed to add question.'));
    }
};


    // Handle delete question with confirmation
    const handleDeleteQuestion = (id) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            axios.delete(`http://localhost:5000/api/question/questions/${id}`)
                .then(() => {
                    setQuestions(questions.filter(q => q._id !== id));
                    setSuccessMessage('Question deleted successfully.');
                })
                .catch(error => setError('Failed to delete question.'));
        }
    };

    // Handle edit question
    const handleEditQuestion = (question) => {
        setNewQuestion(question);
    };

    // Reset question form
    const resetQuestionForm = () => {
        setNewQuestion({ question: '', options: ['', '', '', ''], correct_answer: '' });
        setError(null);
        setSuccessMessage(null);
    };

    // Return to quiz list
    const goBackToQuizzes = () => {
        navigate('/admin/quizzes');
    };

    return (
        <div className="admin-questions">
            <h2>Manage Questions for Quiz</h2>

            {/* Show error and success messages */}
            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}

            <button onClick={goBackToQuizzes} className="btn-back">Back to Quizzes</button>

            {/* List of Questions */}
            <ul className="question-list">
                {questions.map(question => (
                    <li key={question._id}>
                        <strong>{question.question}</strong>
                        <ul className="options-list">
                            {question.options.map((option, index) => (
                                <li key={index}>{option}</li>
                            ))}
                        </ul>
                        <p>Correct Answer: {question.correct_answer}</p>
                        <div className="question-actions">
                            <button className="btn-edit" onClick={() => handleEditQuestion(question)}>Edit</button>
                            <button className="btn-delete" onClick={() => handleDeleteQuestion(question._id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Add/Edit Question Form */}
            <form className="question-form" onSubmit={handleQuestionSubmit}>
                <input
                    type="text"
                    placeholder="Question"
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                    required
                />
                {newQuestion.options.map((option, index) => (
                    <input
                        key={index}
                        type="text"
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => {
                            const updatedOptions = [...newQuestion.options];
                            updatedOptions[index] = e.target.value;
                            setNewQuestion({ ...newQuestion, options: updatedOptions });
                        }}
                        required
                    />
                ))}
                <input
                    type="text"
                    placeholder="Correct Answer"
                    value={newQuestion.correct_answer}
                    onChange={(e) => setNewQuestion({ ...newQuestion, correct_answer: e.target.value })}
                    required
                />
                <button type="submit" className="btn-primary">
                    {newQuestion._id ? 'Update Question' : 'Add Question'}
                </button>
                {newQuestion._id && <button type="button" className="btn-secondary" onClick={resetQuestionForm}>Cancel</button>}
            </form>
        </div>
    );
};

export default AdminQuestions;
