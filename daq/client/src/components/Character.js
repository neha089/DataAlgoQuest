import React from 'react';
import './style.css'; // Ensure you have the necessary styles

const Character = () => {
  return (
    <div className="subtype-page">
      <h1 className="text-center">Character</h1>
      <div className="mt-5">
        <p>
          This data type is used to store a single character. The character must be enclosed within single quotes, 
          like ‘E’ or ‘e’. Alternatively, you can also use ASCII values to display certain characters.
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

export default Character;
