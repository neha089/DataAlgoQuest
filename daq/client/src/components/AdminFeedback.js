import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons'; // Solid star
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons'; // Empty star
import './AdminFeedback.css';

const AdminFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/api/feedback/')
            .then(response => {
                setFeedbacks(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching feedback:', error);
                setError('Failed to load feedback.');
                setLoading(false);
            });
    }, []);

    const renderStars = (rating) => {
        const totalStars = 5;
        const stars = [];

        for (let i = 1; i <= totalStars; i++) {
            stars.push(
                <FontAwesomeIcon
                    key={i}
                    icon={i <= rating ? faStar : faStarEmpty}
                    className="star"
                />
            );
        }

        return <span>{stars}</span>;
    };

    return (
        <div className="admin-feedback">
            <h2>User Feedback</h2>
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            {!loading && !error && feedbacks.length === 0 && <p>No feedback available.</p>}
            {!loading && !error && feedbacks.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Feedback</th>
                            <th>Bug Report</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedbacks.map(feedback => (
                            <tr key={feedback._id}>
                                <td>{feedback.user_id}</td>
                                <td>{renderStars(feedback.feedback)}</td> {/* Display stars */}
                                <td>{feedback.bug || 'No bug reported'}</td>
                                <td>{new Date(feedback.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AdminFeedback;
