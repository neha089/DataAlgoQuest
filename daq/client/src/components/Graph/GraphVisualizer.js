import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import "./GraphVisualizer.css";
import { useNavigate } from 'react-router-dom';

const GraphVisualizer = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [nodeName, setNodeName] = useState("");
  const [sourceNode, setSourceNode] = useState("");
  const [targetNode, setTargetNode] = useState("");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("bfs");
  const [speed, setSpeed] = useState(500);
  const [visualizing, setVisualizing] = useState(false);
  const [edgeType, setEdgeType] = useState("undirected");
  const [bfsOutput, setBfsOutput] = useState([]);
  const [dfsOutput, setDfsOutput] = useState([]);
  const [queueStackStatus, setQueueStackStatus] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const svg = d3.select("#graph").attr("width", "800px").attr("height", "500px");
    const simulation = d3
      .forceSimulation()
      .force("link", d3.forceLink().distance(100).strength(1))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(400, 250));

    simulation.nodes(nodes).on("tick", ticked);
    simulation.force("link").links(edges);

    function ticked() {
      svg.selectAll(".edge")
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      svg.selectAll(".node")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      svg.selectAll(".label")
        .attr("x", d => d.x)
        .attr("y", d => d.y);
    }

    svg.selectAll(".edge").remove();
    svg.selectAll(".node").remove();
    svg.selectAll(".label").remove();

    svg
      .selectAll(".edge")
      .data(edges)
      .enter()
      .append("line")
      .attr("class", "edge")
      .attr("stroke", "gray")
      .attr("stroke-width", 2);

    const nodeElements = svg
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("class", "node")
      .attr("r", 20)
      .attr("fill", "blue")
      .attr("id", d => `node-${d.id}`)
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    svg
      .selectAll(".label")
      .data(nodes)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("fill", "white")
      .text((d) => String.fromCharCode(65 + d.id)); // Alphabetical label

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }, [nodes, edges]);

  const addNode = () => {
    if (nodeName) {
      setNodes((prevNodes) => [
        ...prevNodes,
        { id: prevNodes.length, name: nodeName, x: Math.random() * 800, y: Math.random() * 500 },
      ]);
      setNodeName("");
    }
  };

  const addEdge = () => {
    const source = parseInt(sourceNode);
    const target = parseInt(targetNode);
    if (!isNaN(source) && !isNaN(target) && source !== target) {
      setEdges((prevEdges) => [
        ...prevEdges,
        { source: nodes[source], target: nodes[target] },
      ]);
    }
    setSourceNode("");
    setTargetNode("");
  };

  const bfs = async (start) => {
    const visited = new Set();
    const queue = [start];
    const output = [];
    setQueueStackStatus([...queue]); // Set initial queue status

    while (queue.length) {
      const currentNode = queue.shift();
      if (!visited.has(currentNode)) {
        visited.add(currentNode);
        d3.select(`#node-${currentNode}`).attr("fill", "orange"); // Highlight the node
        output.push(currentNode);
        setQueueStackStatus([...queue]); // Update queue status
        await sleep(speed);
        d3.select(`#node-${currentNode}`).attr("fill", "blue"); // Reset color after visiting
      }
      edges.forEach(edge => {
        if (edge.source.id === currentNode && !visited.has(edge.target.id)) {
          queue.push(edge.target.id);
        }
        if (edgeType === "undirected" && edge.target.id === currentNode && !visited.has(edge.source.id)) {
          queue.push(edge.source.id);
        }
      });
    }
    setBfsOutput(output);
  };

  const dfs = async (node, visited = new Set(), stack = []) => {
    if (visited.has(node)) return;
    visited.add(node);
    stack.push(node);
    d3.select(`#node-${node}`).attr("fill", "orange"); // Highlight the node
    setQueueStackStatus([...stack]); // Update stack status
    await sleep(speed);
    d3.select(`#node-${node}`).attr("fill", "blue"); // Reset color after visiting
    dfsOutput.push(node);
    edges.forEach(edge => {
      if (edge.source.id === node) {
        dfs(edge.target.id, visited, stack);
      }
      if (edgeType === "undirected" && edge.target.id === node) {
        dfs(edge.source.id, visited, stack);
      }
    });
  };

  const visualize = () => {
    if (visualizing) return;
    setVisualizing(true);
    const startNode = 0; // Start from the first node
    switch (selectedAlgorithm) {
      case "bfs":
        bfs(startNode).then(() => setVisualizing(false));
        break;
      case "dfs":
        dfs(startNode).then(() => {
          setDfsOutput(dfsOutput);
          setVisualizing(false);
        });
        break;
      default:
        setVisualizing(false);
        break;
    }
  };

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const generateRandomGraph = () => {
    const randomNodes = Math.floor(Math.random() * 5) + 5; // Ensure at least 5 nodes
    const randomEdges = Math.floor(Math.random() * randomNodes * (randomNodes - 1) / 2);
    const newNodes = [];
    for (let i = 0; i < randomNodes; i++) {
      newNodes.push({ id: i, name: String.fromCharCode(65 + i), x: Math.random() * 800, y: Math.random() * 500 });
    }
    setNodes(newNodes);
    setEdges([]);
    for (let i = 0; i < randomEdges; i++) {
      const nodeA = Math.floor(Math.random() * randomNodes);
      let nodeB;
      do {
        nodeB = Math.floor(Math.random() * randomNodes);
      } while (nodeA === nodeB || edges.some(edge => (edge.source.id === nodeA && edge.target.id === nodeB) || (edge.source.id === nodeB && edge.target.id === nodeA)));
      setEdges((prevEdges) => [
        ...prevEdges,
        { source: newNodes[nodeA], target: newNodes[nodeB] },
      ]);
    }
  };

  const clearGraph = () => {
    setNodes([]);
    setEdges([]);
    setBfsOutput([]);
    setDfsOutput([]);
    setQueueStackStatus([]);
  };

  return (
    <div className="graph-visualizer">
      <h2>Graph Algorithm Visualizer</h2>
      <div className="controls">
        <button onClick={generateRandomGraph}>Generate Random Graph</button>
        <button onClick={clearGraph}>Clear Graph</button>
        <label>Node Name: <input type="text" value={nodeName} onChange={(e) => setNodeName(e.target.value)} /></label>
        <button onClick={addNode}>Add Node</button>
        <label>Source: <input type="text" value={sourceNode} onChange={(e) => setSourceNode(e.target.value)} /></label>
        <label>Target: <input type="text" value={targetNode} onChange={(e) => setTargetNode(e.target.value)} /></label>
        <button onClick={addEdge}>Add Edge</button>
        <div className="algorithm-selection">
          <label>Algorithm:</label>
          <select value={selectedAlgorithm} onChange={(e) => setSelectedAlgorithm(e.target.value)}>
            <option value="bfs">BFS</option>
            <option value="dfs">DFS</option>
          </select>
          <label>Speed:</label>
          <input type="range" min="100" max="1000" step="100" value={speed} onChange={(e) => setSpeed(e.target.value)} />
          <button onClick={visualize}>Visualize</button>
        </div>
        <h3>Queue/Stack Status:</h3>
        <p>{queueStackStatus.join(" -> ")}</p>
        <h3>BFS Output:</h3>
        <p>{bfsOutput.join(", ")}</p>
        <h3>DFS Output:</h3>
        <p>{dfsOutput.join(", ")}</p>
      </div>
      <svg id="graph"></svg>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
    
  );
};

export default GraphVisualizer;
