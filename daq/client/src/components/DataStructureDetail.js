import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StackVisualization from './StackVisualization';
import QueueVisualization from './QueueVisualization';
import TreeVisualization from './TreeVisualization';
import LinkedListVisualization from './LinkedListVisualization';
import stackImage from '../assets/ds-image/stack.jpg';
import queueImage from '../assets/ds-image/queue.jpg';
import listImage from '../assets/ds-image/linked-list.jpg';
import treeImage from '../assets/ds-image/tree.jpg';
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
    {
        title: 'Tree',
        notes: [
    'Node:  Node is the main component of a tree that stores the data along with the links to other nodes',
    'Edge:  Edge( also called branch) connects two nodes of a tree. A node can have more than one edge',
    'Parent:  Parent node is a predecessor to any other node. In simple words, it is a node in the tree that has branches to other nodes',
    'Child:  The node which is connected below to another node is called a child of that node. All nodes except the root node are child nodes',
    'Root:  The first node of the tree which originates it is called the root of the tree. A tree can have only one root',
    'Leaf node(External node):  Nodes with no child are called leaf nodes or external nodes',
    'Internal node(Non-Leaf node):  Nodes with at least one child is called an internal node or non-leaf nodes',
    'Siblings:  Nodes having the same parent are called siblings',
    'Cousins:  The nodes belonging to the same level with different parent nodes',
    'Degree: Degree of a node is defined as the number of children of that node. The degree of the tree is the highest degree of a node among all the nodes',
    'Path:  The nodes in the tree has to be reachable from other nodes through a unique sequence of edges called path. The number of edges in a path is called the length of the path',
    'Level of a node:  The level of a node is defined as the number of edges in the unique path between the root and the node',
    'Subtree:  A tree formed by a node and all of its descendants in the tree is called a subtree',    ],
        definition:"A tree is a non-linear type of data structure that organizes data hierarchically. It consists of nodes connected by edges. Each node contains a value and may or may not have a child node" ,
        example:treeImage,
        properties: [
    'Number of edges:  An edge can be defined as the connection between two nodes. If a tree has N nodes then it will have (N-1) edges. There is only one path from each node to any other node of the tree',
    'Depth of a node:  The depth of a node is defined as the length of the path from the root to that node. Each edge adds 1 unit of length to the path. So, it can also be defined as the number of edges in the path from the root of the tree to the node',
    'Height of a node:  The height of a node can be defined as the length of the longest path from the node to a leaf node of the tree',
    'Height of the tree:  The height of a tree is the length of the longest path from the root of the tree to a leaf node of the tree',
    'Degree of a Node:  The total count of subtrees attached to that node is called the degree of the node. The degree of a leaf node must be 0. The degree of a tree is the maximum degree of a node among all the nodes in the tree',
    'Traversing in a tree is done by depth first search and breadth first search algorithm',
    'It has no loop and no circuit',
    'It has no self-loop',
    'Its hierarchical model'],
     types: [
       'Binary Tree', 'Binary Search Tree', 'AVL Tree', 'Heap Tree'
   ],
        operations: [ 'Insertion', 'Deletion','Searching'],
        applications: [
            'Trees can be used to store data which are in hierarchical form',
    'Different types of trees are used in various fields like in databases, computer graphics, computer networks',
    'Tree data structure are used by operating system to manage file directory',
    'Databases use tree data structure for indexing',
    'Tree data structure is used in file directory management',
    'DNS uses tree data structure',
    'Trees are used in several games like moves in chess',
    'Decision based algorithms in machine learning uses tree algorithms',
 
        ],
        advantages: [
          'Trees provide hierarchical representation for the data',
    'Trees are dynamic in nature so the number of nodes are not limited',
    'Insertion and deletion in a tree can be done in moderate time',         ],
        disadvantages: [
            'Some trees can only be stored using sequential or chained storage',
        ]
    },
    {
        title: 'BinaryTree',
        notes: ['Node:  Node is the main component of a tree that stores the data along with the links to other nodes',
    'Edge:  Edge( also called branch) connects two nodes of a tree. A node can have more than one edge',
    'Parent:  Parent node is a predecessor to any other node. In simple words, it is a node in the tree that has branches to other nodes',
    'Child:  The node which is connected below to another node is called a child of that node. All nodes except the root node are child nodes',
    'Root:  The first node of the tree which originates it is called the root of the tree. A tree can have only one root',
    'Leaf node(External node):  Nodes with no child are called leaf nodes or external nodes',
    'Internal node(Non-Leaf node):  Nodes with at least one child is called an internal node or non-leaf nodes',
    'Siblings:  Nodes having the same parent are called siblings',
    'Cousins:  The nodes belonging to the same level with different parent nodes',
    'Degree: Degree of a node is defined as the number of children of that node. The degree of the tree is the highest degree of a node among all the nodes',
    'Path:  The nodes in the tree has to be reachable from other nodes through a unique sequence of edges called path. The number of edges in a path is called the length of the path',
    'Level of a node:  The level of a node is defined as the number of edges in the unique path between the root and the node',
    'Subtree:  A tree formed by a node and all of its descendants in the tree is called a subtree',   
        ],
    defination:
    'A binary tree is a tree data structure in which each node has at most two children, which are referred to as the left child and the right child.',        example:treeImage,
        properties: [
            'The maximum number of nodes at level ‘l’ of a binary tree is 2**l',
    'The Maximum number of nodes in a binary tree of height ‘h’ is 2**h – 1',
    'In a Binary Tree with N nodes, minimum possible height or the minimum number of levels is Log2(N+1)',
    'A Binary Tree with L leaves has at least | Log2L |+ 1   levels',
    ' In Binary tree where every node has 0 or 2 children, the number of leaf nodes is always one more than nodes with two children',
    'In a non empty binary tree, if n is the total number of nodes and e is the total number of edges, then e = n-1',
],
     types: [
    'Full Binary Tree:  A Binary Tree is a full binary tree if every node has 0 or 2 children. The following are the examples of a full binary tree. We can also say a full binary tree is a binary tree in which all nodes except leaf nodes have two children. It is also known as a proper binary tree',
    'Complete Binary Tree:  A Binary Tree is a Complete Binary Tree if all the levels are completely filled except possibly the last level and the last level has all keys as left as possible.A complete binary tree is just like a full binary tree, but with two major differences.(I)Every level must be completely filled. (II)All the leaf elements must lean towards the left',
    'Perfect Binary Tree:  A Binary tree is a Perfect Binary Tree in which all the internal nodes have two children and all leaf nodes are at the same level',
    'Balanced Binary Tree:  A binary tree is balanced if the height of the tree is O(Log n) where n is the number of nodes. For Example, the AVL tree maintains O(Log n) height by making sure that the difference between the heights of the left and right subtrees is at most 1. Red-Black trees maintain O(Log n) height by making sure that the number of Black nodes on every root to leaf paths is the same and there are no adjacent red nodes. Balanced Binary Search trees are performance-wise good as they provide O(log n) time for search, insert and delete',
    'A degenerate (or pathological) tree:  A Tree where every internal node has one child. Such trees are performance-wise same as linked list.A degenerate or pathological tree is the tree having a single child either left or right',
    'Skewed Binary Tree:  A skewed binary tree is a pathological/degenerate tree in which the tree is either dominated by the left nodes or the right nodes. Thus, there are two types of skewed binary tree: left-skewed binary tree and right-skewed binary tree',
    ],
        operations: [ 'Insertion', 'Deletion','Searching'],
        applications: [
           'Huffman coding tree is an application of binary trees that are used in data compression algorithms',
    'In compilers, Expression Trees are used which are applications of binary trees',
    'Priority Queue is another application of binary tree that is used to search maximum or minimum in O(log N) time complexity',
    'Represent hierarchical data',
    'Used in editing software like Microsoft Excel and spreadsheets',
    'Useful for indexing segmented at the database is useful in storing cache in the system',
    'Syntax trees are used for most famous compilers for programming like GCC, and AOCL to perform arithmetic operations',
    'For implementing priority queues',
    'Used to find elements in less time (binary search tree)',
    'Used to enable fast memory allocation in computers',
    'To perform encoding and decoding operations',
    'DOM in HTML',
    'File explorer',
    'Used as the basic data structure in Microsoft Excel and spreadsheets',
    'Routing Algorithms',
    'Evaluate an expression',
        ],
        advantages: [
          'The searching operation in a binary tree is very fast',
    'The representation of a binary tree is simple and easy to understand',
    'Traversing from a parent node to its child node and vice-versa is efficiently done',
    'Simple to implement',
    'Easy to understand',
    'Reflect structural relationships that are present in the data set',
    'Executions are fast',
    'Store an arbitrary number of data values',   ],
        disadvantages: [
'In binary tree traversals, there are many pointers that are null and hence useless',
    'The access operation in a Binary Search Tree (BST) is slower than in an array',
    'A basic option is dependent on the height of the tree',
    'Deletion node not easy',
    'A basic option is based on the height of tree',        ]
    },
   


   
    
   
];


const DataStructureDetail = () => {
    const { name } = useParams();
    const [dataStructure, setDataStructure] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem('token'); // assuming JWT token is stored in localStorage
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

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
                return <TreeVisualization />;
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
            <button
                onClick={isLoggedIn ? handleStartQuiz : null}
                className="start-button"
                disabled={!isLoggedIn} // Disable button if not logged in
            >
                Start Quiz
            </button>

            <button
                onClick={isLoggedIn ? handleStartChallenge : null}
                className="start-button"
                disabled={!isLoggedIn} // Disable button if not logged in
            >
                Start Challenges
            </button>

            {!isLoggedIn && <p>Please log in to start the quiz or challenge.</p>}
            </div>
            <button onClick={()=>navigate(-1)}>Back</button>
            {/* <a href="/learning-paths" className="back-button">Back to Learning Paths</a> */}
        </div>
    );
};

export default DataStructureDetail;