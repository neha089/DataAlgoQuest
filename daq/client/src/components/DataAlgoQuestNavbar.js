import React, { useState, useEffect } from 'react';
import './navbar.css'; // Ensure you import the CSS file
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa'; // Profile and logout icons

const DataAlgoQuestNavbar = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check if the user is logged in when the component mounts
    useEffect(() => {
        const token = localStorage.getItem('token'); // assuming JWT token is stored in localStorage
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        // Clear token or any user authentication data
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/');
    };

    const navigateTo = (path) => {
        navigate(path);
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">DataAlgoQuest</div>
            <ul className="navbar-nav">
                <li><a href="/features">Features</a></li>
                <li><a href="/courses">Courses</a></li>
                <li><a href="/learn">Learn</a></li>
            </ul>
            <div className="navbar-right">
                {isLoggedIn ? (
                    <>
                        <FaUserCircle className="navbar-icon" onClick={() => navigateTo('/profile')} title="Profile" />
                        <FaSignOutAlt className="navbar-icon" onClick={handleLogout} title="Logout" />
                    </>
                ) : (
                    <>
                        <button className="navbar-right-button" onClick={() => navigateTo('/login')}>Login</button>
                        <button className="navbar-right-button" onClick={() => navigateTo('/signup')}>Register</button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default DataAlgoQuestNavbar;
