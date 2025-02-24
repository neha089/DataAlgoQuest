import React, { useState, useEffect } from 'react';
import UserInfo from './UserInfo';
import SubmissionCalendar from './SubmissionCalendar';
import ProgressGraph from './ProgressGraph';
import './Profile.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa'; // Import star icons

const Profile = () => {
    const [submissions, setSubmissions] = useState([]);
    const [progress, setProgress] = useState(null);
    const [userId, setUserId] = useState(null);
    const [showFeedbackForm, setShowFeedbackForm] = useState(true);
    const [bug, setBug] = useState('');
    const [feedback, setFeedback] = useState(1); // Initialize feedback with a default value of 1
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserId = () => {
            const user_id = localStorage.getItem('userId');
            if (user_id) {
                setUserId(user_id);
            } else {
                console.error('User ID not found in localStorage');
            }
        };

        fetchUserId();
    }, []);  

    useEffect(() => {
        if (userId) {
            const fetchAttemptsPerDay = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/attempts-per-day/${userId}`);
                    const formattedSubmissions = Object.keys(response.data.attemptsPerDay).map(date => ({
                        date: new Date(date),
                        count: response.data.attemptsPerDay[date]
                    }));
                    setSubmissions(formattedSubmissions);
                } catch (error) {
                    console.error('Error fetching attempts data:', error);
                }
            };

            const fetchProgressData = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/user-progress/${userId}`);
                    setProgress(response.data);
                } catch (error) {
                    console.error('Error fetching progress data:', error);
                }
            };

            fetchAttemptsPerDay();
            fetchProgressData();
        }
    }, [userId]);

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/feedback/', {
                user_id: userId,
                bug,
                feedback,
            });
            console.log('Feedback submitted successfully:', response.data);
            setShowFeedbackForm(false); // Close the feedback form after submission
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
    };

    const handleStarClick = (rating) => {
        setFeedback(rating);
    };

    return ( 
        <div className="profile-container">
            {showFeedbackForm && (
                <div className="feedback-form-overlay">
                    <div className="feedback-form">
                        <h2>Feedback Form</h2>
                        <form onSubmit={handleFeedbackSubmit}>
                            <label htmlFor="bug">Bug Description:</label>
                            <textarea
                                id="bug"
                                value={bug}
                                onChange={(e) => setBug(e.target.value)}
                                placeholder="Describe any bug or issue..."
                            />
                            <label>Feedback Rating:</label>
                            <div className="star-rating">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FaStar
                                        key={star}
                                        size={24}
                                        color={star <= feedback ? '#ffc107' : '#e4e5e9'}
                                        onClick={() => handleStarClick(star)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                ))}
                            </div>
                            <div className="feedback-form-buttons">
                                <button type="submit">Submit</button>
                                <button type="button" onClick={() => setShowFeedbackForm(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <UserInfo /><br/>
            <div className="progress-section">
                <div className="calendar">
                    <SubmissionCalendar submissions={submissions} />
                </div>
                <div className="progress-graph">
                    {progress && (
                        <ProgressGraph progress={progress} />
                    )}
                </div>
            </div>
            <button onClick={() => navigate(-1)}>Back</button>
        </div>
    );
};

export default Profile;
