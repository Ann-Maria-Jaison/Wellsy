import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Dashboard from './components/Dashboard';
import DailyTracking from './components/DailyTracking';
import InsightsPage from './components/InsightsPage';
import ResourcesPage from './components/ResourcesPage';
import Game from './components/Game';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Register from './components/Register';

function App() {
  const [user, setUser] = useState(null);
  const [userChallenges, setUserChallenges] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user and challenges from localStorage on mount
    const storedUser = localStorage.getItem('user');
    const storedChallenges = localStorage.getItem('userChallenges');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    
    if (storedChallenges) {
      setUserChallenges(JSON.parse(storedChallenges));
    }
    
    setLoading(false);
  }, []);

  // Save user and challenges to localStorage when they change
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    if (userChallenges.length > 0) {
      localStorage.setItem('userChallenges', JSON.stringify(userChallenges));
    } else {
      localStorage.removeItem('userChallenges');
    }
  }, [userChallenges]);

  const handleChallengeUpdate = (challengeId, action) => {
    if (action === 'add') {
      setUserChallenges(prev => [...prev, challengeId]);
      // Dispatch custom event for cross-component communication
      window.dispatchEvent(new CustomEvent('challengeUpdate', { 
        detail: { challengeId, action: 'add' }
      }));
    } else if (action === 'remove') {
      setUserChallenges(prev => prev.filter(id => id !== challengeId));
      window.dispatchEvent(new CustomEvent('challengeUpdate', { 
        detail: { challengeId, action: 'remove' }
      }));
    }
  };

  const handleLogin = async (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    // Fetch user's challenges after login
    try {
      const response = await axios.get('/api/challenges/user');
      setUserChallenges(response.data.map(challenge => challenge._id));
    } catch (error) {
      console.error('Error fetching user challenges:', error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setUserChallenges([]);
    localStorage.clear();
  };

  // Listen for storage events to sync across tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'userChallenges') {
        setUserChallenges(JSON.parse(e.newValue || '[]'));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated && <Navbar onLogout={handleLogout} />}
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route 
              path="/" 
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/login" 
              element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/register" 
              element={!isAuthenticated ? <Register onLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/dashboard" 
              element={isAuthenticated ? <Dashboard user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/daily-tracking" 
              element={isAuthenticated ? <DailyTracking user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/insights" 
              element={isAuthenticated ? <InsightsPage user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/resources" 
              element={isAuthenticated ? <ResourcesPage /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/games" 
              element={isAuthenticated ? <Game /> : <Navigate to="/login" />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App; 