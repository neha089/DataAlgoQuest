import React, { useState, useEffect } from 'react';
import './dp.css';
import { useNavigate } from 'react-router-dom';

const KnapsackVisualizer = () => {
  const [items, setItems] = useState([
    { name: 'Item 1', weight: 1, value: 1 },
    { name: 'Item 2', weight: 3, value: 4 },
    { name: 'Item 3', weight: 4, value: 5 },
    { name: 'Item 4', weight: 5, value: 7 },
  ]);
  const [capacity, setCapacity] = useState(7);
  const [dp, setDp] = useState([]);
  const [steps, setSteps] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentCell, setCurrentCell] = useState([0, 0]); // [row, col]
  const [isSelectionDone, setIsSelectionDone] = useState(false);
  const navigate=useNavigate();

  const generateRandomItems = () => {
    const newItems = Array(4)
      .fill()
      .map((_, index) => ({
        name: `Item ${index + 1}`,
        weight: Math.floor(Math.random() * 10) + 1,
        value: Math.floor(Math.random() * 10) + 1,
      }));
    setItems(newItems);
  };

  const addCustomItem = () => {
    const name = prompt('Enter item name:');
    const weight = parseInt(prompt('Enter item weight:'), 10);
    const value = parseInt(prompt('Enter item value:'), 10);
    if (name && weight > 0 && value > 0) {
      setItems([...items, { name, weight, value }]);
    }
  };

  const clearItems = () => {
    setItems([]);
    setDp([]);
    setSteps([]);
    setSelectedItems([]);
    setCurrentCell([0, 0]);
    setIsSelectionDone(false);
  };

  useEffect(() => {
    const solveKnapsack = () => {
      if (!items.length || capacity <= 0) {
        return;
      }

      const n = items.length;
      const dpArray = Array(n + 1)
        .fill()
        .map(() => Array(capacity + 1).fill(0));

      const stepsList = [];

      // Dynamic Programming to solve 0/1 Knapsack
      for (let i = 1; i <= n; i++) {
        for (let w = 1; w <= capacity; w++) {
          const item = items[i - 1];
          let includeItem = 0;
          if (item.weight <= w) {
            includeItem = item.value + dpArray[i - 1][w - item.weight];
          }
          const excludeItem = dpArray[i - 1][w];

          if (includeItem > excludeItem) {
            dpArray[i][w] = includeItem;
            stepsList.push({
              stepDesc: `Include ${item.name}: Value = ${item.value}, Weight = ${item.weight}, Total Value = ${includeItem}`,
              item,
              capacity: w,
              included: true,
              cell: [i, w],
            });
          } else {
            dpArray[i][w] = excludeItem;
            stepsList.push({
              stepDesc: `Exclude ${item.name}: Total Value = ${excludeItem}`,
              item,
              capacity: w,
              included: false,
              cell: [i, w],
            });
          }
        }
      }

      setDp(dpArray);
      setSteps(stepsList);
      setCurrentCell([1, 1]); // Start from the first cell
    };

    solveKnapsack();
  }, [items, capacity]);

  const nextCell = () => {
    const [row, col] = currentCell;
    const nextCol = col < capacity ? col + 1 : 1;
    const nextRow = nextCol === 1 ? row + 1 : row;
    if (nextRow <= items.length) {
      setCurrentCell([nextRow, nextCol]);
    } else {
      // When done, trigger selection process
      setIsSelectionDone(true);
      backtrackSelection();
    }
  };

  const previousCell = () => {
    const [row, col] = currentCell;
    const prevCol = col > 1 ? col - 1 : capacity;
    const prevRow = prevCol === capacity ? row - 1 : row;

    if (prevRow >= 1) {
      setCurrentCell([prevRow, prevCol]);
    }
  };

  const backtrackSelection = () => {
    const selected = [];
    const n = items.length;
    let w = capacity;

    for (let i = n; i > 0 && w > 0; i--) {
      if (dp[i][w] !== dp[i - 1][w]) {
        selected.push(items[i - 1]);
        w -= items[i - 1].weight;
      }
    }

    setSelectedItems(selected);
  };

  return (
    <div className="knapsack-visualizer">
      <h2>0/1 Knapsack Problem Visualizer</h2>
      <p className="capacity-info">Max Capacity: {capacity}</p>

      <div className="controls">
        <button onClick={generateRandomItems}>Generate Random Items</button>
        <button onClick={addCustomItem}>Add Custom Item</button>
        <button onClick={clearItems}>Clear Items</button>
        <input
          type="number"
          value={capacity}
          onChange={(e) => setCapacity(parseInt(e.target.value, 10))}
          placeholder="Set Capacity"
        />
      </div>

      <div className="item-list">
        <p>Items:</p>
        <ul>
          {items.length === 0 ? (
            <li>No items added.</li>
          ) : (
            items.map((item, index) => (
              <li key={index}>
                {item.name} - Weight: {item.weight}, Value: {item.value}
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="dp-visualizer">
        <h3>Dynamic Programming Table:</h3>
        <table className="dp-table">
          <tbody>
            {dp.map((row, i) => (
              <tr key={i}>
                {row.map((value, j) => (
                  <td
                    key={j}
                    className={
                      currentCell[0] === i && currentCell[1] === j
                        ? 'highlight'
                        : ''
                    }
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="step-description">
        <p>{steps.length > 0 && currentCell[0] <= items.length ? steps[(currentCell[0] - 1) * capacity + currentCell[1] - 1]?.stepDesc : "Calculation Complete!"}</p>
      </div>

      <div className="controls">
        <button onClick={previousCell} disabled={currentCell[0] === 1 && currentCell[1] === 1}>
          Previous
        </button>
        <button onClick={nextCell} disabled={isSelectionDone}>
          Next
        </button>
        <button onClick={() => navigate(-1)}>Back</button>
      </div>

      {isSelectionDone && (
        <div className="knapsack-visualization">
          <h3>Thief's Selected Items:</h3>
          <div className="knapsack">
            {selectedItems.map((item, index) => (
              <div key={index} className="knapsack-item">
                <div className="item-label">
                  <span>{item.name}</span>
                  <span>Value: {item.value}</span>
                  <span>Weight: {item.weight}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="thief">
            <img src="thief.avif" alt="Thief" />
          </div>
        </div>
      )}
    </div>
  );
};

export default KnapsackVisualizer;
