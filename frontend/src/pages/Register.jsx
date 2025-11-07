import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';

function Register() {
  console.log('Register component rendered');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const navigate = useNavigate();
  const { toast, showSuccess, showError } = useToast();

  const handleRoleChange = (event) => {
    const newRole = event.target.value;
    console.log('Role changing to:', newRole);
    setRole(newRole);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        showSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        showError(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      showError('Connection error. Please check your internet connection.');
      console.error('Register error:', error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Register</h2>
          <p className="auth-subtitle">Create your account</p>
        </div>
        
        <form onSubmit={handleRegister} className="auth-form">
          <div className="auth-form-group">
            <label className="auth-label" htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="auth-input"
              required
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              required
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              required
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-label" htmlFor="role-select">User Type</label>
            <select
              value={role}
              onChange={handleRoleChange}
              name="role"
              id="role-select"
              className="auth-select"
            >
              <option value="user">User</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          <button type="submit" className="auth-button">
            Sign Up
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">Already have an account?</p>
          <Link to="/login" className="auth-link">Sign in here</Link>
        </div>
      </div>
      
      {/* Toast Messages */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
      />
    </div>
  );
}

export default Register;