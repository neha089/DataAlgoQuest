import React, { useState, useEffect } from 'react'; 
import * as d3 from 'd3';
import './BinaryTreeVisualization.css';

const BinaryTreeVisualization = () => {
  const [data, setData] = useState({ value: null, children: [] });
  const [curId, setCurId] = useState(1);
  const [nodeCount, setNodeCount] = useState(0); // Track the number of nodes
  const width = Math.max(100, window.innerWidth - 50);
  const baseHeight = 400; // Base height of the tree visualization
  const height = Math.max(baseHeight, baseHeight + nodeCount * 40); // Adjust height based on node count
  const nodeRadius = 20;
  const linkStroke = 4;
  const animationDuration = 750;
  const padding = 30;
  const [showCodeContainer, setShowCodeContainer] = useState(false);
  const [currentCode, setCurrentCode] = useState(null);
  const [copiedStates, setCopiedStates] = useState([]);

  useEffect(() => {
    const svg = d3.select('.Canvas').append('svg').append('g');
    return () => {
      svg.remove();
    };
  }, []);

  const freezeButtons = () => {
    document.getElementById('InsertButton').disabled = true;
    // document.getElementById('DeleteButton').disabled = true;
  };

  const unfreezeButtons = () => {
    document.getElementById('InsertButton').disabled = false;
    // document.getElementById('DeleteButton').disabled = false;
  };

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const update = (oldData, newData, parentValue, childValue) => {
    const treemap = d3.tree().size([width, height]);
    const oldTree = treemap(d3.hierarchy(oldData, (d) => d.children));
    const newTree = treemap(d3.hierarchy(newData, (d) => d.children));

    const oldTreeArray = oldTree.descendants();
    const newTreeArray = newTree.descendants();

    for (let i = 0; i < newTreeArray.length; i++) {
      let oldPosition = {};
      for (let j = 0; j < oldTreeArray.length; j++) {
        if (newTreeArray[i].data.value === childValue) {
          if (oldTreeArray[j].data.value === parentValue) {
            oldPosition = oldTreeArray[j];
          }
        } else {
          if (oldTreeArray[j].data.value === newTreeArray[i].data.value) {
            oldPosition = oldTreeArray[j];
          }
        }
      }
      newTreeArray[i].oldX = oldPosition.x || 0;
      newTreeArray[i].oldY = (oldPosition.y || 0) + padding;
      newTreeArray[i].y += padding;
    }

    d3.select('.Canvas > svg g').remove();
    d3.select('.Canvas > svg').append('g');

    let allLinks = [];
    for (let i = 0; i < newTreeArray.length; i++) {
      for (let j = 0; j < 2; j++) {
        if (newTreeArray[i].data.value !== null && newTreeArray[i].children[j]?.data.value !== null) {
          allLinks.push({
            parent: newTreeArray[i],
            child: newTreeArray[i].children[j],
          });
        }
      }
    }

    const links = d3
      .select('.Canvas > svg g')
      .selectAll('g.link')
      .data(allLinks)
      .enter()
      .append('g')
      .append('line')
      .attr('stroke-width', linkStroke)
      .attr('stroke', 'white')
      .attr('x1', (d) => d.parent.oldX)
      .attr('y1', (d) => d.parent.oldY)
      .attr('x2', (d) => d.child.oldX)
      .attr('y2', (d) => d.child.oldY)
      .attr('class', 'link');

    links.transition()
      .duration(animationDuration)
      .attr('x1', (d) => d.parent.x)
      .attr('y1', (d) => d.parent.y)
      .attr('x2', (d) => d.child.x)
      .attr('y2', (d) => d.child.y);

    const nodes = d3
      .select('.Canvas > svg g')
      .selectAll('g.node')
      .data(newTreeArray)
      .enter()
      .append('g')
      .attr('id', (d) => `node${d.data.nodeId}`)
      .attr('class', (d) => (d.data.value != null ? 'node' : 'null-node'));

    nodes
      .append('circle')
      .attr('id', (d) => `circle${d.data.nodeId}`)
      .attr('r', nodeRadius)
      .attr('cx', (d) => d.oldX)
      .attr('cy', (d) => d.oldY)
      .attr('value', (d) => d.data.value);

    nodes
      .append('text')
      .attr('dx', (d) => d.oldX)
      .attr('dy', (d) => d.oldY + 5)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('font-size', '20px')
      .attr('font-weight', 'bold')
      .text((d) => d.data.value);

    nodes
      .transition()
      .duration(animationDuration)
      .attr('transform', (d) => {
        if (d.data.value !== null) return `translate(${parseInt(d.x - d.oldX)}, ${parseInt(d.y - d.oldY)})`;
        else return 'translate(0,0)';
      });

    setData(newData);
  };

  const addNode = async () => {
    let val = document.getElementById('InsertNodeField').value;
    if (val === '') return;
    if (isNaN(val)) {
      alert('Only integer values are allowed');
      return;
    }
    val = parseInt(val);
    document.getElementById('InsertNodeField').value = '';
    freezeButtons();

    let oldData = JSON.parse(JSON.stringify(data));
    let newData = JSON.parse(JSON.stringify(data));
    let node = newData;
    let parent = null;

    while (true) {
      if (node.value === null) {
        await sleep(400);
        const newChild = {
          nodeId: curId,
          value: val,
          children: [{ value: null }, { value: null }],
        };

        if (parent) {
          if (parent.value < val) parent.children[1] = newChild;
          else parent.children[0] = newChild;
        } else {
          newData = newChild;
        }

        update(oldData, newData, parent ? parent.value : -1, val);
        setCurId(curId + 1);
        setNodeCount(nodeCount + 1); // Increment node count
        await sleep(300);
        break;
      }

      const nodeElement = document.getElementById(`node${node.nodeId}`);
      if (nodeElement) nodeElement.className.baseVal = 'highlightedNode';

      if (node.value === val) {
        alert('Value already exists in the tree');
        update(oldData, oldData, -1, -1);
        break;
      }

      parent = node;
      if (node.value > val) {
        node = node.children[0];
      } else {
        node = node.children[1];
      }

      const linkElement = document.getElementById(`link_Source_${parent.nodeId}_Dest_${node.nodeId}`);
      if (linkElement) {
        linkElement.className.baseVal = 'LinkAnimation';
        await sleep(750);
      }
    }
    unfreezeButtons();
  };

  const SourceCode=()=>{
    return {
      title:`Binary Tree`,
      codes:[
       {
         description:`Node class of the binary tree`,
         code:`export class BinaryTreeNode {
           leftChild: BinaryTreeNode | any;
           rightChild: BinaryTreeNode | any;
           data: number;
         
           constructor(data: number) {
             this.leftChild = null;
             this.rightChild = null;
             this.data = data;
           }
       }`
       },
       {
         description:`Convert an array into a binary tree`,
         code:`insertNodeAtLevel(arr: number[], index: number): BinaryTreeNode {
           let node: BinaryTreeNode | any = null;
           if (index < arr.length) {
             node = new BinaryTreeNode(arr[index]);
             node.leftChild = this.insertNodeAtLevel(arr, 2 * index + 1);
             node.rightChild = this.insertNodeAtLevel(arr, 2 * index + 2);
           }
           return node;
       }`
       },
       {
         description:`Height of binary tree`,
         code:`heightOfBinaryTree(root: BinaryTreeNode): number {
           if (root === null) return 0;
           let lHeight = this.heightOfBinaryTree(root.leftChild) + 1;
           let rHeight = this.heightOfBinaryTree(root.rightChild) + 1;
           return Math.max(lHeight, rHeight);
       }`
       },
       {
         description:`Total nodes in the binary tree`,
         code:`totalNodesCount(root: BinaryTreeNode): number {
           if (root === null) return 0;
           let count = 1;
           count += this.totalNodesCount(root.leftChild);
           count += this.totalNodesCount(root.rightChild);
           return count;
       }`
       },
       {
         description:`Get Last Node of binary tree`,
         code:`getLastNodeItsParent(
           root: BinaryTreeNode | null,
           parentNode: BinaryTreeNode | null,
           level: number
         ): void {
           if (root == null) {
             return;
           }
           if (level === 1) {
             this.lastNode = root;
             this.lastNodeParent = parentNode;
           }
           this.getLastNodeItsParent(root.leftChild, root, level - 1);
           this.getLastNodeItsParent(root.rightChild, root, level - 1);
       }`
       },
       {
         description:`Delete last node from the binary tree`,
         code:`deleteLastNode(root: BinaryTreeNode): void {
           if (root === null) {
             return;
           }
           const treeHeight = this.heightOfBinaryTree(root);
           this.getLastNodeItsParent(root, null, treeHeight);
           if (this.lastNode !== null && this.lastNodeParent !== null) {
             if (this.lastNodeParent?.rightChild != null) {
               this.lastNodeParent.rightChild = null;
             } else {
               this.lastNodeParent.leftChild = null;
             }
           } else {
             this.root = null;
           }
       }`
       },
       {
         description:`Search a node in the binary tree`,
         code:`searchNode(root: BinaryTreeNode, key: number): void {
           if (root === null || this.findNode != null) {
             return;
           }
       
           if (root.data === key) {
             this.findNode = root;
             return;
           }
       
           this.searchNode(root.leftChild, key);
           this.searchNode(root.rightChild, key);
       }`
       },
       {
         description:`In-order traversal of binary tree`,
         code:`inOrderTraversal(root: BinaryTreeNode): number[] {
           let nodeData: number[] = [];
           if (root === null) return [];
           nodeData = nodeData.concat(this.inOrderTraversal(root.leftChild));
           nodeData.push(root.data);
           nodeData = nodeData.concat(this.inOrderTraversal(root.rightChild));
           return nodeData;
       }`
       },
       {
         description:`Pre-order traversal of binary tree`,
         code:` preOrderTraversal(root: BinaryTreeNode): number[] {
           let nodeData: number[] = [];
           if (root === null) return [];
           nodeData.push(root.data);
           nodeData = nodeData.concat(this.preOrderTraversal(root.leftChild));
           nodeData = nodeData.concat(this.preOrderTraversal(root.rightChild));
           return nodeData;
       }`
       },
       {
         description:`Post-order traversal of binary tree`,
         code:`postOrderTraversal(root: BinaryTreeNode): number[] {
           let nodeData: number[] = [];
           if (root === null) return [];
           nodeData = nodeData.concat(this.postOrderTraversal(root.leftChild));
           nodeData = nodeData.concat(this.postOrderTraversal(root.rightChild));
           nodeData.push(root.data);
           return nodeData;
       }`
       },
      ]
   }
  };

  const handleViewCode = () => {
    const sourceCode = SourceCode();
      setCurrentCode(sourceCode);
      setShowCodeContainer(true);
  };

  const closeCodeContainer = () => {
    setShowCodeContainer(false);
  };

  const copyToClipboard = (code, index) => {
    navigator.clipboard.writeText(code).then(() => {
      const newCopiedStates = [...copiedStates];
      newCopiedStates[index] = true; // Set the state for the specific index to true
      setCopiedStates(newCopiedStates);
  
      setTimeout(() => {
        const resetCopiedStates = [...copiedStates];
        resetCopiedStates[index] = false; // Reset the state after 2 seconds
        setCopiedStates(resetCopiedStates);
      }, 2000);
    }).catch(err => {
      console.error('Error copying text: ', err);
    });
  };

  return (
    <div>
      <div className="ControlPanel">
        <input id="InsertNodeField" type="number" placeholder="Enter node value" />
        <button id="InsertButton" onClick={addNode}>
          Insert
        </button>
        {/* <input id="DeleteNodeField" type="number" placeholder="Enter value to delete" />
        <button id="DeleteButton">Delete</button> */}
        <button onClick={handleViewCode}>View Code</button>
      </div>
      <div className="Canvas" style={{ height: height }}>
        <svg width={width} height={height}>
          <g />
        </svg>
      </div>
      <div>
        { showCodeContainer && (
      <div className={`code-container ${showCodeContainer ? 'visible' : ''}`}>
        <div className="code-header">
          <h5>{currentCode?.title}</h5>
          <button onClick={closeCodeContainer}>Close</button>
        </div>
        <div className="code-content">
          {currentCode?.codes.map((codeBlock, index) => (
            <div key={index} className="code-section">
              <h5>{codeBlock.description}</h5>
              <div style={{ position: 'relative' }}>
                <pre>
                  <code>{codeBlock.code}</code>
                </pre>
                <button 
                  onClick={() => copyToClipboard(codeBlock.code, index)} 
                  style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }}
                >
                  {copiedStates[index] ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
        )}</div>
    </div>
  );
};

export default BinaryTreeVisualization;
