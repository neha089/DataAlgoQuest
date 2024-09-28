import {useNavigate } from 'react-router-dom';
import BinaryTreeVisualization from './BinaryTreeVisualization';
import BinaryTreeImage from '../assets/ds-image/binary-tree.jpg';

const binaryTree = {
    defination:
      'A binary tree is a tree data structure in which each node has at most two children, which are referred to as the left child and the right child.',
    example: BinaryTreeImage,
    properties: [
      'The maximum number of nodes at level ‘l’ of a binary tree is 2**l',
      'The Maximum number of nodes in a binary tree of height ‘h’ is 2**h – 1',
      'In a Binary Tree with N nodes, minimum possible height or the minimum number of levels is Log2(N+1)',
      'A Binary Tree with L leaves has at least | Log2L |+ 1   levels',
      ' In Binary tree where every node has 0 or 2 children, the number of leaf nodes is always one more than nodes with two children',
      'In a non empty binary tree, if n is the total number of nodes and e is the total number of edges, then e = n-1',
    ],
    operations: [],
    type: [
      '<b>Full Binary Tree</b>:  A Binary Tree is a full binary tree if every node has 0 or 2 children. The following are the examples of a full binary tree. We can also say a full binary tree is a binary tree in which all nodes except leaf nodes have two children. It is also known as a proper binary tree',
      '<b>Complete Binary Tree</b>:  A Binary Tree is a Complete Binary Tree if all the levels are completely filled except possibly the last level and the last level has all keys as left as possible.A complete binary tree is just like a full binary tree, but with two major differences.(I)Every level must be completely filled. (II)All the leaf elements must lean towards the left',
      '<b>Perfect Binary Tree</b>:  A Binary tree is a Perfect Binary Tree in which all the internal nodes have two children and all leaf nodes are at the same level',
      '<b>Balanced Binary Tree</b>:  A binary tree is balanced if the height of the tree is O(Log n) where n is the number of nodes. For Example, the AVL tree maintains O(Log n) height by making sure that the difference between the heights of the left and right subtrees is at most 1. Red-Black trees maintain O(Log n) height by making sure that the number of Black nodes on every root to leaf paths is the same and there are no adjacent red nodes. Balanced Binary Search trees are performance-wise good as they provide O(log n) time for search, insert and delete',
      '<b>A degenerate (or pathological) tree</b>:  A Tree where every internal node has one child. Such trees are performance-wise same as linked list.A degenerate or pathological tree is the tree having a single child either left or right',
      '<b>Skewed Binary Tree</b>:  A skewed binary tree is a pathological/degenerate tree in which the tree is either dominated by the left nodes or the right nodes. Thus, there are two types of skewed binary tree: left-skewed binary tree and right-skewed binary tree',
    ],
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
    advantage: [
      'The searching operation in a binary tree is very fast',
      'The representation of a binary tree is simple and easy to understand',
      'Traversing from a parent node to its child node and vice-versa is efficiently done',
      'Simple to implement',
      'Easy to understand',
      'Reflect structural relationships that are present in the data set',
      'Executions are fast',
      'Store an arbitrary number of data values',
    ],
    disadvantage: [
      'In binary tree traversals, there are many pointers that are null and hence useless',
      'The access operation in a Binary Search Tree (BST) is slower than in an array',
      'A basic option is dependent on the height of the tree',
      'Deletion node not easy',
      'A basic option is based on the height of tree',
    ],
  }

  const BinaryTree=()=>{
    const navigate = useNavigate();

    const renderVisualization = () => {
        return <BinaryTreeVisualization/>;
    };

    return (
        <div className="container">
            <h1>Binary Tree</h1>
            <div dangerouslySetInnerHTML={{ __html: binaryTree.defination }} /><br/>
            <h3>Example</h3>
            <img className="exampleImage" src={binaryTree.example} alt= "Binary tree example"/>
           
            <h3>Properties</h3>
            <ul>
                {binaryTree.properties.map((prop, index) => (
                    <li key={index}>{prop}</li>
                ))}
            </ul>
            <h3>Operations</h3>
            <ul>
                {binaryTree.operations.map((operation, index) => (
                    <li key={index}>{operation}</li>
                ))}
            </ul>
            {renderVisualization()}
            <h3>Applications</h3>
            <ul>
                {binaryTree.applications.map((app, index) => (
                    <li key={index}>{app}</li>
                ))}
            </ul>
            <h3>Types</h3>
            <ul>
                {binaryTree.type.map((adv, index) => (
                    <li key={index} dangerouslySetInnerHTML={{ __html: adv }} />
                ))}
            </ul>
            <h3>Advantages</h3>
            <ul>
                {binaryTree.advantage.map((adv, index) => (
                    <li key={index} dangerouslySetInnerHTML={{ __html: adv }} />
                ))}
            </ul>
            <h3>Disadvantages</h3>
            <ul>
                {binaryTree.disadvantage.map((dis, index) => (
                    <li key={index}>{dis}</li>
                ))}
            </ul>

            <button onClick={() => navigate(-1)} className="back-button">Back</button>
        </div>
    );
  };

  export default BinaryTree;