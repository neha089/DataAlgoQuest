import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login_logout.css';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate= useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (email === 'admin123@gmail.com' && password === 'admin123') {
      localStorage.setItem('isAdmin', true); // Store an admin flag in local storage
      navigate('/admin'); // Redirect to the admin page
      window.location.reload();
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
      // Store token in local storage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      navigate('/');
      window.location.reload();
    } catch (err) {
      setError('Invalid login credentials');
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin} >
      <h2>Login</h2>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p>{error}</p>}
        <button type="submit">Login</button>
        <a href='/signup'>Create an Account</a>
      </form>
    </div>
  );
};

export default Login;
