// client/src/components/Admin/AdminNavbar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminNavbar.css';

const AdminNavbar = () => {
    return (
        <nav className="admin-navbar">
            <ul>
                <li><NavLink to="/Admin/users" activeClassName="active">Users</NavLink></li>
                <li><NavLink to="/Admin/feedback" activeClassName="active">Feedback</NavLink></li>
                <li><NavLink to="/Admin/datastructures" activeClassName="active">Data Structures</NavLink></li>
                <li><NavLink to="/Admin/quizzes" activeClassName="active">Quizzes</NavLink></li>
                <li><NavLink to="/Admin/challenges" activeClassName="active">Challenges</NavLink></li>
                {/* <li><NavLink to="/Admin/questions" activeClassName="active">Questions</NavLink></li> */}
            </ul>
        </nav>
    );
}

export default AdminNavbar;
