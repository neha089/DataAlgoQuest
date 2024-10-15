import React from 'react';
import './ProgressGraph.css';

const ProgressGraph = () => {
    return (
        <div className="progress-graph">
            <h3>Monthly Problem Solved</h3>
            <div className="graph-container">
                <svg width="100%" height="100">
                    <polyline
                        fill="none"
                        stroke="#FF5722"
                        strokeWidth="2"
                        points="0,80 20,60 40,90 60,30 80,60 100,20 120,50"
                    />
                </svg>
            </div>
        </div>
    );
};

export default ProgressGraph;
