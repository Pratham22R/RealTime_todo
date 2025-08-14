import React, { useState } from 'react';
import ActivityDrawer from './Board/ActivityDrawer';
import ActivityLog from './Board/ActivityLog';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import './Navbar.css';

const Navbar = ({ user }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout } = useLogout();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);
  
  useEffect(() => {
  document.body.style.overflow = menuOpen ? 'hidden' : 'auto';
  return () => (document.body.style.overflow = 'auto');
}, [menuOpen]);
  return (
    <>
      <nav className="navbar-home">
        <div className="navbar-logo">
          <span role="img" aria-label="logo" className="logo-icon">📝</span>
          <span className="logo-text">SyncPath</span>
        </div>

        {/* Navigation links */}
        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <button className="nav-button" onClick={() => setDrawerOpen(true)}>
            Activity Log
          </button>
          {user ? (
            <div className="nav-user-info">
              {location.pathname !== '/dashboard' && (
                <Link 
                  to="/dashboard" 
                  className={`nav-button${location.pathname === '/dashboard' ? ' active' : ''}`}
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
              )}
              <span className="user-greeting">Welcome, {user.username}!</span>
              <button onClick={logout} className="logout-btn">Logout</button>
            </div>
          ) : (
            <>
              <Link 
                to="/login" 
                className={`nav-button${location.pathname === '/login' ? ' active' : ''}`}
                onClick={closeMenu}
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className={`nav-button${location.pathname === '/register' ? ' active' : ''}`}
                onClick={closeMenu}
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="nav-toggle" onClick={toggleMenu}>
          <span className={`bar ${menuOpen ? 'open' : ''}`}></span>
          <span className={`bar ${menuOpen ? 'open' : ''}`}></span>
          <span className={`bar ${menuOpen ? 'open' : ''}`}></span>
        </div>
      </nav>
      <ActivityDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <ActivityLog />
      </ActivityDrawer>
    </>
  );
};

export default Navbar;