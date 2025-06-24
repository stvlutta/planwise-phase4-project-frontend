import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

   return (
    <div className="navbar">
      <div className="navbar-content">
        <h1>PlanWise</h1>
        <nav>
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/tasks" 
            className={`nav-link ${location.pathname === '/tasks' ? 'active' : ''}`}
          >
            Tasks
          </Link>
          <Link 
            to="/projects" 
            className={`nav-link ${location.pathname === '/projects' ? 'active' : ''}`}
          >
            Projects
          </Link>
        </nav>
        <div className="navbar-user">
          <span className="user-info">
            Welcome, {user?.username}!
          </span>
          <button onClick={handleLogout} className="btn btn-danger btn-sm">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;