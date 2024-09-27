import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDatastructure.css';

const AdminDataStructures = () => {
    const [dataStructures, setDataStructures] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState(null);

    // Fetch all data structures
    useEffect(() => {
        axios.get('http://localhost:5000/api/datastructures')
            .then(response => setDataStructures(response.data))
            .catch(error => console.error('Error fetching data structures:', error));
    }, []);

    // Handle add or update data structure
    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            // Update the existing data structure
            axios.put(`http://localhost:5000/api/datastructures/${editingId}`, { name, description })
                .then(response => {
                    const updatedDataStructures = dataStructures.map(ds =>
                        ds._id === editingId ? response.data : ds
                    );
                    setDataStructures(updatedDataStructures);
                    resetForm();
                })
                .catch(error => {
                    console.error('Error updating data structure:', error);
                    setError('Failed to update data structure.');
                });
        } else {
            // Add a new data structure
            axios.post('http://localhost:5000/api/datastructures', { name, description })
                .then(response => {
                    setDataStructures([...dataStructures, response.data]);
                    resetForm();
                })
                .catch(error => {
                    console.error('Error adding data structure:', error);
                    setError('Failed to add data structure.');
                });
        }
    };

    // Handle delete data structure
    const handleDelete = (id) => {
        axios.delete(`http://localhost:5000/api/datastructures/${id}`)
            .then(() => {
                setDataStructures(dataStructures.filter(ds => ds._id !== id));
            })
            .catch(error => {
                console.error('Error deleting data structure:', error);
                setError('Failed to delete data structure.');
            });
    };

    // Handle edit click (populate form with data)
    const handleEdit = (ds) => {
        setName(ds.name);
        setDescription(ds.description);
        setEditingId(ds._id);
    };

    // Reset the form
    const resetForm = () => {
        setName('');
        setDescription('');
        setEditingId(null);
        setError(null);
    };

    return (
        <div>
            <h2>Manage Data Structures</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Data Structure Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <button type="submit">{editingId ? 'Update' : 'Add'} Data Structure</button>
                {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
            </form>

            <ul>
                {dataStructures.map(ds => (
                    <li key={ds._id}>
                        {ds.name} - {ds.description}
                        <button onClick={() => handleEdit(ds)}>Edit</button>
                        <button onClick={() => handleDelete(ds._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminDataStructures;
