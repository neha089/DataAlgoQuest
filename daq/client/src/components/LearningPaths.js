import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './style.css'; // Ensure you import the CSS file
import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL;
const LearningPaths = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    useEffect(() => {
        const fetchUserId = () => { 
            const user_id =localStorage.getItem('userId'); // Assuming 'user' was stored in localStorage
            if (user_id) {
              setUserId(user_id);
            }
          };
      
        fetchUserId();
    },[]);
    
        const [learningPaths, setLearningPaths] =  useState([
        {
            id: 1,
            title: 'Stack',
            description: 'Your Path to Becoming a Career-Ready Web Developer!',
            duration: 'Total time: 3 hours, 30 minutes',
            data_structure_id:'67e2852b84e8f18d0c335458'
        },
        {
            id: 2,
            title: 'Queue',
            description: 'Enhance Your Skills and Build More Complex Projects!',
            duration: 'Total time: 2 hours, 15 minutes',
            data_structure_id:'67e28b2f84e8f18d0c335a19'
        },
        {
            id: 3,
            title: 'Tree',
            description: 'Master the Latest Technologies and Go Beyond the Basics!',
            duration: 'Total time: 5 hours, 10 minutes',
            data_structure_id:'67e2853d84e8f18d0c33545e'
        },
        {
            id: 4,
            title: 'LinkedList',
            description: 'Your Path to Becoming a Career-Ready Web Developer!',
            duration: 'Total time: 3 hours, 45 minutes',
            data_structure_id:'67e2853584e8f18d0c33545b'
        },


    ]);

    useEffect(() => {
        const fetchProgressData = async () => {
            if (!userId) return; 
            const updatedPaths = await Promise.all(learningPaths.map(async (path) => {
                try {
                    // Fetch total quizzes and challenges for this data structure
                    const totalQuizzesResponse = await axios.get(`${baseURL}/api/quizzes/data-structure/${path.data_structure_id}`)
                        .catch(error => {
                            console.error('Error:', error.response ? error.response.data : error.message);
                        });
                    
                    const totalChallengesResponse = await axios.get(`${baseURL}/api/challenges/dschallenge/${path.data_structure_id}`)
                        .catch(error => {
                            console.error('Error:', error.response ? error.response.data : error.message);
                        });
                    
                    // Set default values to handle cases of missing data
                    const totalQuizzes = totalQuizzesResponse?.data?.quizzes?.length || 0;
                    const totalChallenges = totalChallengesResponse?.data?.challenges?.length || 0;
    
                    // Fetch solved quizzes and challenges for the current user
                    const solvedQuizzesResponse = await axios.get(`${baseURL}/api/quizzes/solvedDs/${userId}?data_structure_id=${path.data_structure_id}`)
                        .catch(error => {
                            console.error('Error:', error.response ? error.response.data : error.message);
                        });
                    const solvedChallengesResponse = await axios.get(`${baseURL}/api/challenges/solveByds?user_id=${userId}&data_structure_id=${path.data_structure_id}`)
                        .catch(error => {
                            console.error('Error:', error.response ? error.response.data : error.message);
                        });
    
                    const solvedQuizzes = solvedQuizzesResponse?.data?.solvedQuizzes?.length || 0;
                    const solvedChallenges = solvedChallengesResponse?.data?.solvedChallenges?.length || 0;
    
                    const totalItems = totalQuizzes + totalChallenges;
                    const solvedItems = solvedQuizzes + solvedChallenges;

                    // Calculate progress for this learning path
                    const progress = totalItems > 0 ? Math.round((solvedItems * 100) / totalItems) : 0;
    
                    // Return the updated path with progress
                    return { ...path, progress };
                } catch (error) {
                    console.error(`Error fetching data for ${path.title}:`, error);
                    return path; // Return the original path in case of error
                }
            }));
    
            // Update learning paths with calculated progress
            setLearningPaths(updatedPaths);
        };
    
        fetchProgressData();
    }, [userId]);
    
    const handleClick = (path) => {
        navigate(`/data-structure/${encodeURIComponent(path.title)}`); // Navigate to DataStructureDetail with the title
    };

    return (
        <div className="learning-paths-container">
            <h1 className="learning-paths-title">Learning Paths</h1>
            <div className="progress-container">
                {learningPaths.map(path => (
                    <div key={path.id} className="progress-item"onClick={() => handleClick(path)}>
                        <CircularProgressbar value={path.progress} text={`${path.progress}%`} className="circular-progressbar" />
                        <div className="learning-path-title">{path.title}</div>
                        <div className="learning-path-description">{path.description}</div>
                        <div className="learning-path-duration">{path.duration}</div>
                        <a href={`/data-structure/${encodeURIComponent(path.title)}`} className="learning-path-button">Continue</a>
                    </div>
                ))}
            </div>
            <button onClick={()=>navigate(-1)}>Back</button>
        </div>
    );
}

export default LearningPaths;