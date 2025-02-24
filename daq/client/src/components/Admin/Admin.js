import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; 
import AdminNavbar from './Navabar/AdminNavbar';
import AdminUsers from './User/AdminUsers';
import AdminFeedback from './Feedback/AdminFeedback';
import AdminDataStructures from './DataStructure/AdminDataStructures';
import AdminQuizzes from './Quizz/AdminQuizzes';
import AdminChallenges from './Challenges/AdminChallenges';
import AdminQuestions from './Question/AdminQuestions';

const Admin = () => {
    return (
        <div className="admin-container">
            <AdminNavbar />
            <div className="admin-content">
                <Routes>
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="feedback" element={<AdminFeedback />} />
                    <Route path="datastructures" element={<AdminDataStructures />} />
                    <Route path="quizzes" element={<AdminQuizzes />} />
                    <Route path="quizzes/question/:quizId" element={<AdminQuestions />} /> {/* Updated path */}
                    <Route path="challenges" element={<AdminChallenges />} />

                    {/* Redirect from /admin to /admin/users */}
                    <Route path="/" element={<Navigate to="users" />} /> {/* Default redirect */}
                </Routes>
            </div>
        </div>
    );
}

export default Admin;
