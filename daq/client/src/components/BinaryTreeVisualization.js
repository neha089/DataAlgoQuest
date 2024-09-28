import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import './BinaryTreeVisualization.css';

const BinaryTreeVisualization = () => {
  const [data, setData] = useState({ value: null, children: [] });
  const [curId, setCurId] = useState(1);
  const nodeRadius = 20; // Reduced node size
  const LinkStroke = 1;
  const animationDuration = 750;
  const padding = 15; // Adjusted padding

  useEffect(() => {
    const svg = d3.select('.Canvas').append('svg').append('g');
    return () => {
      svg.remove();
    };
  }, []);

  const freezeButtons = () => {
    document.getElementById('InsertButton').disabled = true;
    document.getElementById('DeleteButton').disabled = true;
    document.getElementById('ConstructButton').disabled = true;
  };

  const unfreezeButtons = () => {
    document.getElementById('InsertButton').disabled = false;
    document.getElementById('DeleteButton').disabled = false;
    document.getElementById('ConstructButton').disabled = false;
  };

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const updateCanvasSize = () => {
    const width = Math.max(100, window.innerWidth - 50);
    const height = Math.max(100, window.innerHeight - 200);
    d3.select('.Canvas > svg')
      .attr('width', width)
      .attr('height', height);
  };

  const update = (oldData, newData, parentValue, childValue) => {
    const treemap = d3.tree().size([window.innerHeight - 200, window.innerWidth - 50]);
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

    const allLinks = [];
    for (let i = 0; i < newTreeArray.length; i++) {
      for (let j = 0; j < 2; j++) {
        if (newTreeArray[i].data.value !== null && newTreeArray[i].children[j].data.value !== null) {
          allLinks.push({
            parent: newTreeArray[i],
            child: newTreeArray[i].children[j],
          });
        }
      }
    }

    allLinks.forEach(link => {
      d3.select('.Canvas > svg g')
        .append('line')
        .attr('stroke-width', LinkStroke)
        .attr('stroke', 'white') // Change link color to white
        .attr('x1', link.parent.oldX)
        .attr('y1', link.parent.oldY)
        .attr('x2', link.child.oldX)
        .attr('y2', link.child.oldY)
        .transition()
        .duration(animationDuration)
        .attr('x1', link.parent.x)
        .attr('y1', link.parent.y - 1500) // Adjusted to shorten link height
        .attr('x2', link.child.x)
        .attr('y2', link.child.y - 1500); // Adjusted to shorten link height
    });
    
    

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
      .attr('r', nodeRadius) // Reduced radius
      .attr('cx', (d) => d.oldX)
      .attr('cy', (d) => d.oldY)
      .attr('value', (d) => d.data.value)
      .attr('fill', (d) => (d.data.value != null ? 'lightblue' : 'transparent'));

    nodes
      .append('text')
      .attr('dx', (d) => d.oldX)
      .attr('dy', (d) => d.oldY)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('font-size', '12px') // Reduced font size
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
    updateCanvasSize();
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

  const deleteNode = async () => {
    let val = document.getElementById('DeleteNodeField').value;
    if (val === '') return;
    if (isNaN(val)) {
      alert('Only integer values are allowed');
      return;
    }
    val = parseInt(val);
    document.getElementById('DeleteNodeField').value = '';
    freezeButtons();

    let oldData = JSON.parse(JSON.stringify(data));
    let newData = JSON.parse(JSON.stringify(data));

    const deleteNodeRecursive = (node, value) => {
      if (node.value === null) return null;
      if (node.value === value) {
        if (node.children[0] === null && node.children[1] === null) {
          return { value: null, children: [] }; // If the node is a leaf, set its value to null
        }

        // Find in-order successor (smallest value in the right subtree)
        let successor = node.children[1];
        while (successor && successor.children[0]) {
          successor = successor.children[0];
        }

        // Replace node value with the successor value
        node.value = successor.value;
        node.children[1] = deleteNodeRecursive(node.children[1], successor.value);
        return node;
      }

      node.children[0] = deleteNodeRecursive(node.children[0], value);
      node.children[1] = deleteNodeRecursive(node.children[1], value);
      return node;
    };

    const result = deleteNodeRecursive(newData, val);
    if (result) {
      newData = result;
      update(oldData, newData, -1, -1);
    } else {
      alert('Node not found');
      update(oldData, oldData, -1, -1);
    }

    unfreezeButtons();
  };

  useEffect(() => {
    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  return (
    <div>
      <div className="ControlPanel">
        <input
          type="text"
          id="InsertNodeField"
          className="text-field"
          placeholder="Insert Node"
        />
        <input
          type="text"
          id="DeleteNodeField"
          className="text-field"
          placeholder="Delete Node"
        />
        <button id="InsertButton" onClick={addNode}>Insert Node</button>
        <button id="DeleteButton" onClick={deleteNode}>Delete Node</button>
        <button id="ConstructButton" onClick={updateCanvasSize}>Construct Tree</button>
      </div>
      <div className="Canvas" />
    </div>
  );
};

export default BinaryTreeVisualization;
