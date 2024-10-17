import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Updated import
import { Helper } from './helper';
import './dsmain.css';

const dataStructure = {
  definition:
    "<b>Data Structure</b>:  A data structure is a specialized format to organizing, processing, retrieving and storing data.<br> Data structures make it easy for users to access and work with data the need in appropriate ways. <br> Most importantly, data structure frame the organization of information so that machines and humans can better understand it",
  terminologies: [
    "Data structures are the building blocks for more sophisticated applications. They are designed by composing data elements into logical unit representing an abstract data type that has relevance to the algorithm or application",
    "It is not only important to use data structures, but it is also important to choose the proper type of data structure for each task. Choosing an ill-suited data structure could result in slow runtimes or unresponsive code",
  ],
  choosing: [
    "What kind of information will be stored",
    "How will that information be used",
    "Where should data persist, or be kept, after it is created",
    "What is the best way to organize the data",
    "What aspects of memory and storage reservation management should be considered",
  ],
  operation: [
    "Storing data",
    "Ordering and storing data",
    "Indexing data",
    "Searching data",
    "Data exchange",
    "Managing resources and services",
    "Scalability",
  ],
  properties: [
    "<b>Primitive data structure</b>:  Primitive data structure are the fundamental data structures. They are also called basic data structures.<br> Primitive data structures are defined by the programming languages, or we can say that it is built-in",
    "<b>Non-primitive data structure</b>:  Non-primitive data structures are the data structures that are created using the primitive data structures",
    "<b>Linear or Non-linear</b>:  Whether the data items are arranged in sequential order, such as array, or in an unordered sequence, such as with a graph",
    "<b>Homogeneous or Heterogeneous</b>:  Whether all data items in a given repository are of the same type, such as array, or of various types, such as an abstract data type defined as a structure or a class",
    "<b>Static or Dynamic</b>:  Static data structures have fixed sizes, structures, and memory locations at compile time.<br> Dynamic data structures have sizes, structures, and memory locations that can shrink or expand, depending on the use",
  ],
};

const TreeNode = ({ name, onClick, isActive }) => {
  const navigate = useNavigate(); // Updated hook
  const navigateToPage = (name) => {
    navigate(`/data-structure/${name}`); // Navigates to /data-structure/Stack
  };
  const handleClick = () => {
    if (name === "Integer") {
      navigate('/integer'); // Updated method
    }
    else if (name === "Float") {
      navigate('/float'); // Updated method
    } 
    else if (name === "Character") {
      navigate('/character'); // Updated method
    } 
    else if (name === "Boolean") {
      navigate('/boolean'); // Updated method
    } 
    else if (name === "Stack") {
      navigateToPage("Stack"); // Updated method
    } 
    else if (name === "Queue") {
      navigateToPage("Queue"); // Updated method
    } 
    else if (name === "Linked List") {
      navigateToPage("Linked List"); // Updated method
    }
    else if (name === "Tree") {
      navigateToPage("Tree"); // Updated method
    } else {
      onClick && onClick();
    }
  };

  return (
    <div
      className={`box-data ${isActive ? 'active-subtype' : ''}`}
      onClick={handleClick}
    >
      <p className="m-0">{name}</p>
    </div>  
  );
};

export default function DataStructureTree() {
  const [activeType, setActiveType] = useState(null);
  const [activeSubType, setActiveSubType] = useState(null);
  const navigate = useNavigate(); // Updated hook

  const handleTypeClick = (type) => {
    setActiveType(type);
    setActiveSubType(null);
  };

  const handleSubTypeClick = (subType) => {
    setActiveSubType(subType);
  };

  return (
    <div className="data-structure-page">
      <h1 className="text-center">Data Structure</h1>
      <div className="content mt-4" dangerouslySetInnerHTML={{ __html: Helper.setHeader(dataStructure.definition) }} />
      <div className="content mt-4" dangerouslySetInnerHTML={{ __html: Helper.setListWithHtml("Why are data structures important", dataStructure.terminologies) }} />
      <div className="content mt-4" dangerouslySetInnerHTML={{ __html: Helper.setListWithHtml("Five features to consider when choosing a data structure", dataStructure.choosing) }} />
      <div className="content mt-4" dangerouslySetInnerHTML={{ __html: Helper.setListWithHtml("How data structures are used", dataStructure.operation) }} />
      <div className="content mt-4" dangerouslySetInnerHTML={{ __html: Helper.setListWithHtml("Types of data structures", dataStructure.properties) }} />

      <div className="tree-container">
        {/* Root Node */}
        <div className="tree-root">
          <TreeNode name="Types of Data Structure" />
        </div>

        <div className="tree-branches">
          {/* Main Root Children */}
          <div className="tree-branch-left">
            <TreeNode name="Primitive Data" onClick={() => handleTypeClick('primitive')} isActive={activeType === 'primitive'} />
          </div>
          <div className="tree-branch-right">
            <TreeNode name="Non-Primitive Data" onClick={() => handleTypeClick('non-primitive')} isActive={activeType === 'non-primitive'} />
          </div>
        </div>

        {/* Primitive Data Subtypes */}
        {activeType === 'primitive' && (
          <div className="tree-subtypes-left">
            <TreeNode name="Integer" onClick={() => console.log('int')} />
            <TreeNode name="Float" onClick={() => console.log('float')} />
            <TreeNode name="Boolean" onClick={() => console.log('bool')} />
            <TreeNode name="Character" onClick={() => console.log('char')} />
          </div>
        )}

        {/* Non-Primitive Data Subtypes */}
        {activeType === 'non-primitive' && (
          <div className="tree-subtypes-right">
            <TreeNode name="Linear Data" onClick={() => handleSubTypeClick('linear')} isActive={activeSubType === 'linear'} />
            <TreeNode name="Non-Linear Data" onClick={() => handleSubTypeClick('non-linear')} isActive={activeSubType === 'non-linear'} />
          </div>
        )}

        {/* Linear Data Subtypes */}
        {activeSubType === 'linear' && (
          <div className="tree-sub-subtypes-left">
            <TreeNode name="Array" onClick={() => console.log('Array')} />
            <TreeNode name="Stack" onClick={() => console.log('Stack')} />
            <TreeNode name="Queue" onClick={() => console.log('Queue')} />
            <TreeNode name="Linked List" onClick={() => console.log('Linked List')} />
          </div>
        )}

        {/* Non-Linear Data Subtypes */}
        {activeSubType === 'non-linear' && (
          <div className="tree-sub-subtypes-right">
            <TreeNode name="Tree" onClick={() => console.log('Tree')} />
            <TreeNode name="Graph" onClick={() => console.log('Graph')} />
            <TreeNode name="Trie" onClick={() => console.log('Trie')} />
            <TreeNode name="Hash Table" onClick={() => console.log('Hash Table')} />
          </div>
        )}
      </div>
      <button onClick={()=>navigate(-1)}>Back</button>

    </div>
  );
}
