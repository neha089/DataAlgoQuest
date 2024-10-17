import React from 'react'; 
import './ProgressGraph.css';

const ProgressGraph = ({ progress }) => {
    const { quiz_scores, challenge_scores } = progress;

    // Set a reasonable maximum value for scaling
    const maxScore = Math.max(quiz_scores, challenge_scores, 50); 
    // Scale the values to fit within the SVG height (200)
    const graphPoints = [
        { x: 50, y: (200 - (quiz_scores / maxScore) * 180), label: 'Quiz Scores' },  // Scale quiz scores
        { x: 150, y: (200 - (challenge_scores / maxScore) * 180), label: 'Challenge Scores' } // Scale challenge scores
    ];

    console.log("Graph Points:", graphPoints);

    // Convert points to a string for SVG, and invert y-axis for SVG rendering
    const pointsString = graphPoints.map(point => `${point.x},${point.y}`).join(' ');

    console.log("SVG Points String:", pointsString);

    return (
       
            <div className="graph-container">
                <h4>Progress</h4>
                <svg width="700" height="520"> {/* Increased height for better visibility */}
                    {/* X-axis */}
                    <line x1="30" y1="200" x2="180" y2="200" stroke="black" strokeWidth="3"/>
                    {/* Y-axis */}
                    <line x1="30" y1="10" x2="30" y2="200" stroke="black" strokeWidth="3"/>
                    
                    {/* Graph line */}
                    <polyline
                        fill="none"
                        stroke="#FF5722"
                        strokeWidth="2"
                        points={pointsString}  // Use the calculated points
                    />

                    {/* Plot points with labels */}
                    {graphPoints.map((point, index) => (
                        <g key={index}>
                            {/* Circle marker for each point */}
                            <circle cx={point.x} cy={point.y} r="3" fill="#FF5722" />
                            {/* Display the score value next to the point */}
                            <text x={point.x - 10} y={point.y - 5} fontSize="13" fill="white">
                                {point.label}: {index === 0 ? quiz_scores : challenge_scores}
                            </text>
                        </g>
                    ))}

                    {/* Labels for X-axis */}
                    <text x="50" y="215" fontSize="14" fill="white">Quiz Scores</text>
                    <text x="130" y="215" fontSize="14" fill="white">Challenge Scores</text>
                </svg>
            </div>
     
    );
};

export default ProgressGraph;
