import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CodingChallenges from './CodingChallenges'; // Ensure the path is correct
import './style.css'; // Ensure styles are applied

const CodingChallengesPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Destructure challenges from state
    const { challenges } = location.state || {};

    // Handle cases where challenges data might not be passed
    if (!challenges) {
        return (
            <div className="coding-challenges-page">
                <h1>No Coding Challenges Available</h1>
                <button onClick={() => navigate(-1)} className="back-button">Back</button>
            </div>
        );
    }

    // Function to navigate back
    const handleBack = () => {
        navigate(-1); // Navigate to the previous page
    };

    return (
        <div className="coding-challenges-page">
            <h1>Coding Challenges</h1>
            {/* Render the CodingChallenges component with challenges data */}
            <CodingChallenges challenges={challenges} />

            <div className="button-container">
                <button onClick={handleBack} className="back-button">Back</button>
            </div>
        </div>
    );
};

export default CodingChallengesPage;
