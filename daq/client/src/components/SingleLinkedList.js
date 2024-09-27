import React, { useState } from 'react';
import SingleLinkedList from './LinkedList';
import image from '../assets/icons/link-arrow.jpg';

const SingleLinkedListComponent = () => {
    console.log("SingleLinkedListComponent rendered");
    const [singleLinkedList, setSingleLinkedList] = useState(new SingleLinkedList());
    const list = new SingleLinkedList();
list.insert(12);
list.insert(24);
list.insert(36);
    const visualizeList = (node) => {
        if (node !== null) {
          return (
            <div className="node" key={node.data}>
              <p>{node.data}</p>
              <img src={image} width="50" height="20" alt="arrow" />
              {visualizeList(node.next)}
            </div>
          );
        }
        return <p>List is empty.</p>;
      };
      

    const handleInsertAtHead = () => {
        console.log("Inserting at head");
        const value = prompt('Enter value to insert at head:');
        if (value) {
            singleLinkedList.insertAtHead(value);
            setSingleLinkedList({ ...singleLinkedList });
            console.log(singleLinkedList); 
            console.log("Inserted at head:", value); // Add this line
        }
    };
    

    const handleInsertAtTail = () => {
        const value = prompt('Enter value to insert at tail:');
        if (value) {
            singleLinkedList.insertAtTail(value);
            setSingleLinkedList({ ...singleLinkedList });
        }
    };

    const handleInsertAtPosition = () => {
        const value = prompt('Enter value to insert:');
        const position = prompt('Enter position:');
        if (value && position) {
            singleLinkedList.insertAtPosition(value, parseInt(position));
            setSingleLinkedList({ ...singleLinkedList });
        }
    };

    return (
        <div className="linked-list-visualization">
            <h5>Singly Linked List Visualization</h5>
            <div className="buttons">
                <button onClick={handleInsertAtHead}>Insert</button>
                <button onClick={handleInsertAtTail}>Insert at Tail</button>
                <button onClick={handleInsertAtPosition}>Insert at Position</button>
            </div>
            <div className="list-structure">
                {visualizeList(singleLinkedList.head)}
            </div>
            <div id="linked-list-visualization"></div>
        </div>
    );
};

export default SingleLinkedListComponent;
