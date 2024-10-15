import React, { useState, useEffect } from 'react';
import UserInfo from './UserInfo';
import SubmissionCalendar from './SubmissionCalendar';
import ProgressGraph from './ProgressGraph';
import './Profile.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [submissions, setSubmissions] = useState([]);
    const [progress, setProgress] = useState(null);
    const [userId, setUserId] = useState(null);
    const navigate=useNavigate();
    useEffect(() => {
        // Fetch the userId from localStorage
        const fetchUserId = () => {
            const user_id = localStorage.getItem('userId');
            if (user_id) {
                setUserId(user_id);  // Set the userId state
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
                const response = await axios.get(`http://localhost:5000/api/attempts-per-day/${userId}`); // Call the new API
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
                setProgress(response.data); // Set progress data
            } catch (error) {
                console.error('Error fetching progress data:', error);
            }
        };

        fetchAttemptsPerDay();
        fetchProgressData();
    }
    }, [userId]);

    return ( 
        <div className="profile-container">
            <UserInfo />
            <div className="progress-section">
                <div className="calendar">
                    <SubmissionCalendar submissions={submissions} /> {/* Pass submissions data */}
                </div>
                <div className="progress-graph">
                    {progress && (
                        <>
                            <ProgressGraph progress={progress} />
                        </>
                    )}
                </div>
            </div>
            <button onClick={()=>navigate(-1)}>Back</button>
        </div>
    );
    
};

export default Profile;
