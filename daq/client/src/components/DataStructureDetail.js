import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StackVisualization from './StackVisualization';
import QueueVisualization from './QueueVisualization';
import BinaryTreeVisualization from './BinaryTreeVisualization';
import SinglyLinkedListVisualization from './SinglyLinkedListVisualization';
import DoublyLinkedListVisualization from './DoublyLinkedListVisualization';

const DataStructureDetail = () => {
    const { name } = useParams();
    const [dataStructure, setDataStructure] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/datastructures/find/${name}`);
            if (!response.ok) {
                throw new Error('Data structure not found');
            }
            const data = await response.json();
            setDataStructure(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [name]);

    const handleStartQuiz = () => {
        if (dataStructure && dataStructure._id) {
            navigate(`/data-structure/${dataStructure._id}/quiz`);
        } else {
            console.error('Data structure or ID is not available');
        }
    };
    const handleStartChallenge = () => {
        if (dataStructure && dataStructure._id) {
            navigate(`/data-structure/${dataStructure._id}/Challenges`);
        } else {
            console.error('Data structure or ID is not available');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!dataStructure) return <p>Data not available</p>;

    const renderVisualization = () => {
        switch (dataStructure.name) {
            case 'Stack':
                return <StackVisualization />;
            case 'Queue':
                return <QueueVisualization />;
            case 'Tree':
                return <BinaryTreeVisualization />;
            case 'Singly Linked List':
                return <SinglyLinkedListVisualization />;
            case 'Doubly Linked List':
                return <DoublyLinkedListVisualization />;
            default:
                return <p>No visualization available for this data structure.</p>;
        }
    };

    return (
        <div>
            <h1>{dataStructure.name}</h1>
            <p>{dataStructure.description}</p>

            {renderVisualization()}

            <div className="button-container">
                <button onClick={handleStartQuiz} className="start-button">Start Quiz</button>
                <button onClick={handleStartChallenge} className="start-button">Start Challenges</button>
            </div>

            <a href="/learning-paths" className="back-button">Back to Learning Paths</a>
        </div>
    );
};

export default DataStructureDetail;
