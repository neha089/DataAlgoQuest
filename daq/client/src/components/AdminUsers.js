import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminUsers.css';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const [editingUserId, setEditingUserId] = useState(null); // For tracking the user being edited
    // const [editedUserName, setEditedUserName] = useState('');
    // const [editedUserEmail, setEditedUserEmail] = useState('');

    // Fetching users on component load
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

    // // Handling user edit
    // const handleEdit = (userId, userName, userEmail) => {
    //     setEditingUserId(userId);
    //     setEditedUserName(userName);
    //     setEditedUserEmail(userEmail);
    // };

    // // Saving the edited user without reloading the page
    // const handleSaveEdit = () => {
    //     axios.put(`http://localhost:5000/api/users/${editingUserId}`, {
    //         name: editedUserName,
    //         email: editedUserEmail
    //     })
    //         .then(response => {
    //             // Optimistically update the users state with the modified user
    //             setUsers(users.map(user => user._id === editingUserId ? { ...user, name: editedUserName, email: editedUserEmail } : user));
    //             setEditingUserId(null);  // Clear editing state
    //         })
    //         .catch(error => {
    //             console.error('Error saving user:', error);
    //             setError('Failed to save user.');
    //         });
    // };

    // Handling user deletion
    const handleDelete = (userId) => {
        console.log(userId);
        axios.delete(`http://localhost:5000/api/users/${userId}`)
            .then(response => {
                // Remove the user from the state without reloading the page
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
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Quiz Score</th>
                            <th>Challenge Score</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                {/* <td>
                                    {editingUserId === user._id ? (
                                        <input
                                            type="text"
                                            value={editedUserName}
                                            onChange={(e) => setEditedUserName(e.target.value)}
                                        />
                                    ) : user.name}
                                </td> */}
                                <td>{user.name}</td>
                                {/* <td>
                                    {editingUserId === user._id ? (
                                        <input
                                            type="email"
                                            value={editedUserEmail}
                                            onChange={(e) => setEditedUserEmail(e.target.value)}
                                        />
                                    ) : user.email}
                                </td> */}
                                <td>{user.email}</td>
                                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                <td>{new Date(user.updated_at).toLocaleDateString()}</td>
                                <td>{user.progress ? user.progress.quiz_scores : 'N/A'}</td>
                                <td>{user.progress ? user.progress.challenge_scores : 'N/A'}</td>
                                <td>
                                    {/* {editingUserId === user._id ? (
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
                                    )} */}
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
