import React, { useState } from 'react';
import DoubleLinkedList from './DoublyLinkedList';
import image from '../assets/icons/link-arrow.jpg'; // Arrow for the links
import "./singly.css";

const DoubleLinkedListComponent = () => {
  const [doubleLinkedList, setDoubleLinkedList] = useState(null);
  const [operationStep, setOperationStep] = useState(-1);
  const [insertOperationStep, setInsertOperationStep] = useState(-1);

  const operations = {
    Creation: 0,
    Insertion: 1,
    Updation: 2,
    Deletion: 3,
    Reverse: 4,
    SourceCode: 5,
  };

  const insertOperations = {
    InsertAtFirst: 0,
    InsertAtEnd: 1,
    InsertAtPosition: 2,
  };

  const updateOperations = {
    UpdateAtHead: 0,
    UpdateAtTail: 1,
    UpdateAtPosition: 2,
  };

  const deleteOperations = {
    DeleteAtFirst: 0,
    DeleteAtEnd: 1,
    DeleteAtPosition: 2,
  };

  const createLinkedList = () => {
    const newLinkedList = new DoubleLinkedList();
    const value = prompt('Enter value to create the head node:');

    if (value) {
      newLinkedList.insertAtHead(value);
      setDoubleLinkedList(newLinkedList); // Set the linked list directly
    } else {
      alert('Please enter a valid value to initialize the linked list.');
    }
  };

  const handleInsertion = (method) => {
    let value = prompt('Enter value:');
    let position;

    if (method === 'InsertAtPosition') {
      position = prompt('Enter position:');
      if (position < 0) {
        alert('Position cannot be negative');
        return;
      }
    }

    if (value) {
      const linkedListCopy = doubleLinkedList; // Use the existing instance directly
      switch (method) {
        case 'InsertAtFirst':
          linkedListCopy.insertAtHead(value);
          break;
        case 'InsertAtEnd':
          linkedListCopy.insertAtTail(value);
          break;
        case 'InsertAtPosition':
          linkedListCopy.insertAtPosition(value, parseInt(position));
          break;
        default:
          break;
      }
      setDoubleLinkedList(linkedListCopy); // Update the state with the modified instance
    } else {
      alert('Please enter valid values.');
    }
  };

  const handleUpdation = (method) => {
    let value = prompt('Enter new value:');
    let position;

    if (method === 'UpdateAtPosition') {
      position = prompt('Enter position:');
      if (position < 0) {
        alert('Position cannot be negative');
        return;
      }
    }

    if (value) {
      const linkedListCopy = doubleLinkedList; // Use the existing instance directly
      switch (method) {
        case 'UpdateAtHead':
          linkedListCopy.updateAtHead(value);
          break;
        case 'UpdateAtTail':
          linkedListCopy.updateAtTail(value);
          break;
        case 'UpdateAtPosition':
          linkedListCopy.updateAtPosition(value, parseInt(position));
          break;
        default:
          break;
      }
      setDoubleLinkedList(linkedListCopy); // Update the state with the modified instance
    } else {
      alert('Please enter a valid value.');
    }
  };

  const handleDeletion = (method) => {
    if (!doubleLinkedList) return; // Exit if there is no linked list
  
    const linkedListCopy = new DoubleLinkedList(); // Create a new instance
    linkedListCopy.head = doubleLinkedList.head; // Copy the head reference
    let position;
  
    if (method === 'DeleteAtPosition') {
      position = prompt('Enter position:');
      if (position < 0) {
        alert('Position cannot be negative');
        return;
      }
    }
  
    switch (method) {
      case 'DeleteAtFirst':
        linkedListCopy.deleteAtHead();
        break;
      case 'DeleteAtEnd':
        linkedListCopy.deleteAtTail();
        break;
      case 'DeleteAtPosition':
        linkedListCopy.deleteAtPosition(parseInt(position));
        break;
      default:
        break;
    }
    setDoubleLinkedList(linkedListCopy); // Update the state with the new instance
  };
  
  const reverseList = () => {
    const linkedListCopy = new DoubleLinkedList(); // Use the existing instance directly
    linkedListCopy.head=doubleLinkedList.head;
    linkedListCopy.reverse();
    setDoubleLinkedList(linkedListCopy); // Update the state with the modified instance
  };
  
  // const SourceCode = () => {
  //   if (doubleLinkedList) {
  //     doubleLinkedList.SourceCode(); // Call SourceCode method from the DoubleLinkedList class
  //   } else {
  //     alert('Please create a linked list first!');
  //   }
  // };
  
  const visualizeList = (node) => {  
    const nodes = [];
    
    const traverse = (currentNode) => {
      if (currentNode === null) {
        return;
      }
      nodes.push(currentNode);
      traverse(currentNode.next);
    };
    
    traverse(node);
    
    return (
      <div className="visualization">
        {/* Add Null at the beginning */}
        <div className="node-container">
          <div className="data-section">
            <p className="m-0">Null</p>
          </div>
          <div className="arrow">
            <img src={image} className="rotate" alt="left-arrow" style={{ transform: 'rotate(180deg)' }}/>
          </div>
        </div>

        {/* Iterate over nodes */}
        {nodes.map((node, index) => (
          <div className="node-container" key={node.data}>
            {/* Left Arrow for Previous Link */}
            <div className="arrow">
              {index !== 0 && ( // If not the first node, show left arrow
                <img src={image} className="rotate" alt="left-arrow" />
              )}
            </div>
  
            {/* Data Section */}
            <div className="data-section">
              <p className="m-0">{node.data}</p>
            </div>
            
            {/* Link Section */}
            <div className="link-section">
              <p className="m-0">Link</p>
            </div>
            
            {/* Right Arrow for Next Link */}
            <div className="arrow">
              {node.next ? (
                <img src={image} className="rotate" alt="right-arrow" style={{ transform: 'rotate(180deg)' }}/>
              ) : (
                <img src={image} className="rotate" alt="right-arrow"  />
              )}
            </div>
          </div>
        ))}

        {/* Add Null at the end */}
        <div className="node-container">
          <div className="data-section">
            <p className="m-0">Null</p>
          </div>
        </div>
      </div>
    );
};

  
  
  return (
    <div className="linked-list-operations">
      <h5>Double Linked List Operations</h5>
      <div className="horizontal-scroll">
        <div
          className={operationStep === operations.Creation ? 'box box-active' : 'box'}
          onClick={createLinkedList}
        >
          <p>Create Linked List</p>
        </div>
        {doubleLinkedList && (
          <>
            <div
              className={operationStep === operations.Insertion ? 'box box-active' : 'box'}
              onClick={() => setOperationStep(operations.Insertion)}
            >
              <p>Insertion</p>
            </div>
            <div
              className={operationStep === operations.Updation ? 'box box-active' : 'box'}
              onClick={() => setOperationStep(operations.Updation)}
            >
              <p>Updation</p>
            </div>
            <div
              className={operationStep === operations.Deletion ? 'box box-active' : 'box'}
              onClick={() => setOperationStep(operations.Deletion)}
            >
              <p>Deletion</p>
            </div>
            <div
              className={operationStep === operations.Reverse ? 'box box-active' : 'box'}
              onClick={reverseList}
            >
              <p>Reverse Linked List</p>
            </div>
            {/* <div
              className={operations.SourceCode === operationStep 
                ? 'box box-active p-lg-2 p-1 px-lg-3 px-2 tab me-lg-4 me-3 mb-2'
                : 'box p-lg-2 p-1 px-lg-3 px-2 tab me-lg-4 me-3 mb-2'}
              onClick={SourceCode}
            >
              <p className="m-0">View Code</p>
            </div> */}
          </>
        )}
      </div>

      {/* Insertion Operations */}
      {operationStep === operations.Insertion && (
        <div>
          <h5>Insertion Operations</h5>
          <div className="horizontal-scroll">
            {Object.keys(insertOperations).map((key) => (
              <div
                key={key}
                className={insertOperationStep === insertOperations[key] ? 'box box-active' : 'box'}
                onClick={() => {
                  setInsertOperationStep(insertOperations[key]);
                  handleInsertion(key);
                }}
              >
                <p>{key.replace(/([A-Z])/g, ' $1').trim()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Updation Operations */}
      {operationStep === operations.Updation && (
        <div>
          <h5>Updation Operations</h5>
          <div className="horizontal-scroll">
            {Object.keys(updateOperations).map((key) => (
              <div
                key={key}
                className={insertOperationStep === updateOperations[key] ? 'box box-active' : 'box'}
                onClick={() => {
                  setInsertOperationStep(updateOperations[key]);
                  handleUpdation(key);
                }}
              >
                <p>{key.replace(/([A-Z])/g, ' $1').trim()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deletion Operations */}
      {operationStep === operations.Deletion && (
        <div>
          <h5>Deletion Operations</h5>
          <div className="horizontal-scroll">
            {Object.keys(deleteOperations).map((key) => (
              <div
                key={key}
                className={insertOperationStep === deleteOperations[key] ? 'box box-active' : 'box'}
                onClick={() => {
                  setInsertOperationStep(deleteOperations[key]);
                  handleDeletion(key);
                }}
              >
                <p>{key.replace(/([A-Z])/g, ' $1').trim()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visualize the Linked List */}
      <h5>Linked List Visualization:</h5>
      <div className="visualization">
        <div>
          {doubleLinkedList && visualizeList(doubleLinkedList.head)}
        </div>
      </div>

    </div>
  );
};

export default DoubleLinkedListComponent;
