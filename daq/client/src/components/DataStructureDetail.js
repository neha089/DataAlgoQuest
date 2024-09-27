import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StackVisualization from './StackVisualization';
import QueueVisualization from './QueueVisualization';
import BinaryTreeVisualization from './BinaryTreeVisualization';
import LinkedListVisualization from './LinkedListVisualization';
import stackImage from '../assets/ds-image/stack.jpg';
import queueImage from '../assets/ds-image/queue.jpg';
import listImage from '../assets/ds-image/linked-list.jpg';
const dataStructures = [
    {
        title: 'Stack',
        notes: [
            'Stacks are Last In, First Out (LIFO) data structures. They are used for function calls, parsing expressions, etc.',
            'Common operations include push, pop, and peek.',
            'Stacks are crucial in algorithm implementation, such as backtracking algorithms and depth-first search.',
            'They can be implemented using arrays or linked lists.',
            'Memory management during function calls relies on stacks to store local variables.',
            'Stacks can also be used in web browsers to manage history and navigation.',
            'Understanding stacks is fundamental for many computer science concepts, including recursion.'
        ],
        // Added metadata for the stack
        definition: "The stack data structure is a linear data structure that accompanies a principle known as LIFO (Last In First Out).",
        example:stackImage,
        properties: [
            'The insertion and deletion happens at the same end i.e from the top of the stack',
            'Stack is implemented through Array or Linked list',
            'If the allocated space for stack is full, and any attempt to add more elements will lead to stack overflow. The opposite, any attempt to extract elements on an empty stack leads to stack underflow'
        ],
        operations: ['Push', 'Pop', 'Peek'],
        applications: [
            'Expression evaluation and conversion',
            'Backtracking',
            'Function call (call stack function)',
            'Parentheses checking',
            'String reversal',
            'Syntax parsing',
            'Memory management',
            'The celebrity problem',
            'Iterative Tower of Hanoi',
            'Find next greater elements (frequency)(left - right)'
        ],
        advantages: [
            'Efficient data management: Stack helps you manage the data in a LIFO manner.',
            'Efficient management of functions: When a function is called, the local variables are stored in the stack, and it is automatically destroyed once returned.',
            'Control over memory',
            'Smart memory management',
            'Not easily corrupted',
            'Does not allow resizing of variables',
        ],
        disadvantages: [
            'Limited memory size',
            'Chances of stack overflow',
            'Random access not possible',
            'Unreliable',
            'Undesired termination'
        ]
    },
    {
        title: 'Queue',
        notes: [
            'Queues are First In, First Out (FIFO) data structures.',
            'They are used in scheduling and handling requests.',
            'Common operations include enqueue, dequeue, and front.',
            'Queues are essential in managing tasks in operating systems, such as job scheduling.',
            'They are used in breadth-first search algorithms to explore nodes level by level.',
            'Implementations of queues include circular queues, priority queues, and deque (double-ended queue).',
            'Queues are widely used in real-world scenarios like print spooling and asynchronous data transfer.',
            'Learning about queues is critical for understanding various algorithms and data processing tasks.'
        ],
        definition:  "A Queue is a linear data structure which follows the particular order inwhich the operations are performed. The order is FIFO(First In Firts Out).",
        example:queueImage,
        properties: [
            'The insertion (enqueue) happens at the rear, and the deletion (dequeue) happens at the front of the queue.',
            'Queue follows the First In, First Out (FIFO) principle, meaning the first element inserted is the first to be removed.',
            'Queue can be implemented using arrays, linked lists, or circular arrays.If the queue is full and an attempt is made to insert an element, it leads to a queue overflow. Similarly, removing an element from an empty queue leads to a queue underflow.'
        ],
        operations: [ 'Enqueue', 'Dequeue', 'Peek'],
        applications: [
            'Multi programming:  Multi programming means when multiple programs are running in the main memory. It is essential to organize these multiple programs are organized as queues',
            'Network:  In a network , a queue is used in devices such as a router or a switch. Another application of a queue is a mail queue',
            'Job Scheduling:  The computer has a task to execute a particular number of jobs that are scheduled to be execute one after another. These jobs are assigned one by one to the processor which is organized using a queue',
            'Shared resoures:  Queues are used as waiting lists for a single resoure',
            'Breadth first traversal or BFS',
            'Level order tree traversal',
            'Reverse a path in BST using queue',
            'Construct complete binary tree from its link list representation',
            'Number of siblings of a given Node in n-ary tree',
            'Zig-zag tree traversal'
        ],
        advantages: [
            'A large amount of data can be managed efficiently with ease',
            'Operations such as insertion and deletion can be performed with ease as it follows the first in first out rule',
            'Queues are useful when a particular service is used by multiple customers',
            'Queues are fast in speed for data inter process communication',
            'Queues can be used in the implementation of other data structures'
        ],
        disadvantages: [
           'The operations such as insertion and deletion of elements from the middle are time consuming',
     'Limited space',
     'In classical queue, a new element can only be inserted when the existing elements are deleted from the queue',
     'Searching an elements takes O(N) time',
     'Maximum size of a queue must be defined prior'
        ]
    },
    {
        title: 'Tree',
        notes: [
            'Trees are hierarchical data structures used for organizing data efficiently.',
            'They are fundamental in databases and file systems.',
            'Common types include binary trees, AVL trees, and red-black trees.',
            'Trees provide efficient search, insert, and delete operations, especially in binary search trees.',
            'They are used in representing hierarchical data like file directories, organizational structures, and more.',
            'Trees facilitate efficient information retrieval in applications such as XML parsing and expression parsing.',
            'Learning tree structures is vital for understanding more complex data structures like heaps and tries.',
            'The concept of balanced trees is crucial for maintaining efficiency in dynamic datasets.'
        ],
        
    },
    {
        title: 'Linked List',
        notes: [
            'A Linked List is a linear data structure where elements, called nodes, are stored in a sequence. Each node contains two parts: data and a reference (or pointer) to the next node in the sequence.',
            'Linked lists are dynamic in size, allowing efficient insertion and deletion of elements. Unlike arrays, linked lists do not require contiguous memory, making them more flexible for memory management.',
            'There are different types of linked lists, including singly linked, doubly linked, and circular linked lists.'
        //     'A singly linked list is a linear data structure consisting of nodes, where each node contains data and a reference to the next node.',
        //     'Unlike arrays, linked lists do not require contiguous memory allocation, making them more flexible for dynamic memory usage.',
        //     'Insertion and deletion of nodes can be done efficiently in O(1) time if done at the head or tail.',
        //     'However, searching for a specific element in a singly linked list requires O(n) time as there is no direct access to nodes.',
        //     'Singly linked lists are often used in applications like implementing stacks, queues, and dynamic memory management.',
        //     'They are memory efficient for large datasets since they allocate memory only as needed.',
        //     'Singly linked lists allow easy implementation of algorithms that require dynamic data structures, such as merging and sorting.',
        //     'Understanding singly linked lists helps in grasping more complex structures like circular and doubly linked lists.'
        ],
        definition: "A linked list is a linear data structure as well as a dynamic data structure. A linked list consists of nodes where each node contains a data field and reference(address) to the next node in the list",
        example:listImage,
        properties: [
            'It can be visualized as a chain of nodes where each node contains a data field and reference(address) to the next node',
     'The first node of the linked list is called Head of the linked list. Through head, we can performe differnt operations on the linked list',
     'The last node of the linked list is pointing to the NUll which indicates that it is the last node(TAIl)',
     'Unlike arrays, linked list elements are not stored at contiguous memory locations',
     'Linked lists are dynamic in nature'],
     types: [
        'Single linked list:  A single linked list is the most common type of linked list. Each node have data  and an address field that contains a reference to the next node',
        'Double linked list:  In the double linked list, there are three fields that are the previous pointer,that contain a reference to the previous node.Then there is the data, and last you have the next pointer, that containes a reference to the next node. Thus you can go in both direction',
        'Circular linked list:  The circular linked listis extremely similar to the single linked list. The only difference is that the last node is connected with first node, forming a circular loop in the circular linked list'
   ],
        operations: [ 'Insertion', 'Deletion','Searching'],
        applications: [ 'Implementation of stack and queue',
            'Implementation of graphs: adjacency list representation of graphs is most popular which is uses linked list to store adjacent vertices',
            'Dynamic memory allocation: we use linked list of free blocks',
            'Maintaining directory of names',
            'Performing arithmetic operations on long integers',
            'Manipulation of polynomials by storing constant in the node of linked list',
            'Representation of sparse matrix',
            'Next and previous operations (Image viewer, Music player, web browser etc)',
            'Redo and undo functionality',
            'Most recently used section is represented by double linked list',
            'Binary tree can also be applied by double linked list'
        ],
        advantages: [
           'Dynamic data structure:  A linked list is a dynamic arrangement so it can be grow and shrink at rntime by allocating and deallocating memory. So there is no need to give the initial size of the linked list',
     'No memory wastage:  In the linked list, efficient memory utilization can be achieved since the size of the linked list increase or decrease at runtime so there is no memory wastage and there is no need to previous the allocate memory',
     'Implementation: Linear data structures like stack and queue are often easily implemented using linked list',
     'Insertion and deletion:  Insertion and deletion operations are quite easier in the linked list. There is no need to shift elements after the insertion or deletion of the element only the address present in next pointer needs to be update'
         ],
        disadvantages: [
            'Memory usage:  More memory is required in the linked list as compared to an array. Because in linked list a pointer is also required to store the address of the next element and it requires extra memory for itself',
     'Traversal: In a linked list traversal is more time consuming as compared to an array. Direct access to an element is not possible in linked list as in an array by index',
     'Reverse traversing:  In a single linked list reverse traversal is not possible but in the case of double linked list, it can be possible',
     'Random access: Random access is not possible in a linked list due to its dynamic memory allocation',
        ]
    },
    // {
    //     title: 'Doubly Linked List',
    //     notes: [
    //         'A doubly linked list is a linear data structure where each node contains data, a reference to the next node, and a reference to the previous node.',
    //         'Bidirectional traversal is possible in a doubly linked list, allowing traversal both forward and backward through the list.',
    //         'Insertion and deletion can be efficiently performed at both the head and the tail in O(1) time.',
    //         'More memory is required compared to a singly linked list because each node stores an additional reference (to the previous node).',
    //         'Doubly linked lists are used in various applications such as browser history, undo/redo functionality in software, and in-memory management.',
    //         'They facilitate easier implementation of complex operations like sorting and reversing the list.',
    //         'Doubly linked lists provide greater flexibility for certain operations compared to singly linked lists.',
    //         'Mastering doubly linked lists is important for understanding concepts like skip lists and self-balancing trees.'
    //     ],
    // }
];


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

    const foundDataStructure = dataStructures.find(ds => ds.title === name);

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
            case 'Linked List':
                return <LinkedListVisualization />;
            default:
                return <p>No visualization available for this data structure.</p>;
        }
    };

    return (
        <div className="container">
            <h1>{dataStructure.name}</h1>
            <div dangerouslySetInnerHTML={{ __html: foundDataStructure.definition }} /><br/>
            <ul>
                {foundDataStructure.notes.map((note, index) => (
                    <li key={index}>{note}</li>
                ))}
            </ul>
            <h3>Example</h3>
            <img className="exampleImage" src={foundDataStructure.example} alt={`${foundDataStructure.title} example`} />
           
            <h3>Properties</h3>
            <ul>
                {foundDataStructure.properties.map((prop, index) => (
                    <li key={index}>{prop}</li>
                ))}
            </ul>
            <h3>Operations</h3>
            <ul>
                {foundDataStructure.operations.map((operation, index) => (
                    <li key={index}>{operation}</li>
                ))}
            </ul>
            {renderVisualization()}
            <h3>Applications</h3>
            <ul>
                {foundDataStructure.applications.map((app, index) => (
                    <li key={index}>{app}</li>
                ))}
            </ul>
            <h3>Advantages</h3>
            <ul>
                {foundDataStructure.advantages.map((adv, index) => (
                    <li key={index} dangerouslySetInnerHTML={{ __html: adv }} />
                ))}
            </ul>
            <h3>Disadvantages</h3>
            <ul>
                {foundDataStructure.disadvantages.map((dis, index) => (
                    <li key={index}>{dis}</li>
                ))}
            </ul>

            <div className="button-container">
                <button onClick={handleStartQuiz} className="start-button">Start Quiz</button>
                <button onClick={handleStartChallenge} className="start-button">Start Challenges</button>
            </div>

            <a href="/learning-paths" className="back-button">Back to Learning Paths</a>
        </div>
    );
};

export default DataStructureDetail;