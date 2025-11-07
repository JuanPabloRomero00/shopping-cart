import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductManagement from './pages/ProductManagement';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import './styles/main.css';

// Componente para rutas protegidas
function ProtectedRoute({ children, allowedRoles = [] }) {
  const token = localStorage.getItem('accessToken');
  const userRole = localStorage.getItem('userRole');
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/home" />;
  }
  
  return children;
}

function Navigation() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isLoggedIn = localStorage.getItem('accessToken');
  const userRole = localStorage.getItem('userRole');

  if (isAuthPage) {
    return (
      <nav className="auth-nav">
        <div className="auth-nav-container">
          <Link 
            to="/login" 
            className={`auth-nav-link ${location.pathname === '/login' ? 'active' : ''}`}
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className={`auth-nav-link ${location.pathname === '/register' ? 'active' : ''}`}
          >
            Register
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="main-nav">
      <div className="main-nav-container">
        <div className="main-nav-links">
          {!isLoggedIn && (
            <>
              <li><Link to="/login" className="main-nav-link">Login</Link></li>
              <li><Link to="/register" className="main-nav-link">Register</Link></li>
            </>
          )}
          {isLoggedIn && userRole === 'user' && (
            <>
              <li><Link to="/home" className="main-nav-link">Home</Link></li>
              <li><Link to="/cart" className="main-nav-link">Cart</Link></li>
              <li><Link to="/profile" className="main-nav-link">Profile</Link></li>
            </>
          )}
          {isLoggedIn && userRole === 'seller' && (
            <>
              <li><Link to="/products" className="main-nav-link">Manage Products</Link></li>
              <li><Link to="/home" className="main-nav-link">Home</Link></li>
              <li><Link to="/profile" className="main-nav-link">Profile</Link></li>
            </>
          )}
          {isLoggedIn && userRole === 'admin' && (
            <>
              <li><Link to="/home" className="main-nav-link">Home</Link></li>
              <li><Link to="/dashboard" className="main-nav-link">Dashboard</Link></li>
              <li><Link to="/profile" className="main-nav-link">Profile</Link></li>
            </>
          )}
        </div>
        {isLoggedIn && (
          <button
            className="logout-button"
            onClick={() => {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('userRole');
              localStorage.removeItem('userId');
              window.location.href = '/login';
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <div className="app-container">
      <Router>
        <Navigation />
        <Routes>
        {/* Ruta raíz */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Rutas públicas */}
        <Route path="/login" element={
          !localStorage.getItem('accessToken') ? <Login /> : <Navigate to="/home" />
        } />
        <Route path="/register" element={
          !localStorage.getItem('accessToken') ? <Register /> : <Navigate to="/home" />
        } />
        
        {/* Rutas protegidas */}
        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        
        <Route path="/cart" element={
          <ProtectedRoute allowedRoles={['user']}>
            <Cart />
          </ProtectedRoute>
        } />
        
        <Route path="/products" element={
          <ProtectedRoute allowedRoles={['seller']}>
            <ProductManagement />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/products" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ProductManagement />
          </ProtectedRoute>
        } />
        </Routes>
      </Router>
    </div>
  );
}

export default App;