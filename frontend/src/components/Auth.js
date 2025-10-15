import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiSun, FiMoon, FiArrowLeft } from 'react-icons/fi';

function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    rememberMe: false
  });

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your authentication logic here
    console.log('Form submitted:', formData);
  };

  return (
    <>
      <div className="bg-shape-1"></div>
      <div className="bg-shape-2"></div>
      <div className="bg-shape-3"></div>

      <nav>
        <div className="nav-inner">
          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <div className="anteater-icon">
              <img src="/figures/logo circle no bg.png" alt="Retogen Logo" />
            </div>
            <span>Retogen</span>
          </div>
          <div className="nav-buttons">
            <button className="theme-toggle" onClick={toggleTheme}>
              {isDarkMode ? <FiMoon /> : <FiSun />}
            </button>
            <button className="btn btn-back" onClick={() => navigate('/')}>
              <FiArrowLeft style={{ marginRight: '6px' }} />
              Back to Home
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="auth-container">
          <div className="auth-card">
            <h2 className="auth-title">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="auth-subtitle">
              {isLogin 
                ? 'Sign in to continue to Retogen' 
                : 'Join our community of honest reviewers'}
            </p>

            <form onSubmit={handleSubmit} className="auth-form">
              {!isLogin && (
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Choose a username"
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              )}

              {isLogin && (
                <div className="form-extras">
                  <label className="checkbox-container">
                    <input 
                      type="checkbox" 
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                    />
                    <span className="checkmark"></span>
                    <span className="checkbox-text">Remember me</span>
                  </label>
                  <a href="#" className="forgot-link">Forgot password?</a>
                </div>
              )}

              <button type="submit" className="btn btn-register auth-submit">
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <div className="auth-switch">
              {isLogin ? (
                <p>
                  Don't have an account?{' '}
                  <span 
                    className="auth-link" 
                    onClick={() => navigate('/register')}
                  >
                    Sign up
                  </span>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <span 
                    className="auth-link" 
                    onClick={() => navigate('/login')}
                  >
                    Sign in
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 100px);
          padding: 40px 20px;
        }

        .auth-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          padding: 48px;
          width: 100%;
          max-width: 460px;
          border: 1px solid rgba(100, 100, 100, 0.1);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
        }

        body.dark-mode .auth-card {
          background: rgba(42, 42, 42, 0.7);
          border-color: rgba(200, 200, 200, 0.1);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
        }

        .auth-title {
          color: #2a2a2a;
          font-size: 32px;
          margin-bottom: 8px;
          text-align: center;
          font-weight: 700;
        }

        body.dark-mode .auth-title {
          color: #f5f5f5;
        }

        .auth-subtitle {
          color: #6b7280;
          font-size: 15px;
          text-align: center;
          margin-bottom: 32px;
        }

        body.dark-mode .auth-subtitle {
          color: #b8b8b8;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          color: #2a2a2a;
          font-size: 14px;
          font-weight: 600;
        }

        body.dark-mode .form-label {
          color: #f5f5f5;
        }

        .form-input {
          padding: 12px 16px;
          border: 2px solid rgba(100, 100, 100, 0.15);
          border-radius: 8px;
          font-size: 15px;
          background: rgba(255, 255, 255, 0.5);
          color: #2a2a2a;
          transition: all 0.3s ease;
          font-family: 'Poppins', sans-serif;
        }

        .form-input:focus {
          outline: none;
          border-color: #00ced1;
          background: rgba(255, 255, 255, 0.8);
        }

        body.dark-mode .form-input {
          background: rgba(60, 60, 60, 0.5);
          border-color: rgba(200, 200, 200, 0.15);
          color: #f5f5f5;
        }

        body.dark-mode .form-input:focus {
          background: rgba(60, 60, 60, 0.8);
          border-color: #5dd7da;
        }

        .form-input::placeholder {
          color: #9ca3af;
        }

        body.dark-mode .form-input::placeholder {
          color: #888;
        }

        .form-extras {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: -8px;
        }

        /* Custom Checkbox Styling */
        .checkbox-container {
          display: flex;
          align-items: center;
          position: relative;
          cursor: pointer;
          user-select: none;
          gap: 10px;
        }

        .checkbox-container input[type="checkbox"] {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }

        .checkmark {
          position: relative;
          height: 20px;
          width: 20px;
          background: rgba(255, 255, 255, 0.5);
          border: 2px solid rgba(100, 100, 100, 0.2);
          border-radius: 4px;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        body.dark-mode .checkmark {
          background: rgba(60, 60, 60, 0.5);
          border-color: rgba(200, 200, 200, 0.2);
        }

        .checkbox-container:hover .checkmark {
          background: rgba(255, 255, 255, 0.8);
          border-color: rgba(100, 100, 100, 0.3);
        }

        body.dark-mode .checkbox-container:hover .checkmark {
          background: rgba(60, 60, 60, 0.8);
          border-color: rgba(200, 200, 200, 0.3);
        }

        .checkbox-container input:checked ~ .checkmark {
          background: #00ced1;
          border-color: #00ced1;
        }

        body.dark-mode .checkbox-container input:checked ~ .checkmark {
          background: #5dd7da;
          border-color: #5dd7da;
        }

        .checkmark::after {
          content: "";
          position: absolute;
          display: none;
          left: 6px;
          top: 2px;
          width: 5px;
          height: 10px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        .checkbox-container input:checked ~ .checkmark::after {
          display: block;
        }

        .checkbox-text {
          color: #6b7280;
          font-size: 14px;
          font-weight: 500;
        }

        body.dark-mode .checkbox-text {
          color: #b8b8b8;
        }

        .forgot-link {
          color: #00ced1;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .forgot-link:hover {
          color: #00b8bb;
        }

        body.dark-mode .forgot-link {
          color: #5dd7da;
        }

        body.dark-mode .forgot-link:hover {
          color: #7de2e5;
        }

        .auth-submit {
          width: 100%;
          margin-top: 8px;
          padding: 14px;
          font-size: 16px;
        }

        .auth-divider {
          position: relative;
          text-align: center;
          margin: 28px 0;
        }

        .auth-divider::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          width: 100%;
          height: 1px;
          background: rgba(100, 100, 100, 0.15);
        }

        body.dark-mode .auth-divider::before {
          background: rgba(200, 200, 200, 0.15);
        }

        .auth-divider span {
          position: relative;
          padding: 0 16px;
          background: rgba(255, 255, 255, 0.7);
          color: #6b7280;
          font-size: 14px;
        }

        body.dark-mode .auth-divider span {
          background: rgba(42, 42, 42, 0.7);
          color: #b8b8b8;
        }

        .auth-switch {
          text-align: center;
        }

        .auth-switch p {
          color: #6b7280;
          font-size: 14px;
        }

        body.dark-mode .auth-switch p {
          color: #b8b8b8;
        }

        .auth-link {
          color: #00ced1;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .auth-link:hover {
          color: #00b8bb;
          text-decoration: underline;
        }

        body.dark-mode .auth-link {
          color: #5dd7da;
        }

        body.dark-mode .auth-link:hover {
          color: #7de2e5;
        }

        .btn-back {
          background: transparent;
          color: #6b7280;
          border: 2px solid rgba(100, 100, 100, 0.2);
          padding: 8px 16px;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .btn-back:hover {
          background: rgba(100, 100, 100, 0.08);
          color: #2a2a2a;
          border-color: rgba(100, 100, 100, 0.3);
        }

        body.dark-mode .btn-back {
          color: #b8b8b8;
          border-color: rgba(200, 200, 200, 0.2);
        }

        body.dark-mode .btn-back:hover {
          background: rgba(200, 200, 200, 0.1);
          color: #f5f5f5;
          border-color: rgba(200, 200, 200, 0.3);
        }

        @media (max-width: 768px) {
          .auth-card {
            padding: 32px 24px;
          }

          .auth-title {
            font-size: 28px;
          }

          .btn-back {
            display: none;
          }
        }
      `}</style>
    </>
  );
}

export default Auth;