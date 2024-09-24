import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminQuizzes = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [quizTitle, setQuizTitle] = useState('');
    const [editingQuizId, setEditingQuizId] = useState(null);
    const [error, setError] = useState(null);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [newQuestion, setNewQuestion] = useState({ question: '', options: ['', '', '', ''], correct_answer: '' });

    // Fetch all quizzes
    useEffect(() => {
        axios.get('http://localhost:5000/api/quizzes')
            .then(response => {
                // Check if quizzes property exists in the response data
                if (response.data.quizzes && Array.isArray(response.data.quizzes)) {
                    setQuizzes(response.data.quizzes);
                } else {
                    console.error('Fetched data is not an array:', response.data);
                }
            })
            .catch(error => console.error('Error fetching quizzes:', error));
    }, []);

    // Fetch questions for a selected quiz
    const fetchQuestions = (quizId) => {
        axios.get('http://localhost:5000/api/question', { params: { quizId } })
            .then(response => {
                if (Array.isArray(response.data)) {
                    setQuestions(response.data);
                } else {
                    console.error('Fetched data is not an array:', response.data);
                }
            })
            .catch(error => console.error('Error fetching questions:', error));
    };

    // Handle add or update quiz
    const handleQuizSubmit = (e) => {
        e.preventDefault();
        const quizData = { title: quizTitle };

        if (editingQuizId) {
            // Update existing quiz
            axios.put(`http://localhost:5000/api/quizzes/${editingQuizId}`, quizData)
                .then(response => {
                    const updatedQuizzes = quizzes.map(quiz =>
                        quiz._id === editingQuizId ? response.data : quiz
                    );
                    setQuizzes(updatedQuizzes);
                    resetQuizForm();
                })
                .catch(error => {
                    console.error('Error updating quiz:', error);
                    setError('Failed to update quiz.');
                });
        } else {
            // Add a new quiz
            axios.post('http://localhost:5000/api/quizzes', quizData)
                .then(response => {
                    setQuizzes([...quizzes, response.data]);
                    resetQuizForm();
                })
                .catch(error => {
                    console.error('Error adding quiz:', error);
                    setError('Failed to add quiz.');
                });
        }
    };

    // Handle delete quiz
    const handleDeleteQuiz = (id) => {
        axios.delete(`http://localhost:5000/api/quizzes/${id}`)
            .then(() => {
                setQuizzes(quizzes.filter(quiz => quiz._id !== id));
                if (selectedQuiz && selectedQuiz._id === id) {
                    setSelectedQuiz(null);
                    setQuestions([]);
                }
            })
            .catch(error => {
                console.error('Error deleting quiz:', error);
                setError('Failed to delete quiz.');
            });
    };

    // Handle edit click (populate form with data)
    const handleEditQuiz = (quiz) => {
        setQuizTitle(quiz.title);
        setEditingQuizId(quiz._id);
    };

    // Handle add or update question
    const handleQuestionSubmit = (e) => {
        e.preventDefault();
        const questionData = { ...newQuestion, quizId: selectedQuiz._id };

        if (newQuestion._id) {
            // Update existing question
            axios.put(`http://localhost:5000/api/question/${newQuestion._id}`, questionData)
                .then(response => {
                    const updatedQuestions = questions.map(q =>
                        q._id === newQuestion._id ? response.data : q
                    );
                    setQuestions(updatedQuestions);
                    resetQuestionForm();
                })
                .catch(error => {
                    console.error('Error updating question:', error);
                    setError('Failed to update question.');
                });
        } else {
            // Add a new question
            axios.post('http://localhost:5000/api/question', questionData)
                .then(response => {
                    setQuestions([...questions, response.data]);
                    resetQuestionForm();
                })
                .catch(error => {
                    console.error('Error adding question:', error);
                    setError('Failed to add question.');
                });
        }
    };

    // Handle delete question
    const handleDeleteQuestion = (id) => {
        axios.delete(`http://localhost:5000/api/question/${id}`)
            .then(() => {
                setQuestions(questions.filter(q => q._id !== id));
            })
            .catch(error => {
                console.error('Error deleting question:', error);
                setError('Failed to delete question.');
            });
    };

    // Handle edit question click
    const handleEditQuestion = (question) => {
        setNewQuestion(question);
    };

    // Reset quiz form
    const resetQuizForm = () => {
        setQuizTitle('');
        setEditingQuizId(null);
        setError(null);
    };

    // Reset question form
    const resetQuestionForm = () => {
        setNewQuestion({ question: '', options: ['', '', '', ''], correct_answer: '' });
        setError(null);
    };

    return (
        <div>
            <h2>Manage Quizzes</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleQuizSubmit}>
                <input
                    type="text"
                    placeholder="Quiz Title"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    required
                />
                <button type="submit">{editingQuizId ? 'Update Quiz' : 'Add Quiz'}</button>
                {editingQuizId && <button type="button" onClick={resetQuizForm}>Cancel</button>}
            </form>

            <ul>
                {quizzes.map(quiz => (
                    <li key={quiz._id}>
                        <strong>{quiz.title}</strong>
                        <button onClick={() => { setSelectedQuiz(quiz); fetchQuestions(quiz._id); }}>
                            View Questions
                        </button>
                        <button onClick={() => handleEditQuiz(quiz)}>Edit</button>
                        <button onClick={() => handleDeleteQuiz(quiz._id)}>Delete</button>
                    </li>
                ))}
            </ul>

            {selectedQuiz && (
                <div>
                    <h3>Questions for {selectedQuiz.title}</h3>
                    <ul>
                        {questions.map(question => (
                            <li key={question._id}>
                                <strong>{question.question}</strong>
                                <button onClick={() => handleEditQuestion(question)}>Edit</button>
                                <button onClick={() => handleDeleteQuestion(question._id)}>Delete</button>
                            </li>
                        ))}
                    </ul>

                    <form onSubmit={handleQuestionSubmit}>
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
                        <button type="submit">{newQuestion._id ? 'Update Question' : 'Add Question'}</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminQuizzes;
