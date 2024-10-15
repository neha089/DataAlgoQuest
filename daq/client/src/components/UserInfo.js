import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserInfo.css';

const UserInfo = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        // Fetch the userId from localStorage
        const fetchUserId = () => {
            const user_id = localStorage.getItem('userId');
            if (user_id) {
                setUserId(user_id);  // Set the userId state
            } else {
                console.error('User ID not found in localStorage');
                setError('User ID is not available.');
                setLoading(false);
            }
        };

        fetchUserId();
    }, []);  // Run only once when the component mounts

    useEffect(() => {
        // Fetch user data only if userId is available
        if (userId) {
            const fetchUserData = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/user/profile/${userId}`);
                    setUserData(response.data);
                    setLoading(false);
                } catch (err) {
                    setError('Failed to fetch user data');
                    setLoading(false);
                }
            };

            fetchUserData();
        }
    }, [userId]);  // Run only when userId is set

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const { user, quizAttempts, challengeAttempts } = userData;
    const quiz_scores = user.progress ? user.progress.quiz_scores : 0; // Fixed access
    const challenge_scores = user.progress ? user.progress.challenge_scores : 0; // Fixed access

    return (
        <div className="user-info-container">
            <div className="user-details">
                <div className="profile-picture">
                    {user && user.name ? (
                        <span>{user.name.charAt(0).toUpperCase()}</span>
                    ) : (
                        <span>N/A</span>
                    )}
                </div>
                <div className="user-text-info">
                    <h2>{user.name}</h2>
                    <h2>{user.email}</h2>
                    {/* <p><strong>Institution:</strong> {user.institution || 'N/A'}</p>
                    <p><strong>Rank:</strong> {user.rank || 'N/A'}</p>
                    <p><strong>Language Used:</strong> {user.languageUsed || 'N/A'}</p>
                    <p><strong>Problems Solved:</strong> {user.problemsSolved || 'N/A'}</p> */}
                </div>
            </div>
            <div className="user-activity">
                <h3>Activity Summary</h3>
                <p><strong>Quiz Attempts:</strong> {quizAttempts.length}</p>
                <p><strong>Quiz Scores:</strong> {quiz_scores}</p> {/* Display quiz scores */}
                <p><strong>Challenge Attempts:</strong> {challengeAttempts.length}</p>
                <p><strong>Coding Score:</strong> {challenge_scores}</p>
                {/* <p><strong>Current Streak:</strong> {user.streak || 'N/A'} days</p> */}
            </div>
        </div>
    );
};

export default UserInfo;
