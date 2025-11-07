import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [secretCode, setSecretCode] = useState('');
  const navigate = useNavigate();
  const { toast, showSuccess, showError } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('[DEBUG] Datos enviados:', { email, password, role, secretCode });

    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password, 
          role,
          ...(role === 'admin' ? { secretCode } : {})
        }),
      });

      const data = await response.json();
      console.log('[DEBUG] Respuesta del servidor:', data);

      if (data.success) {
        localStorage.setItem('accessToken', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userId', data.user._id);

        showSuccess('Welcome!');
        
        // Redirección con React Router
        const userRole = (data.user.role || '').toLowerCase();
        if (userRole === 'admin') {
          navigate('/home');
        } else if (userRole === 'seller') {
          navigate('/products');
        } else if (userRole === 'user') {
          navigate('/home');
        }
      } else {
        showError(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      showError('Connection error. Please check your internet connection.');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Login</h2>
          <p className="auth-subtitle">Access your account</p>
        </div>
        
        <form onSubmit={handleLogin} className="auth-form">
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
            <label className="auth-label" htmlFor="role">User Type</label>
            <select 
              id="role"
              value={role} 
              onChange={(e) => {
                setRole(e.target.value);
                console.log('[DEBUG] Role cambiado a:', e.target.value);
              }}
              className="auth-select"
            >
              <option value="user">User</option>
              <option value="seller">Seller</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          {role === 'admin' && (
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="secretCode">Admin Secret Code</label>
              <input
                id="secretCode"
                type="text"
                placeholder="Admin Secret Code"
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value)}
                className="auth-input"
                required
              />
            </div>
          )}

          <button type="submit" className="auth-button">
            Sign In
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">Don't have an account?</p>
          <Link to="/register" className="auth-link">Sign up here</Link>
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

export default Login;