import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdminUsers from './AdminUsers';
import AdminFeedback from './AdminFeedback';
import AdminDataStructures from './AdminDataStructures';
import AdminQuizzes from './AdminQuizzes';
import AdminChallenges from './AdminChallenges';
import AdminQuestions from './AdminQuestions';

const Admin = () => {
    return (
        <div className="admin-container">
            <AdminNavbar />
            <div className="admin-content">
                <Routes>
                    <Route path="users" element={<AdminUsers />} /> {/* Route fixed */}
                    <Route path="feedback" element={<AdminFeedback />} />
                    <Route path="datastructures" element={<AdminDataStructures />} />
                    <Route path="quizzes" element={<AdminQuizzes />} />
                    <Route path="challenges" element={<AdminChallenges />} />
                    <Route path="questions" element={<AdminQuestions />} />
                </Routes>
            </div>
        </div>
    );
}

export default Admin;
