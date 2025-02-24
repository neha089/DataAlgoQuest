import React from 'react';
import { useNavigate } from 'react-router-dom';
import './aa.css';

const LearningPathsaa = () => {
  const paths = [
    { title: 'Sorting Algorithms', time: '1 hours, 30 minutes' },
    { title: 'Graph Algorithms', time: '1 hours, 15 minutes' },
    { title: 'Dynamic Programming', time: '1 hours, 10 minutes' },
  ];

  const navigate = useNavigate();

  const handleContinue = (title) => {
    if (title === 'Sorting Algorithms') {
      navigate('/sorting-visualization');
    } else if (title === 'Graph Algorithms') {
      navigate('/graph-visualization');
    } else if (title === 'Dynamic Programming') {
      navigate('/dynamic-programming-visualization');
    } else {
      alert('This path is under construction!');
    }
  };

  return (
    <div className="learning-paths-container">
      <h1>Algorithm Learning Paths</h1>
      <div className="paths">
        {paths.map((path, index) => (
          <div key={index} className="path-card">
            <div className="progress-circle">
              <span>0%</span>
            </div>
            <h2>{path.title}</h2>
            <p>Your path to mastering {path.title}!</p>
            <p className="time">Total time: {path.time}</p>
            <button
              className="continue-btn"
              onClick={() => handleContinue(path.title)}
            >
              Continue
            </button>
          </div>
        ))}
      </div>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default LearningPathsaa;
