import React, { useState } from 'react';
import arrowImage from "../assets/icons/arrow.png"; // Ensure correct path to arrow image
import './stack.css'

const StackVisualization = () => {
  const [stack, setStack] = useState([]);

  const pushElement = () => {
    const newItem = prompt("Enter value to push to stack:");
    if (newItem) {
      setStack([newItem, ...stack]);
    }
  };

  const popElement = () => {
    if (stack.length > 0) {
      setStack(stack.slice(1));
    }
  };

  const clearAll = () => {
    setStack([]);
  };

  return (
    <div className="stack-visualization">
      <h2 className="text-center mb-4">Stack Operations</h2>

      <div className="stack-buttons text-center">
        <button className="btn btn-primary me-2" onClick={pushElement}>Push</button>
        <button className="btn btn-warning me-2" onClick={popElement}>Pop</button>
        <button className="btn btn-danger" onClick={clearAll}>Clear All</button>
      </div>

      <div className="stack-container-wrapper mt-5 d-flex justify-content-center">
        {/* Tail Indicator */}
        {stack.length > 1 && (
          <div className="tail-indicator">
            <img src={arrowImage} className="arrow-img" alt="Tail Indicator" />
            <div className="arrow-label">Tail</div>
          </div>
        )}

        <div className="stack-container border">
          {/* Stack content */}
          {stack.length > 0 ? (
            stack.map((item, index) => (
              <div
                key={index}
                className={`stack-item ${index === 0 ? "top-item" : ""}`}
              >
                {item}
              </div>
            ))
          ) : (
            <div className="stack-empty">Empty</div>
          )}
        </div>

        {/* Head Indicator */}
        {stack.length >=0  && (
          <div className="head-indicator" style={{ top: `calc(100% - ${55 * (stack.length)}px)` }}>
            <img src={arrowImage} className="arrow-img" alt="Head Indicator" />
            <div className="arrow-label">Head</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StackVisualization;
