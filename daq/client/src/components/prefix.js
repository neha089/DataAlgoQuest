import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import "./TrieVisualizer.css";

const TrieVisualizer = () => {
  const [trieData, setTrieData] = useState({
    nodeId: 0,
    value: "root",
    endOfWord: false,
    children: [],
    childrenCharacter: {},
  });
  const [inputWord, setInputWord] = useState("");
  const [curId, setCurId] = useState(1);

  // D3 Visualization function
  const initVisualization = (data) => {
    const width = Math.max(100, window.innerWidth - 50);
    const height = Math.max(100, window.innerHeight - 200);
    const nodeRadius = 20;
    const padding = 40;

    const treemap = d3.tree().size([width, height]);
    const newTree = treemap(d3.hierarchy(data, (d) => d.children));

    newTree.y += padding;

    const svg = d3.select(".canvas").append("svg").append("g");

    const nodes = svg
      .selectAll("g.node")
      .data(newTree)
      .enter()
      .append("g")
      .attr("class", () => "node");

    nodes
      .append("circle")
      .attr("id", (d) => `circle${d.data.nodeId}`)
      .attr("r", nodeRadius)
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("value", (d) => d.data.value);

    nodes
      .append("text")
      .attr("dx", (d) => d.x)
      .attr("dy", (d) => d.y)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("font-size", "20px")
      .attr("font-weight", "bold")
      .text((d) => d.data.value);
  };

  useEffect(() => {
    initVisualization(trieData); // Initial rendering of the trie
  }, [trieData]);

  // Function to handle insertion into the trie
  const handleInsert = () => {
    if (!inputWord || inputWord.length > 12) {
      alert("Word Length should be less than 12.");
      return;
    }

    const word = inputWord.toLowerCase();
    setInputWord(""); // Clear input

    const newTrie = JSON.parse(JSON.stringify(trieData)); // Deep copy
    let node = newTrie;

    for (let i = 0; i < word.length; i++) {
      if (word[i] in node.childrenCharacter) {
        node = node.children.find((child) => child.value === word[i]);
      } else {
        const newNode = {
          nodeId: curId,
          value: word[i],
          endOfWord: i === word.length - 1,
          children: [],
          childrenCharacter: {},
        };
        node.children.push(newNode);
        node.childrenCharacter[word[i]] = true;
        node = newNode;
        setCurId(curId + 1);
      }
    }
    setTrieData(newTrie); // Update trie state
  };

  // Longest Prefix Matching
  const longestPrefixMatch = (prefix) => {
    let node = trieData;
    let match = "";

    for (let char of prefix) {
      if (node.childrenCharacter[char]) {
        match += char;
        node = node.children.find((child) => child.value === char);
      } else break;
    }

    return match;
  };

  return (
    <div className="container">
      <div id="header">
        <div id="OperationContainer">
          <input
            type="text"
            value={inputWord}
            onChange={(e) => setInputWord(e.target.value)}
            placeholder="Enter the word"
          />
          <button type="button" className="button" onClick={handleInsert}>
            Insert
          </button>
          <input type="text" placeholder="Longest Prefix" onBlur={(e) => alert(longestPrefixMatch(e.target.value))}/>
        </div>
        <div id="title">Trie Visualizer</div>
      </div>
      <div className="canvas"></div>
    </div>
  );
};

export default TrieVisualizer;
