import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import './BinaryTreeVisualization.css';

const BinaryTreeVisualization = () => {
  const [data, setData] = useState({ value: null, children: [] });
  const [curId, setCurId] = useState(1);
  const width = Math.max(100, window.innerWidth - 50);
  const height = Math.max(100, window.innerHeight - 100);
  const nodeRadius = 20;
  const LinkStroke = 4;
  const animationDuration = 750;
  const padding = 22;

  useEffect(() => {
    const svg = d3.select('.Canvas').append('svg').append('g');
    return () => {
      svg.remove();
    };
  }, []);

  const freezeButtons = () => {
    document.getElementById('InsertButton').disabled = true;
    document.getElementById('DeleteButton').disabled = true;
  };

  const unfreezeButtons = () => {
    document.getElementById('InsertButton').disabled = false;
    document.getElementById('DeleteButton').disabled = false;
  };

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const update = (oldData, newData, parentValue, childValue) => {
    const treemap = d3.tree().size([width, height]);
    const oldTree = treemap(d3.hierarchy(data, (d) => d.children));
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
        if (newTreeArray[i].data.value !== null && newTreeArray[i].children[j].data.value !== null) {
          allLinks.push({
            parent: newTreeArray[i],
            child: newTreeArray[i].children[j],
          });
        }
      }
    }

    for (let i = 0; i < 2; i++) {
      const lineId = i === 0 ? 'Under' : '';

      const links = d3
        .select('.Canvas > svg g')
        .selectAll('g.link')
        .data(allLinks)
        .enter()
        .append('g')
        .append('line')
        .attr('id', (d) => `${lineId}link_Source_${d.parent.data.nodeId}_Dest_${d.child.data.nodeId}`)
        .attr('stroke-width', LinkStroke)
        .attr('stroke', 'white')
        .attr('x1', (d) => d.parent.oldX)
        .attr('y1', (d) => d.parent.oldY)
        .attr('x2', (d) => d.child.oldX)
        .attr('y2', (d) => d.child.oldY);

      links
        .transition()
        .duration(animationDuration)
        .attr('x1', (d) => d.parent.x)
        .attr('y1', (d) => d.parent.y)
        .attr('x2', (d) => d.child.x)
        .attr('y2', (d) => d.child.y);
    }

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
      .attr('dy', (d) => d.oldY)
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

  return (
    <div>
      <div className="Canvas"></div>
      <div className="ControlPanel">
        <input id="InsertNodeField" type="number" placeholder="Enter node value" />
        <button id="InsertButton" onClick={addNode}>
          Insert
        </button>
        <input id="DeleteNodeField" type="number" placeholder="Enter value to delete" />
        <button id="DeleteButton">Delete</button>
      </div>
    </div>
  );
};

export default BinaryTreeVisualization;
 