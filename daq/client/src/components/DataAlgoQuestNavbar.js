import React from 'react';
import './style.css'; // Ensure you import the CSS file

const DataAlgoQuestNavbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">DataAlgoQuest</div>
            <ul className="navbar-nav">
                <li><a href="/features">Features</a></li>
                <li><a href="/courses">Courses</a></li>
                <li><a href="/learn">Learn</a></li>
            </ul>
            <div className="navbar-right">
            <button className="navbar-right-button">Login</button>
                <button className="navbar-right-button">Register</button>
            </div>
        </nav>
    );
}

export default DataAlgoQuestNavbar;
