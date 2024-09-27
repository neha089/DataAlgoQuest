import React, { useState } from 'react';
import SingleLinkedList from './LinkedList';

const SingleLinkedListComponent = () => {
  const [singleLinkedList, setSingleLinkedList] = useState(null);
  const [operationStep, setOperationStep] = useState(-1);
  const [insertOperationStep, setInsertOperationStep] = useState(-1);
  const [updateOperationStep, setUpdateOperationStep] = useState(-1);
  const [deleteOperationStep, setDeleteOperationStep] = useState(-1);

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
    UpdateAtFirst: 0,
    UpdateAtEnd: 1,
    UpdateAtPosition: 2,
  };

  const deleteOperations = {
    DeleteAtFirst: 0,
    DeleteAtEnd: 1,
    DeleteAtPosition: 2,
  };

  const createLinkedList = () => {
    console.log("Creating Linked List");
    setOperationStep(operations.Creation);
    const newLinkedList = new SingleLinkedList();
    const value = prompt('Enter value to create the head node:');
    
    if (value) {
        newLinkedList.insertAtHead(value);
        setSingleLinkedList(newLinkedList);
        console.log("Linked List created with head value:", value);
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
        switch (method) {
            case 'InsertAtFirst':
                singleLinkedList.insertAtHead(value);
                break;
            case 'InsertAtEnd':
                singleLinkedList.insertAtTail(value);
                break;
            case 'InsertAtPosition':
                singleLinkedList.insertAtPosition(value, parseInt(position));
                break;
            default:
                break;
        }
        setSingleLinkedList({ ...singleLinkedList }); // Trigger re-render
    } else {
        alert('Please enter valid values.');
    }
};


  const handleUpdate = (method) => {
    const value = prompt('Enter new value:');
    let position;

    if (method === 'UpdateAtPosition') {
      position = prompt('Enter position:');
    }

    if (value && (method !== 'UpdateAtPosition' || position)) {
      switch (method) {
        case 'UpdateAtFirst':
          singleLinkedList.updateAtHead(value);
          break;
        case 'UpdateAtEnd':
          singleLinkedList.updateAtTail(value);
          break;
        case 'UpdateAtPosition':
          singleLinkedList.updateAtPosition(value, parseInt(position));
          break;
        default:
          break;
      }
      setSingleLinkedList({ ...singleLinkedList });
    } else {
      alert('Please enter valid values.');
    }
  };

  const handleDeletion = (method) => {
    if (singleLinkedList.head) {
      switch (method) {
        case 'DeleteAtFirst':
          singleLinkedList.deleteAtHead();
          break;
        case 'DeleteAtEnd':
          singleLinkedList.deleteAtTail();
          break;
        case 'DeleteAtPosition':
          const position = prompt('Enter position:');
          if (position) {
            singleLinkedList.deleteAtPosition(parseInt(position));
          } else {
            alert('Please enter a valid position.');
          }
          break;
        default:
          break;
      }
      setSingleLinkedList({ ...singleLinkedList });
    } else {
      alert('Cannot delete. The linked list is empty.');
    }
  };

  const reverseLinkedList = () => {
    if (singleLinkedList.head) {
      singleLinkedList.reverse();
      setSingleLinkedList({ ...singleLinkedList });
    } else {
      alert('Cannot reverse. The linked list is empty.');
    }
  };

  const viewSourceCode = () => {
    setOperationStep(operations.SourceCode);
    // Implement the logic to show source code
  };

  return (
    <div className="linked-list-operations">
      <h5>Single Linked List Operations</h5>
      <div className="horizontal-scroll">
        <div
          className={operationStep === operations.Creation ? 'box box-active' : 'box'}
          onClick={createLinkedList}
        >
          <p>Create Linked List</p>
        </div>
        {singleLinkedList && (
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
              onClick={reverseLinkedList}
            >
              <p>Reverse Linked List</p>
            </div>
            <div
              className={operationStep === operations.SourceCode ? 'box box-active' : 'box'}
              onClick={viewSourceCode}
            >
              <p>View Code</p>
            </div>
          </>
        )}
      </div>

      {/* Insertion Operations */}
      {operationStep === operations.Insertion && (
        <div>
          <h5>Single Linked List Insertion</h5>
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

      {/* Other operations (Updation, Deletion, etc.) would follow a similar pattern */}
    </div>
  );
};

export default SingleLinkedListComponent;
