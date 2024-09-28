import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SinglyLinkedListVisualization from './SinglyLinkedListVisualization';
import DoublyLinkedListVisualization from './DoublyVisualization';
const LinkedListComponent = () => {
  const [step, setStep] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const stepParam = params.get('step');
    if (stepParam) {
      setStep(parseInt(stepParam, 10));
    }
  }, [location]);

  const selectionOfType = (index) => {
    setStep(index);
  };

  return (
    <div>
      <h1 className="text-center">Linked List</h1>

      <div className="d-flex mt-lg-5 mt-4 horizontal-scroll">
        <div
          className={step === 0 ? 'box box-active p-lg-2 p-1 px-lg-3 px-2 tab me-lg-4 me-3 mb-2' : 'box p-lg-2 p-1 px-lg-3 px-2 tab me-lg-4 me-3 mb-2'}
          onClick={() => selectionOfType(0)}
        >
          <p className="m-0">Single Linked List</p>
        </div>
        <div
          className={step === 1 ? 'box box-active p-lg-2 p-1 px-lg-3 px-2 tab me-lg-4 me-3 mb-2' : 'box p-lg-2 p-1 px-lg-3 px-2 tab me-lg-4 me-3 mb-2'}
          onClick={() => selectionOfType(1)}
        >
          <p className="m-0">Double Linked List</p>
        </div>
      </div>

      <div className="mt-3">
        {step === 0 && <SinglyLinkedListVisualization />}
        {step === 1 && <DoublyLinkedListVisualization />}
      </div>
    </div>
  );
};

export default LinkedListComponent;
