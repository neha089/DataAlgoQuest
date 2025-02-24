import React, { useState, useEffect } from 'react';
import './navbar.css'; // Ensure you import the CSS file
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa'; // Profile and logout icons

const DataAlgoQuestNavbar = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    // Check if the user is logged in when the component mounts
    useEffect(() => {
        const token = localStorage.getItem('token');
        const adminFlag = localStorage.getItem('isAdmin');
        if (token || adminFlag) {
            setIsLoggedIn(true);
            if (adminFlag) {
                setIsAdmin(true); // Check if admin is logged in
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin'); // Clear the admin flag
        setIsLoggedIn(false);
        setIsAdmin(false);
        navigate('/');
    };

    const navigateTo = (path) => {
        navigate(path);
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">DataAlgoQuest</div>
           
            <div className="navbar-right">
                {isLoggedIn ? (
                    <>
                        {!isAdmin &&(
                        <FaUserCircle className="navbar-icon" onClick={() => navigateTo('/profile')} title="Profile" />)}
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
