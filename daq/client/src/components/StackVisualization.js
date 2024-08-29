import React, { useState } from 'react';
import './style.css';

const StackVisualization = () => {
    const [stack, setStack] = useState([]);
    const [message, setMessage] = useState('');

    const pushToStack = () => {
        const newItem = stack.length + 1;
        setStack([...stack, newItem]);
        setMessage(`Pushed ${newItem} to the stack.`);
    };

    const popFromStack = () => {
        if (stack.length > 0) {
            const poppedItem = stack[stack.length - 1];
            const newStack = stack.slice(0, -1);
            setStack(newStack);
            setMessage(`Popped ${poppedItem} from the stack.`);
        } else {
            setMessage('Stack is empty, nothing to pop.');
        }
    };

    return (
        <div className="stack-visualization">
            <h2>Stack Visualization</h2>
            <div className="stack-container">
                {stack.map((item, index) => (
                    <div key={index} className={`stack-item ${stack.length - 1 === index ? 'active' : ''}`}>
                        {item}
                    </div>
                ))}
            </div>
            <div className="stack-controls">
                <button onClick={pushToStack} className="stack-button">Push</button>
                <button onClick={popFromStack} className="stack-button">Pop</button>
            </div>
            <div className="cloud-message">
                <div className="cloud-icon">☁️</div>
                <span className="message-text">{message}</span>
            </div>
        </div>
    );
};

export default StackVisualization;
