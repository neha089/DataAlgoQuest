import React, { useState } from 'react';
import './style.css';

const QueueVisualization = () => {
    const [queue, setQueue] = useState([]);
    const [message, setMessage] = useState('');

    const enqueue = () => {
        const newItem = queue.length + 1;
        setQueue([...queue, newItem]);
        setMessage(`Enqueued ${newItem} to the queue.`);
    };

    const dequeue = () => {
        if (queue.length > 0) {
            const dequeuedItem = queue[0];
            const newQueue = queue.slice(1);
            setQueue(newQueue);
            setMessage(`Dequeued ${dequeuedItem} from the queue.`);
        } else {
            setMessage('Queue is empty, nothing to dequeue.');
        }
    };

    return (
        <div className="queue-visualization">
            <h2>Queue Visualization</h2>
            <div className="queue-container">
                {queue.map((item, index) => (
                    <div key={index} className={`queue-item ${index === 0 ? 'active' : ''}`}>
                        {item}
                    </div>
                ))}
            </div>
            <div className="queue-controls">
                <button onClick={enqueue} className="queue-button">Enqueue</button>
                <button onClick={dequeue} className="queue-button">Dequeue</button>
            </div>
            <div className="cloud-message">
                <div className="cloud-icon">☁️</div>
                <span className="message-text">{message}</span>
            </div>
        </div>
    );
};

export default QueueVisualization;
