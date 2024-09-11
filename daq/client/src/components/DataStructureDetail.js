import React from 'react';
import { useParams } from 'react-router-dom';
import './style.css';
import StackVisualization from './StackVisualization'; // Import the stack visualization component
import QueueVisualization from './QueueVisualization'; // Import the queue visualization component
import DataStructureQuiz from './DataStructureQuiz'; // Import the quiz component
import BinaryTreeVisualization from './BinaryTreeVisualization'; // Import the quiz component
import SinglyLinkedListVisualization from './SinglyLinkedListVisualization';
import DoublyLinkedListVisualization from './DoublyLinkedListVisualization';

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
            ],
            challenges: [
                {
                    title: 'Implement Stack using Arrays',
                    difficulty: 'Easy',
                    link: 'https://example.com/stack-challenge-1',
                },
                {
                    title: 'Balanced Parentheses using Stack',
                    difficulty: 'Medium',
                    link: 'https://example.com/stack-challenge-2',
                }
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
            ],
            challenges: [
                {
                    title: 'Implement Queue using Arrays',
                    difficulty: 'Easy',
                    link: 'https://example.com/queue-challenge-1',
                },
                {
                    title: 'Circular Queue Implementation',
                    difficulty: 'Medium',
                    link: 'https://example.com/queue-challenge-2',
                }
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
        {
            id: 4,
            title: 'Singly Linked List',
            notes: [
                'A singly linked list is a linear data structure consisting of nodes, where each node contains data and a reference to the next node.',
                'Unlike arrays, linked lists do not require contiguous memory allocation, making them more flexible for dynamic memory usage.',
                'Insertion and deletion of nodes can be done efficiently in O(1) time if done at the head or tail.',
                'However, searching for a specific element in a singly linked list requires O(n) time as there is no direct access to nodes.',
                'Singly linked lists are often used in applications like implementing stacks, queues, and dynamic memory management.'
            ],
            questions: [
                {
                    question: 'What is the time complexity for searching an element in a singly linked list?',
                    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
                    correctAnswer: 'O(n)',
                },
                {
                    question: 'Which of the following operations on a singly linked list takes O(1) time?',
                    options: ['Inserting at the head', 'Searching for an element', 'Inserting at the middle', 'Accessing the last node'],
                    correctAnswer: 'Inserting at the head',
                },
                {
                    question: 'What does each node in a singly linked list contain?',
                    options: ['Data and pointer to the previous node', 'Data and pointer to the next node', 'Only data', 'Pointer to both previous and next nodes'],
                    correctAnswer: 'Data and pointer to the next node',
                },
                {
                    question: 'Which of the following is a disadvantage of a singly linked list?',
                    options: ['Requires contiguous memory allocation', 'Difficult to insert at the head', 'Cannot be traversed backwards', 'Fixed size'],
                    correctAnswer: 'Cannot be traversed backwards',
                },
            ]
        },
        {
            id: 5,
            title: 'Doubly Linked List',
            notes: [
                'A doubly linked list is a linear data structure where each node contains data, a reference to the next node, and a reference to the previous node.',
                'Bidirectional traversal is possible in a doubly linked list, allowing traversal both forward and backward through the list.',
                'Insertion and deletion can be efficiently performed at both the head and the tail in O(1) time.',
                'More memory is required compared to a singly linked list because each node stores an additional reference (to the previous node).',
                'Doubly linked lists are used in various applications such as browser history, undo/redo functionality in software, and in-memory management.'
            ],
            questions: [
                {
                    question: 'What additional pointer does each node in a doubly linked list contain?',
                    options: ['Pointer to the next node', 'Pointer to the previous node', 'Pointer to both the next and previous nodes', 'Only data'],
                    correctAnswer: 'Pointer to both the next and previous nodes',
                },
                {
                    question: 'What is an advantage of a doubly linked list over a singly linked list?',
                    options: ['Less memory usage', 'Can be traversed in both directions', 'Easier to implement', 'Searching is faster'],
                    correctAnswer: 'Can be traversed in both directions',
                },
                {
                    question: 'Which operation on a doubly linked list takes O(1) time?',
                    options: ['Searching for an element', 'Inserting at the head', 'Inserting at a specific position', 'Accessing a middle node'],
                    correctAnswer: 'Inserting at the head',
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

            {dataStructure.title === 'Stack' && <StackVisualization />}
            {dataStructure.title === 'Queue' && <QueueVisualization />}
            
            {dataStructure.title === 'Tree' && <BinaryTreeVisualization/>}
            {dataStructure.title === 'Singly Linked List' && <SinglyLinkedListVisualization/>}
            {dataStructure.title === 'Doubly Linked List' && <DoublyLinkedListVisualization/>}

            
            {dataStructure.questions && (
                <DataStructureQuiz questions={dataStructure.questions} />
            )}

            {dataStructure.challenges && (
                <CodingChallenges challenges={dataStructure.challenges} />
            )}

            <a href="/learning-paths" className="back-button">Back to Learning Paths</a>
        </div>
    );
}

export default DataStructureDetail;
