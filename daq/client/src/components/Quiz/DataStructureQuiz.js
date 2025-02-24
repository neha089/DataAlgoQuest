import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './style.css';

const DataStructureQuiz = () => {
    const [userId, setUserId] = useState(null);
    const { data_structure_id } = useParams();
    const [quizzes, setQuizzes] = useState([]);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quizId, setQuizId] = useState(null);
    useEffect(() => {
        const fetchUserId = () => { 
            const user_id =localStorage.getItem('userId'); // Assuming 'user' was stored in localStorage
            if (user_id) {
              setUserId(user_id);
            }
          };
      
        fetchUserId();

        const fetchQuizzes = async () => {
            if (!data_structure_id) {
                setError('Data Structure ID is undefined');
                setLoading(false);
                return;
            }
    
            try {
                const response = await fetch(`http://localhost:5000/api/quizzes/data-structure/${data_structure_id}`);
                if (!response.ok) {
                    throw new Error('Quizzes not found');
                }
                const data = await response.json();
                console.log('Fetched data:', data); // Log the fetched data
                setQuizzes(data.quizzes || []); // Ensure quizzes is always an array
                if (data.quizzes && data.quizzes.length > 0) {
                    setQuizId(data.quizzes[0]._id); // Set the quiz_id of the first quiz
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchQuizzes();
    }, [data_structure_id]);

    const handleChange = (event, index) => {
        setAnswers({
            ...answers,
            [index]: event.target.value,
        });
    };

    const handleSubmit = async () => {
        // Dummy user ID (replace with actual user authentication or state)
        const user_id = userId; // Replace with actual user ID
        const quiz_id = quizId;
        
        try {
            const response = await fetch('http://localhost:5000/api/quizzes/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    quiz_id,
                    user_id,
                    answers
                })
            });

            const result = await response.json();
            if (response.ok) {
                // Handle success (e.g., show a message or navigate)
                console.log('Quiz submitted successfully', result);
                setSubmitted(true);
            } else {
                // Handle error from API (e.g., validation errors)
                console.error('Error submitting quiz', result);
                setError(result.message || 'Error submitting quiz');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred while submitting the quiz');
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="quiz-container">
            {quizzes.length > 0 ? (
                quizzes.map((quiz, quizIndex) => {
                    console.log('Quiz:', quiz); // Log each quiz object
                    console.log('Questions:', quiz.question); // Log the questions for each quiz
                    return (
                        <div key={quizIndex} className="quiz-card">
                            <h3>Quiz: {quiz.title}</h3>
                            {quiz.question && quiz.question.length > 0 ? (
                                quiz.question.map((question, index) => (
                                    <div key={index} className="question-card">
                                        <p className="quiz-question">{question.question}</p>
                                        <div className="quiz-options">
                                            {question.options && question.options.length > 0 ? (
                                                question.options.map((option, optionIndex) => (
                                                    <label 
                                                        key={optionIndex} 
                                                        className={`quiz-option 
                                                        ${submitted && question.correct_answer === option && 'correct'} 
                                                        ${submitted && answers[index] === option && answers[index] !== question.correct_answer && 'incorrect'}`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`question-${index}`}
                                                            value={option}
                                                            onChange={(event) => handleChange(event, index)}
                                                            disabled={submitted}
                                                        />
                                                        {option}
                                                    </label>
                                                ))
                                            ) : (
                                                <p>No options available</p>
                                            )}
                                        </div>
                                        {submitted && answers[index] !== question.correct_answer && (
                                            <p className="correct-answer">Correct Answer: {question.correct_answer}</p>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p>No questions available</p>
                            )}
                        </div>
                    );
                })
            ) : (
                <p>No quizzes available</p>
            )}
            {quizzes.length > 0 && !submitted && (
                <button onClick={handleSubmit} className="submit-button">Submit</button>
            )}
            {submitted && <p className="quiz-result">Quiz Completed!</p>}
            <div className="button-container">
                <button onClick={handleBack} className="back-button">
                    Back
                </button>
            </div>
        </div>
    );
};

export default DataStructureQuiz;
