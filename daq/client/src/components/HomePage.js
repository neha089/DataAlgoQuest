import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; // Ensure your CSS file is linked
import { FaDatabase, FaCogs } from 'react-icons/fa'; // Import icons

const HomePage = () => {
    const navigate = useNavigate();

    const navigateTo = (path) => {
        navigate(path);
    };

    return (
        <div 
            className="homepage-container"
            style={{ 
                backgroundImage: "url('/ds1.avif')", // Ensure the image is in the public folder
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh',
                position: 'relative',
            }}
        >
            <div className="button-container">
                <div className="circular-button" onClick={() => navigateTo('/dsmainpage')}>
                    <FaDatabase size={40} />
                    <span>Data Structure</span>
                </div>
                <div className="circular-button" onClick={() => navigateTo('/aa')}>
                    <FaCogs size={40} />
                    <span>Algorithm</span>
                </div>
            </div>
            <button className="start-learning" onClick={() => navigateTo('/learningpath')}>
                Start Learning
            </button>
        </div>
    );
};

export default HomePage;
