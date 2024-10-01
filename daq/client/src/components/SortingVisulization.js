// src/App.js
import React, { useEffect, useState } from 'react';
import './SortingVisulization.css';
import * as d3 from 'd3';

const App = () => {
  const [data, setData] = useState([]);
  const [n, setN] = useState(50);
  const [delay, setDelay] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const [isStopped, setIsStopped] = useState(true);
  const [isSorted, setIsSorted] = useState(false);
  const [algorithm, setAlgorithm] = useState('insertion');

  useEffect(() => {
    generateRandomArray();
  }, [n]);

  const generateRandomArray = () => {
    const heights = Array.from({ length: n }, () => Math.floor(Math.random() * 500) + 1);
    setData(heights);
    setIsSorted(false);
    setIsStopped(true);
    setIsPaused(false);
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const swap = (i, j) => {
    const newData = [...data];
    [newData[i], newData[j]] = [newData[j], newData[i]];
    setData(newData);
  };

  const drawBars = () => {
    const svg = d3.select('#container');

    // Bind data to rectangles
    const bars = svg.selectAll('rect')
      .data(data);

    // Enter selection for new bars
    bars.enter()
      .append('rect')
      .attr('x', (d, i) => i * (600 / n))
      .attr('y', (d) => 500 - d)
      .attr('width', 600 / n - 1)
      .attr('height', (d) => d)
      .attr('fill', 'white');

    // Update selection for existing bars
    bars.transition()
      .duration(100)
      .attr('y', (d) => 500 - d)
      .attr('height', (d) => d);

    // Exit selection for removed bars
    bars.exit().remove();
  };

  useEffect(() => {
    drawBars();
  }, [data]);

  const bubbleSort = async () => {
    const arr = [...data];
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (isStopped) return;
        if (!isPaused) {
          if (arr[j] > arr[j + 1]) {
            swap(j, j + 1);
            await sleep(delay);
          }
        } else {
          j--; // Move back when paused
        }
      }
    }
    setIsSorted(true);
    drawBars(); // Ensure final state is rendered
  };

  const insertionSort = async () => {
    const arr = [...data];
    for (let i = 1; i < arr.length; i++) {
      const key = arr[i];
      let j = i - 1;
      while (j >= 0 && arr[j] > key) {
        if (isStopped) return;
        if (!isPaused) {
          swap(j + 1, j);
          await sleep(delay);
        } else {
          j++;
        }
        j--;
      }
      arr[j + 1] = key;
    }
    setIsSorted(true);
    drawBars(); // Ensure final state is rendered
  };

  const handleSort = async () => {
    if (isSorted) generateRandomArray();
    setIsStopped(false);
    if (algorithm === 'bubble') await bubbleSort();
    else if (algorithm === 'insertion') await insertionSort();
    drawBars(); // Ensure final state is rendered
  };

  return (
    <div className="app">
      <div id="header">
        <div id="headerLeft">
          <input
            type="range"
            min="10"
            max="100"
            value={n}
            onChange={(e) => setN(e.target.value)}
          />
          <input
            type="range"
            min="10"
            max="300"
            value={delay}
            onChange={(e) => setDelay(300 - e.target.value)}
          />
          <button onClick={generateRandomArray}>Generate</button>
        </div>
        <h1>Algorithm Visualizer</h1>
        <div id="headerRight">
          <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
            <option value="insertion">Insertion Sort</option>
            <option value="bubble">Bubble Sort</option>
          </select>
        </div>
      </div>
      <svg id="container" width="600" height="500"></svg>
      <div id="buttonsdiv">
        <button onClick={handleSort}>Sort</button>
        <button onClick={() => setIsStopped(true)}>Stop</button>
        <button onClick={() => setIsPaused(!isPaused)}>
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      </div>
    </div>
  );
};

export default App;
