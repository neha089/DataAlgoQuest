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
            title: 'Prefix-Matching',
            description: 'This algorothim use Trie to solve this problem',
            duration: 'Total time: 39 hours, 30 minutes',
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
