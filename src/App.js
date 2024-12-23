import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import UserProfile from './components/UserProfile';
import { getProfile } from './utils/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import Report from './components/Report';

const App = () => {
  const [user, setUser] = useState(null);

  // Fetch user data based on token when app is loaded
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getProfile(token)
        .then((data) => {
          console.log('User data fetched:', data);
          setUser(data);
        })
        .catch((err) => console.log('Error fetching profile:', err));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<h1>Welcome to the App</h1>} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/profile" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/profile" />} />
        <Route
          path="/dashboard"
          element={user?.role === 'admin' ? <Dashboard user={user} /> : <Navigate to="/dashboard" />}
        />
        <Route path="/profile" element={user ? <UserProfile /> : <Navigate to="/login" />} />
        <Route path="/report" element={user ? <Report /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
