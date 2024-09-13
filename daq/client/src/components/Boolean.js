import React from 'react';
import './style.css'; // Ensure you have the necessary styles

const Boolean = () => {
  return (
    <div className="subtype-page">
      <h1 className="text-center">Boolean</h1>
      <div className="mt-5">
      <p>A boolean data type comprises of a bit of information and can store only true or false values.
       This data type is used to track true/false conditions.
        </p>
      </div>
      <ReadMore />
    </div>
  );
};

const ReadMore = () => {
  return (
    <div className="read-more">
      <a 
        href="https://www.edureka.co/blog/data-types-in-java/"
        target="_blank" 
        rel="noopener noreferrer"
        className="read-more-link"
      >
        Read more...
      </a>
    </div>
  );
};

export default Boolean;
