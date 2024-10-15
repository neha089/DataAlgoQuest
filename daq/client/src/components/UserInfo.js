// UserInfo.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserInfo.css';

const UserInfo = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch user data
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/api/user/profile');
                setUserData(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch user data');
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const { user, quizAttempts, challengeAttempts } = userData;

    return (
        <div className="user-info-container">
            <div className="user-details">
                <div className="profile-picture">
                    <span>{user.username.charAt(0).toUpperCase()}</span>
                </div>
                <div className="user-text-info">
                    <h2>{user.username}</h2>
                    <p><strong>Institution:</strong> {user.institution}</p>
                    <p><strong>Rank:</strong> {user.rank || 'N/A'}</p>
                    <p><strong>Language Used:</strong> {user.languageUsed || 'N/A'}</p>
                    <p><strong>Coding Score:</strong> {user.codingScore}</p>
                    <p><strong>Problems Solved:</strong> {user.problemsSolved}</p>
                </div>
            </div>
            <div className="user-activity">
                <h3>Activity Summary</h3>
                <p><strong>Quiz Attempts:</strong> {quizAttempts.length}</p>
                <p><strong>Challenge Attempts:</strong> {challengeAttempts.length}</p>
                <p><strong>Current Streak:</strong> {user.streak} days</p>
            </div>
        </div>
    );
};

export default UserInfo;
