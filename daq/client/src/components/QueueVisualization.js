import React, { useState } from 'react';
import arrowImage from '../assets/icons/arrow.png'; // Ensure correct path to arrow image
import './queue.css'

const QueueVisualization = () => {
  const [queue, setQueue] = useState([]);

  const pushElement = () => {
    const newItem = prompt('Enter value to enqueue:');
    if (newItem) {
      setQueue([...queue, newItem]);
    }
  };

  const popElement = () => {
    if (queue.length > 0) {
      setQueue(queue.slice(1));
    }
  };

  const clearAll = () => {
    setQueue([]);
  };

  return (
    <div className="queue-visualization">
      <h2 className="text-center mb-4">Queue Operations</h2>
      <div className="queue-buttons text-center">
        <button className="btn btn-primary me-2" onClick={pushElement}>Enqueue</button>
        <button className="btn btn-warning me-2" onClick={popElement}>Dequeue</button>
        <button className="btn btn-danger" onClick={clearAll}>Clear All</button>
      </div>

      <div className="queue-container-wrapper">
        <div className="queue-container">
          {/* Queue content */}
          {queue.length > 0 ? (
            queue.map((item, index) => (
              <div key={index} className="queue-item">
                {item}
              </div>
            ))
          ) : (
            <div className="queue-empty">Empty</div>
          )}
        </div>

        {/* Head Indicator */}
        {queue.length > 0 && (
          <div className="qhead-indicator">
            <div className="arrow-wrapper">
              <img className="arrow-image" src={arrowImage} alt="Head" />
              <div className="arrow-label">Rare</div>
            </div>
          </div>
        )}

        {/* Tail Indicator */}
        {queue.length > 1 && (
          <div className="qtail-indicator" style={{ left: `${queue.length * 73 - 15}px` }}>
            <div className="arrow-wrapper">
              <img className="arrow-image" src={arrowImage} alt="Tail" />
              <div className="arrow-label">Front</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueueVisualization;
