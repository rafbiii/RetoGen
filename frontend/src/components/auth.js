import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiSun, FiMoon, FiArrowLeft, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { authService } from '../services/authService';

function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    fullname: ''
  });
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    fullname: ''
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirmPassword: false,
    username: false,
    fullname: false
  });

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  // Validasi real-time untuk setiap field
  const validateField = (name, value) => {
    let errorMessage = '';

    switch (name) {
      case 'username':
        if (!isLogin) {
          if (value.length > 0 && value.length < 8) {
            errorMessage = 'Username must be at least 8 characters';
          } else if (value.length > 16) {
            errorMessage = 'Username must not exceed 16 characters';
          } else if (value.length > 0 && !/^[a-zA-Z0-9]+$/.test(value)) {
            errorMessage = 'Username must only contain letters and numbers';
          }
        }
        break;

      case 'fullname':
        if (!isLogin) {
          if (value.length > 0 && value.length < 4) {
            errorMessage = 'Full name must be at least 4 characters';
          } else if (value.length > 32) {
            errorMessage = 'Full name must not exceed 32 characters';
          } else if (value.length > 0 && !/^[a-zA-Z\s]+$/.test(value)) {
            errorMessage = 'Full name must only contain letters';
          }
        }
        break;

      case 'email':
        if (value.length > 0) {
          const emailRegex = /^[a-zA-Z0-9]+@[a-z]+\.[a-z]+$/;
          if (!emailRegex.test(value)) {
            errorMessage = 'Invalid email format (e.g., user@example.com)';
          }
        }
        break;

      case 'password':
        if (value.length > 0 && value.length < 8) {
          errorMessage = 'Password must be at least 8 characters';
        } else if (value.length > 16) {
          errorMessage = 'Password must not exceed 16 characters';
        } else if (value.length >= 8) {
          if (!/[a-z]/.test(value)) {
            errorMessage = 'Password must contain at least 1 lowercase letter';
          } else if (!/[A-Z]/.test(value)) {
            errorMessage = 'Password must contain at least 1 uppercase letter';
          } else if (!/[0-9]/.test(value)) {
            errorMessage = 'Password must contain at least 1 number';
          } else if (/[^a-zA-Z0-9]/.test(value)) {
            errorMessage = 'Password must not contain symbols';
          }
        }
        break;

      case 'confirmPassword':
        if (!isLogin && value.length > 0 && value !== formData.password) {
          errorMessage = 'Passwords do not match';
        }
        break;

      default:
        break;
    }

    return errorMessage;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });

    // Validasi real-time hanya jika field sudah pernah di-touch
    if (touched[name]) {
      const errorMessage = validateField(name, value);
      setFieldErrors({
        ...fieldErrors,
        [name]: errorMessage
      });
    }

    // Clear general error when user starts typing
    if (error) setError('');
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Tandai field sebagai touched
    setTouched({
      ...touched,
      [name]: true
    });

    // Validasi field saat blur
    const errorMessage = validateField(name, value);
    setFieldErrors({
      ...fieldErrors,
      [name]: errorMessage
    });
  };

  // Validasi ulang confirmPassword saat password berubah
  useEffect(() => {
    if (!isLogin && touched.confirmPassword && formData.confirmPassword) {
      const errorMessage = validateField('confirmPassword', formData.confirmPassword);
      setFieldErrors(prev => ({
        ...prev,
        confirmPassword: errorMessage
      }));
    }
  }, [formData.password, formData.confirmPassword, touched.confirmPassword, isLogin]);

  // Validasi form sebelum submit
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (isLogin) {
      // Login validation
      const emailError = validateField('email', formData.email);
      const passwordError = validateField('password', formData.password);

      if (!formData.email) {
        errors.email = 'Email is required';
        isValid = false;
      } else if (emailError) {
        errors.email = emailError;
        isValid = false;
      }

      if (!formData.password) {
        errors.password = 'Password is required';
        isValid = false;
      } else if (passwordError) {
        errors.password = passwordError;
        isValid = false;
      }
    } else {
      // Registration validation
      const usernameError = validateField('username', formData.username);
      const fullnameError = validateField('fullname', formData.fullname);
      const emailError = validateField('email', formData.email);
      const passwordError = validateField('password', formData.password);
      const confirmPasswordError = validateField('confirmPassword', formData.confirmPassword);

      if (!formData.username) {
        errors.username = 'Username is required';
        isValid = false;
      } else if (usernameError) {
        errors.username = usernameError;
        isValid = false;
      }

      if (!formData.fullname) {
        errors.fullname = 'Full name is required';
        isValid = false;
      } else if (fullnameError) {
        errors.fullname = fullnameError;
        isValid = false;
      }

      if (!formData.email) {
        errors.email = 'Email is required';
        isValid = false;
      } else if (emailError) {
        errors.email = emailError;
        isValid = false;
      }

      if (!formData.password) {
        errors.password = 'Password is required';
        isValid = false;
      } else if (passwordError) {
        errors.password = passwordError;
        isValid = false;
      }

      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
        isValid = false;
      } else if (confirmPasswordError) {
        errors.confirmPassword = confirmPasswordError;
        isValid = false;
      }
    }

    setFieldErrors(errors);
    setTouched({
      email: true,
      password: true,
      confirmPassword: true,
      username: true,
      fullname: true
    });

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validasi frontend
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // Login
        const response = await authService.login({
          email: formData.email,
          password: formData.password
        });
        
        navigate('/main');
      } else {
        // Register - sesuai dengan API format
        const response = await authService.register({
          username: formData.username,
          fullname: formData.fullname,
          email: formData.email,
          password: formData.password
        });

        // Show success modal
        setShowSuccessModal(true);
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          setShowSuccessModal(false);
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
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

            {error && (
              <div className="error-banner">
                <FiAlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              {!isLogin && (
                <>
                  <div className="form-group">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`form-input ${fieldErrors.username && touched.username ? 'input-error' : ''}`}
                      placeholder="Choose a username"
                      disabled={loading}
                    />
                    {fieldErrors.username && touched.username && (
                      <div className="field-error">
                        <FiAlertCircle size={14} />
                        <span>{fieldErrors.username}</span>
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`form-input ${fieldErrors.fullname && touched.fullname ? 'input-error' : ''}`}
                      placeholder="Your full name"
                      disabled={loading}
                    />
                    {fieldErrors.fullname && touched.fullname && (
                      <div className="field-error">
                        <FiAlertCircle size={14} />
                        <span>{fieldErrors.fullname}</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${fieldErrors.email && touched.email ? 'input-error' : ''}`}
                  placeholder="your@email.com"
                  disabled={loading}
                />
                {fieldErrors.email && touched.email && (
                  <div className="field-error">
                    <FiAlertCircle size={14} />
                    <span>{fieldErrors.email}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${fieldErrors.password && touched.password ? 'input-error' : ''}`}
                  placeholder="Enter your password"
                  disabled={loading}
                />
                {fieldErrors.password && touched.password && (
                  <div className="field-error">
                    <FiAlertCircle size={14} />
                    <span>{fieldErrors.password}</span>
                  </div>
                )}
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`form-input ${fieldErrors.confirmPassword && touched.confirmPassword ? 'input-error' : ''}`}
                    placeholder="Confirm your password"
                    disabled={loading}
                  />
                  {fieldErrors.confirmPassword && touched.confirmPassword && (
                    <div className="field-error">
                      <FiAlertCircle size={14} />
                      <span>{fieldErrors.confirmPassword}</span>
                    </div>
                  )}
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-register auth-submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading-spinner">
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </span>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
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
                    onClick={() => !loading && navigate('/register')}
                  >
                    Sign up
                  </span>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <span 
                    className="auth-link" 
                    onClick={() => !loading && navigate('/login')}
                  >
                    Sign in
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="success-modal">
            <FiCheckCircle size={64} color="#00ced1" />
            <h3>Account Created!</h3>
            <p>Redirecting to login page...</p>
          </div>
        </div>
      )}

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #F5F5F5;
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        body.dark-mode {
          background: #0D0D0D;
          color: #E8E8E8;
        }

        .bg-shape-1, .bg-shape-2, .bg-shape-3 {
          position: fixed;
          border-radius: 50%;
          filter: blur(150px);
          pointer-events: none;
          z-index: 0;
          animation: float 20s ease-in-out infinite;
        }

        .bg-shape-1 {
          width: 600px;
          height: 600px;
          background: rgba(227, 66, 52, 0.4);
          top: -200px;
          left: -200px;
        }

        body.dark-mode .bg-shape-1 {
          background: rgba(227, 66, 52, 0.25);
        }

        .bg-shape-2 {
          width: 700px;
          height: 700px;
          background: rgba(0, 188, 212, 0.4);
          bottom: -250px;
          right: -250px;
          animation-delay: -5s;
        }

        body.dark-mode .bg-shape-2 {
          background: rgba(0, 188, 212, 0.25);
        }

        .bg-shape-3 {
          width: 500px;
          height: 500px;
          background: rgba(227, 66, 52, 0.3);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: -10s;
        }

        body.dark-mode .bg-shape-3 {
          background: rgba(0, 188, 212, 0.2);
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(50px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-30px, 30px) scale(0.9);
          }
        }

        nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(100, 100, 100, 0.1);
          z-index: 1000;
          height: 64px;
          transition: all 0.3s ease;
        }

        body.dark-mode nav {
          background: rgba(42, 42, 42, 0.8);
          border-bottom: 1px solid rgba(200, 200, 200, 0.1);
        }

        .nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 20px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #2a2a2a;
        }

        body.dark-mode .logo {
          color: #f5f5f5;
        }

        .anteater-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }

        .anteater-icon img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .nav-buttons {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .theme-toggle {
          background: transparent;
          border: 2px solid rgba(100, 100, 100, 0.2);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #2a2a2a;
        }

        body.dark-mode .theme-toggle {
          border-color: rgba(200, 200, 200, 0.2);
          color: #f5f5f5;
        }

        .theme-toggle:hover {
          background: rgba(0, 206, 209, 0.1);
          border-color: #00ced1;
          transform: scale(1.05);
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Poppins', sans-serif;
        }

        .btn-register {
          background: #00ced1;
          color: white;
        }

        .btn-register:hover {
          background: #00b8bb;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 206, 209, 0.3);
        }

        .container {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 80px;
          padding-bottom: 40px;
        }

        .auth-container {
          width: 100%;
          max-width: 480px;
        }

        .auth-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(100, 100, 100, 0.1);
          border-radius: 16px;
          padding: 48px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
        }

        body.dark-mode .auth-card {
          background: rgba(42, 42, 42, 0.7);
          border-color: rgba(200, 200, 200, 0.1);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
        }

        .auth-title {
          font-size: 32px;
          font-weight: 700;
          color: #2a2a2a;
          margin-bottom: 8px;
          text-align: center;
        }

        body.dark-mode .auth-title {
          color: #f5f5f5;
        }

        .auth-subtitle {
          font-size: 15px;
          color: #6b7280;
          margin-bottom: 32px;
          text-align: center;
        }

        body.dark-mode .auth-subtitle {
          color: #b8b8b8;
        }

        .error-banner {
          background: rgba(227, 66, 52, 0.1);
          border: 1px solid rgba(227, 66, 52, 0.3);
          color: #E34234;
          padding: 12px 16px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          font-size: 14px;
        }

        body.dark-mode .error-banner {
          background: rgba(227, 66, 52, 0.15);
          border-color: rgba(227, 66, 52, 0.4);
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
          font-size: 14px;
          font-weight: 600;
          color: #2a2a2a;
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

        .form-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .form-input:focus {
          outline: none;
          border-color: #00ced1;
          background: rgba(255, 255, 255, 0.8);
        }

        .form-input.input-error {
          border-color: #E34234;
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

        body.dark-mode .form-input.input-error {
          border-color: #E34234;
        }

        .form-input::placeholder {
          color: #9ca3af;
        }

        body.dark-mode .form-input::placeholder {
          color: #888;
        }

        .field-error {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #E34234;
          font-size: 13px;
          margin-top: -4px;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .auth-submit {
          width: 100%;
          margin-top: 8px;
          padding: 14px;
          font-size: 16px;
          position: relative;
        }

        .auth-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .loading-spinner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
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

        /* Success Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          backdrop-filter: blur(4px);
        }

        .success-modal {
          background: rgba(255, 255, 255, 0.95);
          padding: 40px;
          border-radius: 12px;
          text-align: center;
          max-width: 400px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        body.dark-mode .success-modal {
          background: rgba(42, 42, 42, 0.95);
        }

        .success-modal h3 {
          margin-top: 20px;
          font-size: 24px;
          color: #2a2a2a;
        }

        body.dark-mode .success-modal h3 {
          color: #f5f5f5;
        }

        .success-modal p {
          margin-top: 10px;
          color: #6b7280;
        }

        body.dark-mode .success-modal p {
          color: #b8b8b8;
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