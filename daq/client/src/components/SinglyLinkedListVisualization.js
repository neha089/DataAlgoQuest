import React, { useState } from 'react';
import './style.css'; // Custom CSS for styling

// Define the Node structure
class ListNode {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

const SinglyLinkedList = () => {
    const [head, setHead] = useState(null);
    const [size, setSize] = useState(0); 
    const [inputValue, setInputValue] = useState(''); 
    const [specificValue, setSpecificValue] = useState(''); 
    const [message, setMessage] = useState(''); 

    // Helper to traverse the list and render nodes
    const renderList = () => {
        const nodes = [];
        let current = head;
        while (current !== null) {
            nodes.push(current);
            current = current.next;
        }
        return nodes;
    };

    // Add node at the beginning
    const addNodeAtBeginning = () => {
        const newNode = new ListNode(inputValue);
        newNode.next = head;
        setHead(newNode);
        setSize(size + 1);
        setMessage(`Added ${inputValue} at the beginning`);
    };

    // Add node at the end
    const addNodeAtEnd = () => {
        const newNode = new ListNode(inputValue);
        if (head === null) {
            setHead(newNode);
        } else {
            let current = head;
            while (current.next !== null) {
                current = current.next;
            }
            current.next = newNode;
        }
        setSize(size + 1);
        setMessage(`Added ${inputValue} at the end`);
    };

    // Add node before a specific value
    const addNodeBeforeValue = () => {
        const newNode = new ListNode(inputValue);
        if (head === null) {
            setMessage('List is empty');
            return;
        }
        if (head.value === specificValue) {
            addNodeAtBeginning();
            return;
        }
        let current = head;
        let prev = null;
        while (current !== null && current.value !== specificValue) {
            prev = current;
            current = current.next;
        }
        if (current !== null) {
            newNode.next = current;
            prev.next = newNode;
            setSize(size + 1);
            setMessage(`Added ${inputValue} before ${specificValue}`);
        } else {
            setMessage(`${specificValue} not found in the list`);
        }
    };

    // Add node after a specific value
    const addNodeAfterValue = () => {
        const newNode = new ListNode(inputValue);
        let current = head;
        while (current !== null && current.value !== specificValue) {
            current = current.next;
        }
        if (current !== null) {
            newNode.next = current.next;
            current.next = newNode;
            setSize(size + 1);
            setMessage(`Added ${inputValue} after ${specificValue}`);
        } else {
            setMessage(`${specificValue} not found in the list`);
        }
    };

    // Remove node from the beginning
    const removeNodeFromBeginning = () => {
        if (head === null) {
            setMessage('List is empty, cannot remove.');
            return;
        }
        const removedValue = head.value;
        setHead(head.next);
        setSize(size - 1);
        setMessage(`Removed ${removedValue} from the beginning`);
    };

    // Remove node from the end
    const removeNodeFromEnd = () => {
        if (head === null) {
            setMessage('List is empty, cannot remove.');
            return;
        }
        if (head.next === null) {
            const removedValue = head.value;
            setHead(null);
            setSize(size - 1);
            setMessage(`Removed ${removedValue} from the end`);
            return;
        }
        let current = head;
        let prev = null;
        while (current.next !== null) {
            prev = current;
            current = current.next;
        }
        prev.next = null;
        setSize(size - 1);
        setMessage(`Removed ${current.value} from the end`);
    };

    // Remove node with a specific value
    const removeNodeWithValue = () => {
        if (head === null) {
            setMessage('List is empty');
            return;
        }
        if (head.value === specificValue) {
            removeNodeFromBeginning();
            return;
        }
        let current = head;
        let prev = null;
        while (current !== null && current.value !== specificValue) {
            prev = current;
            current = current.next;
        }
        if (current !== null) {
            prev.next = current.next;
            setSize(size - 1);
            setMessage(`Removed node with value ${specificValue}`);
        } else {
            setMessage(`${specificValue} not found in the list`);
        }
    };

    return (
        <div className="linkedlist-visualization">
            <h2>Singly Linked List</h2>
            <div className="list-container">
                {renderList().map((node, index) => (
                    <div key={index} className="list-node">
                        {node.value}
                        {node.next && <div className="arrow">→</div>}
                    </div>
                ))}
            </div>

            <div className="controls">
                <input 
                    type="text" 
                    placeholder="Enter node value" 
                    value={inputValue} 
                    onChange={(e) => setInputValue(e.target.value)} 
                    className="input-field"
                />
                <input 
                    type="text" 
                    placeholder="Specific value (optional)" 
                    value={specificValue} 
                    onChange={(e) => setSpecificValue(e.target.value)} 
                    className="input-field"
                />
                
                <button onClick={addNodeAtBeginning} className="control-button">Add at Beginning</button>
                <button onClick={addNodeAtEnd} className="control-button">Add at End</button>
                <button onClick={addNodeBeforeValue} className="control-button">Add Before Specific Value</button>
                <button onClick={addNodeAfterValue} className="control-button">Add After Specific Value</button>
                <button onClick={removeNodeFromBeginning} className="control-button">Remove from Beginning</button>
                <button onClick={removeNodeFromEnd} className="control-button">Remove from End</button>
                <button onClick={removeNodeWithValue} className="control-button">Remove Specific Value</button>
            </div>

            <div className="cloud-message">
                <span className="message-text">{message}</span>
            </div>
        </div>
    );
}

export default SinglyLinkedList;
