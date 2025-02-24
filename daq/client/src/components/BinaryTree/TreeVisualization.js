import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TreeComponent = () => {
  const [step, setStep] = useState(0);
  const location = useLocation();
  const navigate =useNavigate();

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
      <h1 className="text-center">Tree</h1>

      <div className="d-flex mt-lg-5 mt-4 horizontal-scroll">
        <div
          className={'box box-active p-lg-2 p-1 px-lg-3 px-2 tab me-lg-4 me-3 mb-2'}
          onClick={() => navigate('/data-structure/Tree/BinaryTree')}
        >
          <p className="m-0">Binary Tree</p>
        </div>
        <div
          className={step === 1 ? 'box box-active p-lg-2 p-1 px-lg-3 px-2 tab me-lg-4 me-3 mb-2' : 'box p-lg-2 p-1 px-lg-3 px-2 tab me-lg-4 me-3 mb-2'}
          onClick={() => selectionOfType(1)}
        >
          <p className="m-0">Binary Search Tree</p>
        </div>
        <div
          className={step === 1 ? 'box box-active p-lg-2 p-1 px-lg-3 px-2 tab me-lg-4 me-3 mb-2' : 'box p-lg-2 p-1 px-lg-3 px-2 tab me-lg-4 me-3 mb-2'}
          onClick={() => selectionOfType(2)}
        >
          <p className="m-0">AVL Tree</p>
        </div>
        <div
          className={step === 1 ? 'box box-active p-lg-2 p-1 px-lg-3 px-2 tab me-lg-4 me-3 mb-2' : 'box p-lg-2 p-1 px-lg-3 px-2 tab me-lg-4 me-3 mb-2'}
          onClick={() => selectionOfType(3)}
        >
          <p className="m-0">Heap Tree</p>
        </div>
      </div>

    </div>
  );
};

export default TreeComponent;
