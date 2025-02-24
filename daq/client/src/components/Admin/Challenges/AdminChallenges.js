import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminChallenges = () => {
    const [challenges, setChallenges] = useState([]);
    const [title, setTitle] = useState('');
    const [problemStatement, setProblemStatement] = useState('');
    const [link, setLink] = useState('');
    const [level, setLevel] = useState('easy');
    const [dataStructureId, setDataStructureId] = useState('');
    const [revision, setRevision] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState(null);

    // Fetch all coding challenges
    useEffect(() => {
        axios.get('http://localhost:5000/api/challenges')
            .then(response => setChallenges(response.data))
            .catch(error => console.error('Error fetching coding challenges:', error));
    }, []);

    // Handle add or update challenge
    const handleSubmit = (e) => {
        e.preventDefault();
        const challengeData = { title, problem_statement: problemStatement, link, level, data_structure_id: dataStructureId, revision };

        if (editingId) {
            // Update existing challenge
            axios.put(`http://localhost:5000/api/challenges/${editingId}`, challengeData)
                .then(response => {
                    const updatedChallenges = challenges.map(challenge =>
                        challenge._id === editingId ? response.data : challenge
                    );
                    setChallenges(updatedChallenges);
                    resetForm();
                })
                .catch(error => {
                    console.error('Error updating coding challenge:', error);
                    setError('Failed to update coding challenge.');
                });
        } else {
            // Add a new coding challenge
            axios.post('http://localhost:5000/api/challenges', challengeData)
                .then(response => {
                    setChallenges([...challenges, response.data]);
                    resetForm();
                })
                .catch(error => {
                    console.error('Error adding coding challenge:', error);
                    setError('Failed to add coding challenge.');
                });
        }
    };

    // Handle delete challenge
    const handleDelete = (id) => {
        axios.delete(`http://localhost:5000/api/challenges/${id}`)
            .then(() => {
                setChallenges(challenges.filter(challenge => challenge._id !== id));
            })
            .catch(error => {
                console.error('Error deleting coding challenge:', error);
                setError('Failed to delete coding challenge.');
            });
    };

    // Handle edit click (populate form with data)
    const handleEdit = (challenge) => {
        setTitle(challenge.title);
        setProblemStatement(challenge.problem_statement);
        setLink(challenge.link);
        setLevel(challenge.level);
        setDataStructureId(challenge.data_structure_id);
        setRevision(challenge.revision);
        setEditingId(challenge._id);
    };

    // Reset the form
    const resetForm = () => {
        setTitle('');
        setProblemStatement('');
        setLink('');
        setLevel('easy');
        setDataStructureId('');
        setRevision(false);
        setEditingId(null);
        setError(null);
    };

    return (
        <div>
            <h2>Manage Coding Challenges</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Problem Statement"
                    value={problemStatement}
                    onChange={(e) => setProblemStatement(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    required
                />
                <select value={level} onChange={(e) => setLevel(e.target.value)} required>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
                <input
                    type="text"
                    placeholder="Data Structure ID"
                    value={dataStructureId}
                    onChange={(e) => setDataStructureId(e.target.value)}
                    required
                />
                {/* <label>
                    Revision:
                    <input
                        type="checkbox"
                        checked={revision}
                        onChange={(e) => setRevision(e.target.checked)}
                    />
                </label> */}
                <button type="submit">{editingId ? 'Update' : 'Add'} Challenge</button>
                {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
            </form>

            <ul>
                {challenges.map(challenge => (
                    <li key={challenge._id}>
                        <strong>{challenge.title}</strong> - {challenge.problem_statement}
                        <br />
                        <em>Level: {challenge.level}</em> | Data Structure ID: {challenge.data_structure_id}
                        <br />
                        <a href={challenge.link} target="_blank" rel="noopener noreferrer">Solve Challenge</a>
                        <button onClick={() => handleEdit(challenge)}>Edit</button>
                        <button onClick={() => handleDelete(challenge._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminChallenges;
