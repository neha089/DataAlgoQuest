import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './style.css'; // Ensure you import the CSS file

const LearningPaths = () => {
    const navigate = useNavigate();
        const learningPaths = [
        {
            id: 1,
            title: 'Stack',
            description: 'Your Path to Becoming a Career-Ready Web Developer!',
            duration: 'Total time: 39 hours, 30 minutes',
            progress: 0 // Update this value to reflect actual user progress
        },
        {
            id: 2,
            title: 'Queue',
            description: 'Enhance Your Skills and Build More Complex Projects!',
            duration: 'Total time: 42 hours, 15 minutes',
            progress: 0 // Update this value to reflect actual user progress
        },
        {
            id: 3,
            title: 'Tree',
            description: 'Master the Latest Technologies and Go Beyond the Basics!',
            duration: 'Total time: 45 hours, 10 minutes',
            progress: 0 // Update this value to reflect actual user progress
        },
        {
            id: 4,
            title: 'Singly Linked List',
            description: 'Your Path to Becoming a Career-Ready Web Developer!',
            duration: 'Total time: 39 hours, 30 minutes',
            progress: 0 // Update this value to reflect actual user progress
        },
        {
            id: 5,
            title: 'Doubly Linked List',
            description: 'Enhance Your Skills and Build More Complex Projects!',
            duration: 'Total time: 42 hours, 15 minutes',
            progress: 0 // Update this value to reflect actual user progress
        },
        {
            id: 6,
            title: 'Tree',
            description: 'Master the Latest Technologies and Go Beyond the Basics!',
            duration: 'Total time: 45 hours, 10 minutes',
            progress: 0 // Update this value to reflect actual user progress
        }

    ];
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
        </div>
    );
}

export default LearningPaths;
