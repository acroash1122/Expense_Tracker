// src/pages/Login.js
import React, { useState, useEffect } from 'react';
import '../styles/Login.css';
import axios from 'axios';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const isValid = userId && userId !== 'null' && token && token !== 'null';
    if (!isValid) {
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      const userId = res.data?.user?.id;
      const token = res.data?.token;

      if (!userId || !token) {
        throw new Error("Invalid login response from server.");
      }

      localStorage.setItem('userId', userId);
      localStorage.setItem('token', token);
      setMessage('✅ Login successful!');
      window.location.href = '/dashboard';
    } catch (err) {
      console.error("❌ Login error:", err);
      setMessage(err.response?.data?.message || '❌ Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="login-page">
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Login to Dashboard</h2>

      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />

      <input
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>

      {message && (
        <p>{message}</p>
      )}
       {/* 🟢 Register link */}
      <p style={{ marginTop: '1.5rem', fontSize: '0.95rem', color: '#374151' }}>
        Don't have an account?{' '}
        <a href="/register" className="text-blue-600 hover:underline">
          Register here
        </a>
      </p>
    </form>
  </div>
);

};

export default Login;
