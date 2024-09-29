import React from 'react';
import { useNavigate } from 'react-router-dom';

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

const Float = () => {
  const navigate=useNavigate();
  return (
    <div className="subtype-page">
      <h1 className="text-center">Float</h1>
      <div className="mt-5">
        <p>
          You should use a floating point type whenever you need a number with a decimal, such as 8.88 or 3.14515.
        </p>
        <p>
          This data type can store fractional numbers from 3.4e−038 to 3.4e+038. Note that you should end the value with an “f”.
        </p>
        <p>
          The double data type can store fractional numbers from 1.7e−308 to 1.7e+308. Note that you should end the value with a “d”:
        </p>
      </div>
      <ReadMore/>
      <button onClick={()=>navigate(-1)}>Back</button>
    </div>
  );
};

export default Float;
