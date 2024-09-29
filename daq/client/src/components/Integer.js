import React from 'react';
import './style.css'; // Make sure you have the styles you need
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

const Integer = () => {
  const navigate =useNavigate();
  return (
    <div className="subtype-page">
      <h1 className="text-center">Integer</h1>
      <div className="mt-5">
        <p>
          The INTEGER data type stores whole numbers that range from -2,147,483,647 to 2,147,483,647 for 9 or 10 digits of precision.
        </p>
        <p>
          The number 2,147,483,648 is a reserved value and cannot be used. The INTEGER value is stored as a signed binary integer and is
          typically used to store counts, quantities, and so on.
        </p>
        <p>
          Arithmetic operations and sort comparisons are performed more efficiently on integer data than on float or decimal data.
          INTEGER columns, however, cannot store absolute values beyond (2^31-1). If a data value lies outside the numeric range of INTEGER, the database server
          does not store the value.
        </p>
        <p>
          INTEGER data types require 4 bytes of storage per value.
        </p>
      </div>
      <ReadMore /> {/* Assuming you have a ReadMore component */}
      <button onClick={()=>navigate(-1)}>Back</button>
    </div>
  );
};


export default Integer;
