import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminUsers.css';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingUserId, setEditingUserId] = useState(null); // For tracking the user being edited
    const [editedUserName, setEditedUserName] = useState('');
    const [editedUserEmail, setEditedUserEmail] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/api/users')
            .then(response => {
                setUsers(response.data.users);  // Accessing the users array in the response
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                setError('Failed to load users.');
                setLoading(false);
            });
    }, []);
    
    const handleEdit = (userId, userName, userEmail) => {
        // Start editing the selected user
        setEditingUserId(userId);
        setEditedUserName(userName);
        setEditedUserEmail(userEmail);
    };

    const handleSaveEdit = () => {
        axios.put(`http://localhost:5000/api/users/${editingUserId}`, {
            name: editedUserName,
            email: editedUserEmail
        })
            .then(response => {
                setUsers(users.map(user => user._id === editingUserId ? response.data : user));
                setEditingUserId(null);
            })
            .catch(error => {
                console.error('Error saving user:', error);
                setError('Failed to save user.');
            });
    };

    const handleDelete = (userId) => {
        axios.delete(`http://localhost:5000/api/users/${userId}`)
            .then(response => {
                setUsers(users.filter(user => user._id !== userId));
            })
            .catch(error => {
                console.error('Error deleting user:', error);
            });
    };

    return (
        <div className="admin-users">
            <h2>Users</h2>
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            {!loading && !error && (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>
                                    {editingUserId === user._id ? (
                                        <input
                                            type="text"
                                            value={editedUserName}
                                            onChange={(e) => setEditedUserName(e.target.value)}
                                        />
                                    ) : user.name}
                                </td>
                                <td>
                                    {editingUserId === user._id ? (
                                        <input
                                            type="email"
                                            value={editedUserEmail}
                                            onChange={(e) => setEditedUserEmail(e.target.value)}
                                        />
                                    ) : user.email}
                                </td>
                                <td>
                                    {editingUserId === user._id ? (
                                        <button className="btn-save" onClick={handleSaveEdit}>
                                            Save
                                        </button>
                                    ) : (
                                        <button 
                                            className="btn-edit" 
                                            onClick={() => handleEdit(user._id, user.name, user.email)}
                                        >
                                            Edit
                                        </button>
                                    )}
                                    <button 
                                        className="btn-delete" 
                                        onClick={() => handleDelete(user._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AdminUsers;
