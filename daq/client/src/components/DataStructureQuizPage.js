import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DataStructureQuiz from './DataStructureQuiz'; // Reuse your quiz component

const DataStructureQuizPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { questions } = location.state; // Get the quiz questions from state

    if (!questions) {
        return (
            <div className="quiz-page-container">
                <h1>No Coding Challenges Available</h1>
                <button onClick={() => navigate(-1)} className="back-button">Back</button>
            </div>
        );
    }
    // Function to handle back navigation
    const handleBack = () => {
        navigate(-1); // Go back to the previous page
    };

    return (
        <div className="quiz-page-container">
            <h1>Data Structure Quiz</h1>
            {/* Render the quiz with questions passed from the DataStructureDetail */}
            <DataStructureQuiz questions={questions} />

            <div className="button-container">
                <button onClick={handleBack} className="back-button">
                    Back
                </button>
            </div>
        </div>
    );
};

export default DataStructureQuizPage;
