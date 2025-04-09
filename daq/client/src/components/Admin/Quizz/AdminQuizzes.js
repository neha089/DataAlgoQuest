import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminQuizzes.css';

const baseURL = process.env.REACT_APP_API_BASE_URL;

const AdminQuizzes = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [quizTitle, setQuizTitle] = useState('');
    const [editingQuizId, setEditingQuizId] = useState(null);
    const [dataStructures, setDataStructures] = useState([]);
    const [selectedDsId, setSelectedDsId] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();

    // Fetch all quizzes
    useEffect(() => {
        axios.get(`${baseURL}/api/quizzes`)
            .then(response => {
                if (response.data.quizzes && Array.isArray(response.data.quizzes)) {
                    setQuizzes(response.data.quizzes);
                }
            })
            .catch(error => console.error('Error fetching quizzes:', error));
    }, []);

    // Fetch all data structures for dropdown
    useEffect(() => {
        axios.get(`${baseURL}/api/datastructures`)
            .then(response => {
                setDataStructures(response.data);
            })
            .catch(error => console.error('Error fetching data structures:', error));
    }, []);

    const handleQuizSubmit = (e) => {
        e.preventDefault();
        if (!selectedDsId) {
            setError("Please select a data structure.");
            return;
        }

        const quizData = {
            title: quizTitle,
            data_structure_id: selectedDsId
        };

        if (editingQuizId) {
            axios.put(`${baseURL}/api/quizzes/${editingQuizId}`, quizData)
                .then(response => {
                    const updatedQuizzes = quizzes.map(quiz => quiz._id === editingQuizId ? response.data : quiz);
                    setQuizzes(updatedQuizzes);
                    resetQuizForm();
                    setSuccessMessage('Quiz updated successfully!');
                })
                .catch(error => setError('Failed to update quiz.'));
        } else {
            axios.post(`${baseURL}/api/quizzes`, quizData)
                .then(response => {
                    setQuizzes([...quizzes, response.data.quiz]);
                    resetQuizForm();
                    setSuccessMessage('Quiz added successfully!');
                })
                .catch(error => setError('Failed to add quiz.'));
        }
    };

    const handleDeleteQuiz = (id) => {
        if (window.confirm('Are you sure you want to delete this quiz?')) {
            axios.delete(`${baseURL}/api/quizzes/${id}`)
                .then(() => {
                    setQuizzes(quizzes.filter(quiz => quiz._id !== id));
                    setSuccessMessage('Quiz deleted successfully.');
                })
                .catch(error => setError('Failed to delete quiz.'));
        }
    };

    const handleEditQuiz = (quiz) => {
        setQuizTitle(quiz.title);
        setSelectedDsId(quiz.data_structure_id?._id || ''); // Optional chaining for safety
        setEditingQuizId(quiz._id);
    };

    const resetQuizForm = () => {
        setQuizTitle('');
        setSelectedDsId('');
        setEditingQuizId(null);
        setError(null);
        setSuccessMessage(null);
    };

    const handleViewQuestions = (quizId) => {
        navigate(`/admin/quizzes/question/${quizId}`);
    };

    return (
        <div className="admin-quizzes">
            <h2>Manage Quizzes</h2>

            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}

            <form className="quiz-form" onSubmit={handleQuizSubmit}>
                <input
                    type="text"
                    placeholder="Quiz Title"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    required
                />

                {/* Data Structure Dropdown */}
                <select
                    value={selectedDsId}
                    onChange={(e) => setSelectedDsId(e.target.value)}
                    required
                >
                    <option value="">Select Data Structure</option>
                    {dataStructures.map(ds => (
                        <option key={ds._id} value={ds._id}>
                            {ds.name}
                        </option>
                    ))}
                </select>

                <button type="submit" className="btn-primary">
                    {editingQuizId ? 'Update Quiz' : 'Add Quiz'}
                </button>
                {editingQuizId && (
                    <button type="button" className="btn-secondary" onClick={resetQuizForm}>
                        Cancel
                    </button>
                )}
            </form>

            <ul className="quiz-list">
                {quizzes.map(quiz => (
                    <li key={quiz._id}>
                        <strong>{quiz.title}</strong> ({quiz.data_structure_id?.name || 'No DS'})
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
