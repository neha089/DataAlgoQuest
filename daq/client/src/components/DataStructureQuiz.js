import React, { useState } from 'react';
import './style.css';

const DataStructureQuiz = ({ questions }) => {
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (event, index) => {
        setAnswers({
            ...answers,
            [index]: event.target.value,
        });
    };

    const handleSubmit = () => {
        setSubmitted(true);
    };

    return (
        <div className="quiz-container">
            <h2 className="quiz-title">Quiz: Test Your Knowledge</h2>
            {questions.map((question, index) => (
                <div key={index} className="quiz-card">
                    <p className="quiz-question">{question.question}</p>
                    <div className="quiz-options">
                        {question.options.map((option, optionIndex) => (
                            <label 
                                key={optionIndex} 
                                className={`quiz-option 
                                ${submitted && question.correctAnswer === option && 'correct'} 
                                ${submitted && answers[index] === option && answers[index] !== question.correctAnswer && 'incorrect'}`}
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
                        ))}
                    </div>
                    {submitted && answers[index] !== question.correctAnswer && (
                        <p className="correct-answer">Correct Answer: {question.correctAnswer}</p>
                    )}
                </div>
            ))}
            {!submitted && <button onClick={handleSubmit} className="submit-button">Submit</button>}
            {submitted && <p className="quiz-result">Quiz Completed!</p>}
        </div>
    );
};

export default DataStructureQuiz;
