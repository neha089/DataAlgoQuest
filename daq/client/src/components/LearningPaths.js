import React from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './style.css'; // Ensure you import the CSS file

const LearningPaths = () => {
    const learningPaths = [
        {
            id: 1,
            title: 'stack',
            description: 'Your Path to Becoming a Career-Ready Web Developer!',
            duration: 'Total time: 39 hours, 30 minutes',
            progress: 0 // Update this value to reflect actual user progress
        },
        {
            id: 2,
            title: 'queue',
            description: 'Enhance Your Skills and Build More Complex Projects!',
            duration: 'Total time: 42 hours, 15 minutes',
            progress: 0 // Update this value to reflect actual user progress
        },
        {
            id: 3,
            title: 'tree',
            description: 'Master the Latest Technologies and Go Beyond the Basics!',
            duration: 'Total time: 45 hours, 10 minutes',
            progress: 0 // Update this value to reflect actual user progress
        },
        {
            id: 4,
            title: 'stack',
            description: 'Your Path to Becoming a Career-Ready Web Developer!',
            duration: 'Total time: 39 hours, 30 minutes',
            progress: 0 // Update this value to reflect actual user progress
        },
        {
            id: 5,
            title: 'queue',
            description: 'Enhance Your Skills and Build More Complex Projects!',
            duration: 'Total time: 42 hours, 15 minutes',
            progress: 0 // Update this value to reflect actual user progress
        },
        {
            id: 6,
            title: 'tree',
            description: 'Master the Latest Technologies and Go Beyond the Basics!',
            duration: 'Total time: 45 hours, 10 minutes',
            progress: 0 // Update this value to reflect actual user progress
        }
    ];

    return (
        <div className="learning-paths-container">
            <h1 className="learning-paths-title">Learning Paths</h1>
            <div className="progress-container">
                {learningPaths.map(path => (
                    <div key={path.id} className="progress-item">
                        <CircularProgressbar value={path.progress} text={`${path.progress}%`} className="circular-progressbar" />
                        <div className="learning-path-title">{path.title}</div>
                        <div className="learning-path-description">{path.description}</div>
                        <div className="learning-path-duration">{path.duration}</div>
                        <a href={`/path/${path.id}`} className="learning-path-button">Continue</a>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LearningPaths;
