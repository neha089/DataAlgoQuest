import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './linklist.css';


const LinkedListVisualizer = () => {
  const [linkedList, setLinkedList] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/data-structures/linked-list');
        setLinkedList(response.data);
      } catch (error) {
        console.error('Error fetching linked list data:', error);
      }
    };

    fetchData();
  }, []);

  const renderList = (node) => {
    if (!node) return null;
    return (
      <div className="node">
        <span>{node.value}</span>
        {node.next && <span className="arrow">→</span>}
        {renderList(node.next)}
      </div>
    );
  };

  return (
    <div className="linked-list-visualizer">
      {linkedList ? renderList(linkedList.head) : 'Loading...'}
    </div>
  );
};

export default LinkedListVisualizer;
