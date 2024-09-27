import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // useNavigate instead of useHistory
import './AdminQuizzes.css'; // Link your CSS for styles

const AdminQuizzes = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [quizTitle, setQuizTitle] = useState('');
    const [editingQuizId, setEditingQuizId] = useState(null);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate(); // Updated to useNavigate

    // Fetch all quizzes
    useEffect(() => {
        axios.get('http://localhost:5000/api/quizzes')
            .then(response => {
                if (response.data.quizzes && Array.isArray(response.data.quizzes)) {
                    setQuizzes(response.data.quizzes);
                } else {
                    console.error('Fetched data is not an array:', response.data);
                }
            })
            .catch(error => console.error('Error fetching quizzes:', error));
    }, []);

    // Handle add or update quiz
    const handleQuizSubmit = (e) => {
        e.preventDefault();
        const quizData = { title: quizTitle };

        if (editingQuizId) {
            axios.put(`http://localhost:5000/api/quizzes/${editingQuizId}`, quizData)
                .then(response => {
                    const updatedQuizzes = quizzes.map(quiz => quiz._id === editingQuizId ? response.data : quiz);
                    setQuizzes(updatedQuizzes);
                    resetQuizForm();
                    setSuccessMessage('Quiz updated successfully!');
                })
                .catch(error => setError('Failed to update quiz.'));
        } else {
            axios.post('http://localhost:5000/api/quizzes', quizData)
                .then(response => {
                    setQuizzes([...quizzes, response.data]);
                    resetQuizForm();
                    setSuccessMessage('Quiz added successfully!');
                })
                .catch(error => setError('Failed to add quiz.'));
        }
    };

    const handleDeleteQuiz = (id) => {
        if (window.confirm('Are you sure you want to delete this quiz?')) {
            axios.delete(`http://localhost:5000/api/quizzes/${id}`)
                .then(() => {
                    setQuizzes(quizzes.filter(quiz => quiz._id !== id));
                    setSuccessMessage('Quiz deleted successfully.');
                })
                .catch(error => setError('Failed to delete quiz.'));
        }
    };

    // Handle edit quiz
    const handleEditQuiz = (quiz) => {
        setQuizTitle(quiz.title);
        setEditingQuizId(quiz._id);
    };

    // Reset quiz form
    const resetQuizForm = () => {
        setQuizTitle('');
        setEditingQuizId(null);
        setError(null);
        setSuccessMessage(null);
    };

    // Redirect to AdminQuestions with the selected quiz ID
    const handleViewQuestions = (quizId) => {
        navigate(`/admin/quizzes/question/${quizId}`); // Updated to use navigate
    };

    return (
        <div className="admin-quizzes">
            <h2>Manage Quizzes</h2>
            
            {/* Show error and success messages */}
            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            
            {/* Add/Edit Quiz Form */}
            <form className="quiz-form" onSubmit={handleQuizSubmit}>
                <input
                    type="text"
                    placeholder="Quiz Title"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    required
                />
                <button type="submit" className="btn-primary">
                    {editingQuizId ? 'Update Quiz' : 'Add Quiz'}
                </button>
                {editingQuizId && <button type="button" className="btn-secondary" onClick={resetQuizForm}>Cancel</button>}
            </form>

            {/* List of Quizzes */}
            <ul className="quiz-list">
                {quizzes.map(quiz => (
                    <li key={quiz._id}>
                        <strong>{quiz.title}</strong>
                        <div className="quiz-actions">
                            <button className="btn-view" onClick={() => handleViewQuestions(quiz._id)}>
                                View Questions
                            </button>
                            <button className="btn-edit" onClick={() => handleEditQuiz(quiz)}>Edit</button>
                            <button className="btn-delete" onClick={() => handleDeleteQuiz(quiz._id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminQuizzes;
