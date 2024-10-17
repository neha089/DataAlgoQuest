import React, { useState, useEffect, useRef } from "react";
import "./SortingVisulization.css";
import { useNavigate } from 'react-router-dom';

const SortingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [arraySize, setArraySize] = useState(20);
  const [speed, setSpeed] = useState(100);
  const [algorithm, setAlgorithm] = useState("bubble");
  const [sorting, setSorting] = useState(false);
  const [paused, setPaused] = useState(false);
  const timeoutId = useRef(null);
  const navigate = useNavigate();

  const resetArray = () => {
    if (sorting) return;
    const newArray = [];
    for (let i = 0; i < arraySize; i++) {
      newArray.push(Math.floor(Math.random() * 400) + 50);
    }
    setArray(newArray);
  };

  const handleArraySizeChange = (e) => {
    setArraySize(e.target.value);
  };

  const handleArrayInput = (e) => {
    if (sorting) return;
    const inputValues = e.target.value.split(",").map(Number);
    if (inputValues.every((num) => !isNaN(num))) {
      setArray(inputValues);
    }
  };

  const handleSpeedChange = (e) => {
    setSpeed(500 - e.target.value);
  };

  const handleAlgorithmChange = (e) => {
    setAlgorithm(e.target.value);
  };

  useEffect(() => {
    resetArray();
  }, [arraySize]);

  const startSorting = async () => {
    if (sorting) return;
    setSorting(true);
    switch (algorithm) {
      case "bubble":
        await bubbleSort();
        break;
      case "insertion":
        await insertionSort();
        break;
      case "selection":
        await selectionSort();
        break;
      case "quick":
        await quickSort();
        break;
      case "merge":
        await mergeSort();
        break;
      default:
        break;
    }
    setSorting(false);
  };

  const pauseSorting = () => {
    setPaused(true);
    clearTimeout(timeoutId.current);
  };

  const resumeSorting = () => {
    setPaused(false);
  };

  const stopSorting = () => {
    setSorting(false);
    setPaused(false);
    clearTimeout(timeoutId.current);
    resetArray();
  };

  const highlightBars = (index1, index2) => {
    const bars = document.getElementsByClassName("array-bar");
    bars[index1].classList.add("highlighted");
    bars[index2].classList.add("highlighted");
  };

  const unhighlightBars = (index1, index2) => {
    const bars = document.getElementsByClassName("array-bar");
  
    // Ensure indices are valid
    if (index1 >= 0 && index1 < bars.length) {
      bars[index1].classList.remove("highlighted");
    }
  
    if (index2 >= 0 && index2 < bars.length) {
      bars[index2].classList.remove("highlighted");
    }
  };
  

  const bubbleSort = async () => {
    let arr = [...array];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (paused) return;
        highlightBars(j, j + 1);
        await sleep(speed);
        if (arr[j] > arr[j + 1]) {
          await swap(arr, j, j + 1);
        }
        unhighlightBars(j, j + 1);
      }
    }
  };

  const insertionSort = async () => {
    let arr = [...array];
    for (let i = 1; i < arr.length; i++) {
      let key = arr[i];
      let j = i - 1;
      while (j >= 0 && arr[j] > key) {
        if (paused) return;
        highlightBars(j, j + 1);
        await sleep(speed);
        arr[j + 1] = arr[j];
        j = j - 1;
        setArray([...arr]);
        unhighlightBars(j + 1, j + 2);
      }
      arr[j + 1] = key;
      setArray([...arr]);
    }
  };

  const selectionSort = async () => {
    let arr = [...array];
    for (let i = 0; i < arr.length; i++) {
      let minIdx = i;
      for (let j = i + 1; j < arr.length; j++) {
        if (paused) return;
        highlightBars(minIdx, j);
        await sleep(speed);
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
        }
        unhighlightBars(minIdx, j);
      }
      await swap(arr, i, minIdx);
    }
  };

  const quickSort = async () => {
    await quickSortHelper([...array], 0, array.length - 1);
  };

  const quickSortHelper = async (arr, low, high) => {
    if (low < high) {
      let pi = await partition(arr, low, high);
      await quickSortHelper(arr, low, pi - 1);
      await quickSortHelper(arr, pi + 1, high);
    }
  };

  const partition = async (arr, low, high) => {
    let pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      if (paused) return;
      highlightBars(i + 1, j);
      await sleep(speed);
      if (arr[j] < pivot) {
        i++;
        await swap(arr, i, j);
      }
      unhighlightBars(i, j);
    }
    await swap(arr, i + 1, high);
    return i + 1;
  };

  const mergeSort = async () => {
    await mergeSortHelper([...array], 0, array.length - 1);
  };

  const mergeSortHelper = async (arr, l, r) => {
    if (l >= r) {
      return;
    }
    let m = l + Math.floor((r - l) / 2);
    await mergeSortHelper(arr, l, m);
    await mergeSortHelper(arr, m + 1, r);
    await merge(arr, l, m, r);
  };

  const merge = async (arr, l, m, r) => {
    let n1 = m - l + 1;
    let n2 = r - m;
    let L = [], R = [];
    for (let i = 0; i < n1; i++) L.push(arr[l + i]);
    for (let j = 0; j < n2; j++) R.push(arr[m + 1 + j]);

    let i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
      if (paused) return;
      highlightBars(l + i, m + 1 + j);
      await sleep(speed);
      if (L[i] <= R[j]) {
        arr[k] = L[i];
        i++;
      } else {
        arr[k] = R[j];
        j++;
      }
      setArray([...arr]);
      unhighlightBars(l + i, m + 1 + j);
      k++;
    }
    while (i < n1) {
      arr[k] = L[i];
      i++;
      k++;
    }
    while (j < n2) {
      arr[k] = R[j];
      j++;
      k++;
    }
    setArray([...arr]);
  };

  const swap = async (arr, i, j) => {
    highlightBars(i, j);
    await sleep(speed);
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setArray([...arr]);
    await sleep(speed);
    unhighlightBars(i, j);
  };

  const sleep = (ms) => {
    return new Promise((resolve) => {
      timeoutId.current = setTimeout(resolve, ms);
    });
  };

  return (
    <div className="sorting-visualizer">
      <h2>Sorting Algorithm Visualizer</h2>

      <div className="controls">
        <label>Array Size: </label>
        <input
          type="range"
          min="5"
          max="100"
          step="1"
          value={arraySize}
          onChange={handleArraySizeChange}
          disabled={sorting}
        />
        <input
          type="text"
          placeholder="Enter comma-separated values"
          onChange={handleArrayInput}
          disabled={sorting}
        />
        <button onClick={resetArray} disabled={sorting}>
          Generate Random Array
        </button>
      </div>

      <div className="controls">
        <label>Speed: </label>
        <input
          type="range"
          min="1"
          max="500"
          step="1"
          value={500 - speed}
          onChange={handleSpeedChange}
          disabled={sorting}
        />
      </div>

      <div className="algorithm-selection">
        <label>Select Algorithm: </label>
        <select onChange={handleAlgorithmChange} disabled={sorting}>
          <option value="bubble">Bubble Sort</option>
          <option value="insertion">Insertion Sort</option>
          <option value="selection">Selection Sort</option>
          <option value="quick">Quick Sort</option>
          <option value="merge">Merge Sort</option>
        </select>
        <button onClick={startSorting} disabled={sorting}>
          Start Sorting
        </button>
        <button onClick={pauseSorting} disabled={!sorting || paused}>
          Pause
        </button>
        <button onClick={resumeSorting} disabled={!sorting || !paused}>
          Resume
        </button>
        <button onClick={stopSorting}>Stop</button>
      </div>

      <div className="array-container">
        {array.map((value, index) => (
          <div
            className={`array-bar ${sorting ? "highlighted" : ""}`}
            key={index}
            style={{ height: `${value}px`, width: `${500 / arraySize}px` }}
          >
            <span className="bar-label">{value}</span>
          </div>
        ))}
      </div>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default SortingVisualizer;
