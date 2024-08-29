import React, { useState } from 'react';
import './style.css';

const Node = ({ value, left, right }) => (
    <div className="node">
        <div className="node-value">{value}</div>
        <div className="children">
            {left && <Node value={left.value} left={left.left} right={left.right} />}
            {right && <Node value={right.value} left={right.left} right={right.right} />}
        </div>
    </div>
);

const BinaryTreeVisualization = () => {
    const [root, setRoot] = useState(null);
    const [value, setValue] = useState('');
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [message, setMessage] = useState('');

    const insertNode = (value) => {
        const newNode = { value: parseInt(value), left: null, right: null };
        const newRoot = insertRec(root, newNode);
        setRoot(newRoot);
        setValue('');
        recordStep(newRoot, `Inserted ${newNode.value}.`);
    };

    const insertRec = (node, newNode) => {
        if (!node) return newNode;

        if (newNode.value < node.value) {
            node.left = insertRec(node.left, newNode);
        } else {
            node.right = insertRec(node.right, newNode);
        }

        return balance(node);
    };

    const balance = (node) => {
        if (!node) return node;

        const balanceFactor = getBalanceFactor(node);
        if (balanceFactor > 1) {
            if (getBalanceFactor(node.left) < 0) {
                node.left = rotateLeft(node.left);
                recordStep(node, `Performed Left Rotation on ${node.value}.`);
            }
            return rotateRight(node);
        }
        if (balanceFactor < -1) {
            if (getBalanceFactor(node.right) > 0) {
                node.right = rotateRight(node.right);
                recordStep(node, `Performed Right Rotation on ${node.value}.`);
            }
            return rotateLeft(node);
        }
        return node;
    };

    const getBalanceFactor = (node) => {
        if (!node) return 0;
        return getHeight(node.left) - getHeight(node.right);
    };

    const getHeight = (node) => {
        if (!node) return 0;
        return Math.max(getHeight(node.left), getHeight(node.right)) + 1;
    };

    const rotateRight = (y) => {
        const x = y.left;
        const T2 = x.right;

        x.right = y;
        y.left = T2;

        recordStep(y, `Performed Right Rotation: ${y.value} becomes root.`);
        return x;
    };

    const rotateLeft = (x) => {
        const y = x.right;
        const T2 = y.left;

        y.left = x;
        x.right = T2;

        recordStep(x, `Performed Left Rotation: ${x.value} becomes root.`);
        return y;
    };

    const recordStep = (tree, action) => {
        setSteps([...steps, JSON.parse(JSON.stringify(tree))]);
        setCurrentStep(steps.length);
        setMessage(action);
    };

    const deleteNode = (value) => {
        const newRoot = deleteRec(root, parseInt(value));
        setRoot(newRoot);
        setValue('');
        recordStep(newRoot, `Deleted ${value}.`);
    };

    const deleteRec = (node, value) => {
        if (!node) return null;

        if (value < node.value) {
            node.left = deleteRec(node.left, value);
        } else if (value > node.value) {
            node.right = deleteRec(node.right, value);
        } else {
            if (!node.left) return node.right;
            else if (!node.right) return node.left;

            const minValueNode = findMin(node.right);
            node.value = minValueNode.value;
            node.right = deleteRec(node.right, minValueNode.value);
        }

        return balance(node);
    };

    const findMin = (node) => {
        while (node.left) {
            node = node.left;
        }
        return node;
    };

    const renderTree = (node) => {
        if (!node) return null;
        return (
            <Node value={node.value} left={node.left} right={node.right} />
        );
    };

    const handleInsert = () => {
        if (value) {
            insertNode(value);
            setValue('');
        }
    };

    const handleDelete = () => {
        if (value) {
            deleteNode(value);
            setValue('');
        }
    };

    const goBackStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            setRoot(steps[currentStep - 1]);
        }
    };

    const goNextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
            setRoot(steps[currentStep + 1]);
        }
    };

    return (
        <div className="binary-tree-visualization">
            <h2>Binary Tree Visualization (AVL)</h2>
            <div className="input-container">
                <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Enter value"
                />
                <button onClick={handleInsert}>Insert</button>
                <button onClick={handleDelete}>Delete</button>
            </div>
            <div className="tree-container">
                {renderTree(root)}
            </div>
            {message && <p className="message">{message}</p>}
            <div className="navigation">
                <button onClick={goBackStep} disabled={currentStep === 0}>Previous</button>
                <button onClick={goNextStep} disabled={currentStep === steps.length - 1}>Next</button>
            </div>
        </div>
    );
};

export default BinaryTreeVisualization;
