
import React from 'react';
import { useParams } from 'react-router-dom';
import './style.css';
import StackVisualization from './StackVisualization'; // Import the stack visualization component
import QueueVisualization from './QueueVisualization'; // Import the queue visualization component
import DataStructureQuiz from './DataStructureQuiz'; // Import the quiz component
import BinaryTreeVisualization from './BinaryTreeVisualization'; // Import the quiz component


const DataStructureDetail = () => {
    const { id } = useParams();

    const dataStructures = [
        {
            id: 1,
            title: 'Stack',
            notes: [
                'Stacks are Last In, First Out (LIFO) data structures.',
                'They are used for function calls, parsing expressions, etc.',
                'Common operations include push, pop, and peek.'
            ],
            questions: [
                {
                    question: 'What does LIFO stand for?',
                    options: ['Last In, First Out', 'First In, First Out', 'Last In, Last Out', 'First In, Last Out'],
                    correctAnswer: 'Last In, First Out',
                },
                {
                    question: 'Which of the following operations is used to add an item to a stack?',
                    options: ['Push', 'Pop', 'Enqueue', 'Dequeue'],
                    correctAnswer: 'Push',
                },
            ]
        },
        {
            id: 2,
            title: 'Queue',
            notes: [
                'Queues are First In, First Out (FIFO) data structures.',
                'They are used in scheduling and handling requests.',
                'Common operations include enqueue, dequeue, and front.'
            ],
            questions: [
                {
                    question: 'What does FIFO stand for?',
                    options: ['First In, First Out', 'First In, Last Out', 'Fast In, Fast Out', 'Few In, Few Out'],
                    correctAnswer: 'First In, First Out',
                },
                {
                    question: 'Which of the following operations is used to remove an item from a queue?',
                    options: ['Dequeue', 'Push', 'Pop', 'Enqueue'],
                    correctAnswer: 'Dequeue',
                },
            ]
        },
        {
            id: 3,
            title: 'Tree',
            notes: [
                'Trees are hierarchical data structures used for organizing data efficiently.',
                'They are fundamental in databases and file systems.',
                'Common types include binary trees, AVL trees, and red-black trees.'
            ],
            questions: [
                {
                    question: 'What type of tree maintains balance using rotations?',
                    options: ['Binary Search Tree', 'AVL Tree', 'Red-Black Tree', 'B-Tree'],
                    correctAnswer: 'AVL Tree',
                },
                {
                    question: 'Which tree is used to maintain sorted data and allow binary search?',
                    options: ['Binary Search Tree', 'Trie', 'Heap', 'Graph'],
                    correctAnswer: 'Binary Search Tree',
                },
            ]
        },
    ];

    const dataStructure = dataStructures.find(ds => ds.id === parseInt(id));

    return (
        <div className="data-structure-detail">
            <h1 className="data-structure-title">{dataStructure.title}</h1>
            <div className="notes-container">
                {dataStructure.notes.map((note, index) => (
                    <p key={index} className="note">{note}</p>
                ))}
            </div>

            {/* Conditionally render the stack or queue visualization based on the data structure */}
            {dataStructure.title === 'Stack' && <StackVisualization />}
            {dataStructure.title === 'Queue' && <QueueVisualization />}
            
            {dataStructure.title === 'Tree' && <BinaryTreeVisualization/>}
            
            {/* Render the quiz if the data structure has associated questions */}
            {dataStructure.questions && (
                <DataStructureQuiz questions={dataStructure.questions} />
            )}

            <a href="/learning-paths" className="back-button">Back to Learning Paths</a>
        </div>
    );
}

export default DataStructureDetail;
