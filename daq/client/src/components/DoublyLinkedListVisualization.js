import React, { useState } from 'react';
import './style.css'; // Custom CSS for styling

// Define the Node structure for Doubly Linked List
class ListNode {
    constructor(value) {
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}

const DoublyLinkedList = () => {
    const [head, setHead] = useState(null); 
    const [tail, setTail] = useState(null);
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
        if (head === null) {
            setHead(newNode);
            setTail(newNode);
        } else {
            newNode.next = head;
            head.prev = newNode;
            setHead(newNode);
        }
        setSize(size + 1);
        setMessage(`Added ${inputValue} at the beginning`);
    };

    // Add node at the end
    const addNodeAtEnd = () => {
        const newNode = new ListNode(inputValue);
        if (tail === null) {
            setHead(newNode);
            setTail(newNode);
        } else {
            tail.next = newNode;
            newNode.prev = tail;
            setTail(newNode);
        }
        setSize(size + 1);
        setMessage(`Added ${inputValue} at the end`);
    };

    // Add node before a specific value
    const addNodeBeforeValue = () => {
        if (!head) {
            setMessage('List is empty');
            return;
        }
        if (head.value === specificValue) {
            addNodeAtBeginning();
            return;
        }
        let current = head;
        while (current !== null && current.value !== specificValue) {
            current = current.next;
        }
        if (current !== null) {
            const newNode = new ListNode(inputValue);
            newNode.prev = current.prev;
            newNode.next = current;
            if (current.prev) {
                current.prev.next = newNode;
            }
            current.prev = newNode;
            setSize(size + 1);
            setMessage(`Added ${inputValue} before ${specificValue}`);
        } else {
            setMessage(`${specificValue} not found in the list`);
        }
    };

    // Add node after a specific value
    const addNodeAfterValue = () => {
        let current = head;
        while (current !== null && current.value !== specificValue) {
            current = current.next;
        }
        if (current !== null) {
            const newNode = new ListNode(inputValue);
            newNode.next = current.next;
            newNode.prev = current;
            if (current.next) {
                current.next.prev = newNode;
            } else {
                setTail(newNode); // Update tail if added at the end
            }
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
        if (head.next) {
            setHead(head.next);
            head.prev = null;
        } else {
            setHead(null);
            setTail(null);
        }
        setSize(size - 1);
        setMessage(`Removed ${removedValue} from the beginning`);
    };

    // Remove node from the end
    const removeNodeFromEnd = () => {
        if (tail === null) {
            setMessage('List is empty, cannot remove.');
            return;
        }
        const removedValue = tail.value;
        if (tail.prev) {
            const newtail=tail.prev;
            newtail.next=null;
            setTail(newtail);
        } else {
            setHead(null);
            setTail(null);
        }
        setSize(size - 1);
        setMessage(`Removed ${removedValue} from the end`);
    };

    // Remove node with a specific value
    const removeNodeWithValue = () => {
        let current = head;
        while (current !== null && current.value !== specificValue) {
            current = current.next;
        }
        if (current !== null) {
            if (current === head) {
                removeNodeFromBeginning();
            } else if (current === tail) {
                removeNodeFromEnd();
            } else {
                current.prev.next = current.next;
                current.next.prev = current.prev;
                setSize(size - 1);
                setMessage(`Removed node with value ${specificValue}`);
            }
        } else {
            setMessage(`${specificValue} not found in the list`);
        }
    };

    return (
        <div className="doublylinkedlist-visualization">
            <h2>Doubly Linked List</h2>
            <div className="list-container">
                {renderList().map((node, index) => (
                    <div key={index} className="list-node">
                        <div className="node-value">{node.value}</div>
                        {node.next && <div className="arrow">⇔</div>}
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

export default DoublyLinkedList;
