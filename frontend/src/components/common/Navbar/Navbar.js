import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSun, FiMoon, FiArrowLeft, FiUser } from 'react-icons/fi';
import './Navbar.css';

function Navbar({ showBack = false, showAccount = false, onBackClick }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-left">
          <div className="navbar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <div className="navbar-icon">
              <img src="/figures/logo.png" alt="Retogen Logo" />
            </div>
            <span>Retogen</span>
          </div>
          {showBack && (
            <button className="navbar-back-btn" onClick={handleBackClick}>
              <FiArrowLeft />
              <span>Back</span>
            </button>
          )}
        </div>

        <div className="navbar-buttons">
          <button className="navbar-theme-toggle" onClick={toggleTheme}>
            {isDarkMode ? <FiMoon /> : <FiSun />}
          </button>

          {showAccount ? (
            <button 
              className="navbar-btn navbar-btn-account" 
              onClick={() => navigate('/account')}
            >
              <FiUser />
              <span>Account</span>
            </button>
          ) : (
            <>
              <button 
                className="navbar-btn navbar-btn-login" 
                onClick={() => navigate('/login')}
              >
                Login
              </button>
              <button 
                className="navbar-btn navbar-btn-register" 
                onClick={() => navigate('/register')}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;