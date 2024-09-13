import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css'; // Ensure you import the proper CSS file

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [dataStructures, setDataStructures] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);
  
  // Fetch users
  const fetchUsers = () => {
    axios.get('http://localhost:5000/api/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  };

  // Fetch feedback
  const fetchFeedback = () => {
    axios.get('http://localhost:5000/api/feedback')
      .then(res => setFeedback(res.data))
      .catch(err => console.error(err));
  };

  // Fetch data structures
  const fetchDataStructures = () => {
    axios.get('http://localhost:5000/api/datastructure')
      .then(res => setDataStructures(res.data))
      .catch(err => console.error(err));
  };

  // Handle CRUD for Data Structures
  const addDataStructure = (newDataStructure) => {
    axios.post('http://localhost:5000/api/datastructure', newDataStructure)
      .then(res => setDataStructures([...dataStructures, res.data]))
      .catch(err => console.error(err));
  };

  const updateDataStructure = (id, updatedData) => {
    axios.put(`http://localhost:5000/api/datastructure/${id}`, updatedData)
      .then(res => setDataStructures(dataStructures.map(ds => ds._id === id ? res.data : ds)))
      .catch(err => console.error(err));
  };

  const deleteDataStructure = (id) => {
    axios.delete(`http://localhost:5000/api/datastructure/${id}`)
      .then(() => setDataStructures(dataStructures.filter(ds => ds._id !== id)))
      .catch(err => console.error(err));
  };

  // Similar CRUD handlers for Challenges, Quizzes, and Questions...
  
  const addChallenge = (newChallenge) => {
    axios.post('http://localhost:5000/api/challenges', newChallenge)
      .then(res => setChallenges([...challenges, res.data]))
      .catch(err => console.error(err));
  };

  const updateChallenge = (id, updatedChallenge) => {
    axios.put(`http://localhost:5000/api/challenges/${id}`, updatedChallenge)
      .then(res => setChallenges(challenges.map(ch => ch._id === id ? res.data : ch)))
      .catch(err => console.error(err));
  };

  const deleteChallenge = (id) => {
    axios.delete(`http://localhost:5000/api/challenges/${id}`)
      .then(() => setChallenges(challenges.filter(ch => ch._id !== id)))
      .catch(err => console.error(err));
  };

  const addQuiz = (newQuiz) => {
    axios.post('http://localhost:5000/api/quizzes', newQuiz)
      .then(res => setQuizzes([...quizzes, res.data]))
      .catch(err => console.error(err));
  };

  const updateQuiz = (id, updatedQuiz) => {
    axios.put(`http://localhost:5000/api/quizzes/${id}`, updatedQuiz)
      .then(res => setQuizzes(quizzes.map(qz => qz._id === id ? res.data : qz)))
      .catch(err => console.error(err));
  };

  const deleteQuiz = (id) => {
    axios.delete(`http://localhost:5000/api/quizzes/${id}`)
      .then(() => setQuizzes(quizzes.filter(qz => qz._id !== id)))
      .catch(err => console.error(err));
  };

  const addQuestion = (newQuestion) => {
    axios.post('http://localhost:5000/api/question', newQuestion)
      .then(res => setQuestions([...questions, res.data]))
      .catch(err => console.error(err));
  };

  const updateQuestion = (id, updatedQuestion) => {
    axios.put(`http://localhost:5000/api/question/${id}`, updatedQuestion)
      .then(res => setQuestions(questions.map(q => q._id === id ? res.data : q)))
      .catch(err => console.error(err));
  };

  const deleteQuestion = (id) => {
    axios.delete(`http://localhost:5000/api/question/${id}`)
      .then(() => setQuestions(questions.filter(q => q._id !== id)))
      .catch(err => console.error(err));
  };

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>

      {/* Buttons for showing data */}
      <button onClick={fetchUsers}>Show All Users</button>
      <button onClick={fetchFeedback}>Show All Feedback & Reviews</button>
      <button onClick={fetchDataStructures}>Manage Data Structures</button>

      {/* Users */}
      <section>
        <h2>Users</h2>
        <ul>
          {users.map(user => (
            <li key={user._id}>{user.name} (Email: {user.email})</li>
          ))}
        </ul>
      </section>

      {/* Feedback */}
      <section>
        <h2>Feedback & Reviews</h2>
        <ul>
          {feedback.map(fb => (
            <li key={fb._id}>{fb.user_id}: Feedback: {fb.feedback}</li>
          ))}
        </ul>
      </section>

      {/* Manage Data Structures */}
      <section>
        <h2>Data Structures</h2>
        <button onClick={() => addDataStructure({ name: 'New DS', description: 'Sample description' })}>Add New Data Structure</button>
        {dataStructures.map(ds => (
          <div key={ds._id}>
            <h3>{ds.name}</h3>
            <p>{ds.description}</p>
            <button onClick={() => updateDataStructure(ds._id, { name: 'Updated DS' })}>Update</button>
            <button onClick={() => deleteDataStructure(ds._id)}>Delete</button>
          </div>
        ))}
      </section>

      {/* Similar sections for Challenges, Quizzes, Questions */}
      <section>
        <h2>Coding Challenges</h2>
        {/* Buttons and mapping challenges */}
      </section>

      <section>
        <h2>Quizzes</h2>
        {/* Buttons and mapping quizzes */}
      </section>

      <section>
        <h2>Questions</h2>
        {/* Buttons and mapping questions */}
      </section>
    </div>
  );
};

export default Admin;
