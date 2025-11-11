import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSun, FiMoon } from 'react-icons/fi';

function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
  };

  return (
    <nav>
      <div className="nav-inner">
        <div className="logo">
          <div className="anteater-icon">
            <img src="/figures/logo circle no bg.png" alt="Retogen Logo" />
          </div>
          <span>Retogen</span>
        </div>
        <div className="nav-buttons">
          <button className="theme-toggle" onClick={toggleTheme}>
            {isDarkMode ? <FiMoon /> : <FiSun />}
          </button>
          <button className="btn btn-login" onClick={() => navigate('/login')}>
            Login
          </button>
          <button className="btn btn-register" onClick={() => navigate('/register')}>
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;