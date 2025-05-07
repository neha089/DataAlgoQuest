import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './style.css';
import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL;

const LearningPaths = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [learningPaths, setLearningPaths] = useState([]);
    const [rawStructures, setRawStructures] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Get userId from localStorage
    useEffect(() => {
        const user_id = localStorage.getItem('userId');
        if (user_id) setUserId(user_id);
    }, []);

    // 2. Fetch all data structures
    useEffect(() => {
        const fetchDataStructures = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/datastructures/`);
                setRawStructures(response.data);
            } catch (error) {
                console.error('Error fetching data structures:', error);
            }
        };
        fetchDataStructures();
    }, []);

    // 3. Calculate progress and duration
    useEffect(() => {
        const fetchProgressData = async () => {
            setLoading(true);

            if (!userId || rawStructures.length === 0) return;

            const updatedPaths = await Promise.all(rawStructures.map(async (ds) => {
                const path = {
                    id: ds._id,
                    title: ds.name,
                    description: ds.description || 'No description available.',
                    data_structure_id: ds._id
                };

                try {
                    // Total quizzes and challenges
                    const [quizzesRes, challengesRes] = await Promise.all([
                        axios.get(`${baseURL}/api/quizzes/data-structure/${path.data_structure_id}`).catch(e => console.error(e)),
                        axios.get(`${baseURL}/api/challenges/dschallenge/${path.data_structure_id}`).catch(e => console.error(e))
                    ]);

                    const totalQuizzes = quizzesRes?.data?.quizzes?.length || 0;
                    const totalChallenges = challengesRes?.data?.challenges?.length || 0;
                    const totalItems = totalQuizzes + totalChallenges;

                    // Solved quizzes and challenges
                    const [solvedQRes, solvedCRes] = await Promise.all([
                        axios.get(`${baseURL}/api/quizzes/solvedDs/${userId}?data_structure_id=${path.data_structure_id}`).catch(e => console.error(e)),
                        axios.get(`${baseURL}/api/challenges/solveByds?user_id=${userId}&data_structure_id=${path.data_structure_id}`).catch(e => console.error(e))
                    ]);

                    const solvedQuizzes = solvedQRes?.data?.solvedQuizzes?.length || 0;
                    const solvedChallenges = solvedCRes?.data?.solvedChallenges?.length || 0;
                    const solvedItems = solvedQuizzes + solvedChallenges;

                    const progress = totalItems > 0 ? Math.round((solvedItems * 100) / totalItems) : 0;

                    return { ...path, progress};
                } catch (error) {
                    console.error(`Error computing progress for ${ds.name}:`, error);
                    return { ...path, progress: 0, duration: 'N/A' };
                }
            }));

            setLearningPaths(updatedPaths);
            setLoading(false);
        };

        fetchProgressData();

    }, [userId, rawStructures]);

    const handleClick = (path) => {
        navigate(`/data-structure/${encodeURIComponent(path.title)}`);
    };

    return (
        <div className="learning-paths-container">
            <h1 className="learning-paths-title">Learning Paths</h1>
    
            {loading ? (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading learning paths...</p>
                </div>
            ) : (
                <div className="progress-container">
                    {learningPaths.map(path => (
                        <div key={path.id} className="progress-item" onClick={() => handleClick(path)}>
                            <CircularProgressbar value={path.progress} text={`${path.progress}%`} className="circular-progressbar" />
                            <div className="learning-path-title">{path.title}</div>
                            <div className="learning-path-description">{path.description}</div>
                            <a href={`/data-structure/${encodeURIComponent(path.title)}`} className="learning-path-button">Continue</a>
                        </div>
                    ))}
                </div>
            )}
    
            <button onClick={() => navigate(-1)}>Back</button>
        </div>
    );    
};

export default LearningPaths;
