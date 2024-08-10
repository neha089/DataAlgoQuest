import React from 'react';
import './Home.css';
import { useHistory } from 'react-router-dom';

const projects = [
  {
    name: "Example Project",
    description: "This is an example project description that is very long and needs to be truncated.",
    url: "/example-project"
  }
  // Add other projects here
];

const Home = () => {
  const history = useHistory();

  const redirect = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div>
      <h1 className='text-center mt-lg-5 mt-5 pt-lg-5'>Data Structures and Algorithms</h1>
      <div className="mt-5">
        <div className="row mt-5 pt-5">
          <div className="col-lg-2"></div>
          <div className="col-lg-4 col-6">
            <div className="d-flex justify-content-center">
              <div className="circle text-center" onClick={() => history.push('/data-structure')}>
                <img className="img-fluid col-lg-6 col-6" src="assets/icons/ds-icon.webp" alt="Data Structure and Algorithms" />
              </div>
            </div>
            <h4 className="text-center mt-3">Data Structure</h4>
          </div>
          <div className="col-lg-4 col-6">
            <div className="d-flex justify-content-center">
              <div className="circle text-center" onClick={() => history.push('/algorithm')}>
                <img className="img-fluid col-lg-6 col-6" src="assets/icons/algo-icon.webp" alt="Algorithms" />
              </div>
            </div>
            <h4 className="text-center mt-3">Algorithms</h4>
          </div>
          <div className="col-lg-2"></div>
        </div>
      </div>
      <div className="container">
        <h4 className="text-center mt-3">DSA Problem Solving Trick</h4>
        <div className="mt-4 d-flex align-items-center horizontal-scroll pt-3">
          <div className="project-card floating-card me-3 p-md-4 p-3 col-md-4 col-12 tab" onClick={() => history.push('/problem-solving-trick/string')}>
            <h4 className="text-uppercase">String</h4>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="mt-4 d-flex align-items-center horizontal-scroll pt-3">
          {projects.map((project, index) => (
            <div key={index} className="project-card floating-card me-3 p-md-4 p-3 col-md-4 col-12 tab" onClick={() => redirect(project.url)}>
              <h4 className="text-uppercase">{project.name}</h4>
              <p className="m-0">{project.description.length > 80 ? `${project.description.substring(0, 80)}...` : project.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
