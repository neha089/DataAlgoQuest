import React from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import './style.css'; // Import your CSS styles

const DataStructureDetail = () => {
    const { id } = useParams(); // Get the id from the route parameters

    const dataStructures = [
        {
            id: 1,
            title: 'Stack',
            notes: [
                'Stacks are Last In, First Out (LIFO) data structures.',
                'They are used for function calls, parsing expressions, etc.',
                'Common operations include push, pop, and peek.'
            ]
        },
        {
            id: 2,
            title: 'Queue',
            notes: [
                'Queues are First In, First Out (FIFO) data structures.',
                'They are used in scheduling and handling requests.',
                'Common operations include enqueue, dequeue, and front.'
            ]
        },
        {
            id: 3,
            title: 'Tree',
            notes: [
                'Trees are hierarchical data structures used for organizing data efficiently.',
                'They are fundamental in databases and file systems.',
                'Common types include binary trees, AVL trees, and red-black trees.'
            ]
        },
        // Add more data structures as needed
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
            <a href="/learning-paths" className="back-button">Back to Learning Paths</a>
        </div>
    );
}

export default DataStructureDetail;
