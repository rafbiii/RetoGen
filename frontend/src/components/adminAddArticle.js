import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSun, FiMoon, FiArrowLeft, FiSave, FiImage, FiAlertCircle, FiCheckCircle, FiXCircle, FiX } from 'react-icons/fi';
import { verifyAdmin } from '../services/verificationService';
import { addArticle, validateArticleInput, validateImageFormat } from '../services/addArticleService';

function AdminAddArticle() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'success', 'error', 'token_invalid', 'not_admin'
  const [modalMessage, setModalMessage] = useState('');
  const [article, setArticle] = useState({
    article_title: '',
    article_tag: '',
    article_preview: '',
    article_content: '',
    article_image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

useEffect(() => {
  const checkAdminAccess = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        localStorage.removeItem('token');
        setIsLoading(false);
        setModalType('token_invalid');
        setModalMessage('Token invalid. Please login again.');
        setShowModal(true);
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      const verifyResult = await verifyAdmin(token);

      if (verifyResult.confirmation === 'token invalid') {
        localStorage.removeItem('token');
        setIsLoading(false);
        setModalType('token_invalid');
        setModalMessage('Token invalid. Please login again.');
        setShowModal(true);
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      if (verifyResult.confirmation === 'not admin') {
        setIsLoading(false);
        setModalType('not_admin');
        setModalMessage("You're not admin. Access denied.");
        setShowModal(true);
        setTimeout(() => navigate('/main'), 2000);
        return;
      }

      if (verifyResult.confirmation === 'backend error') {
        console.warn('Backend error during admin verification');
        setModalType('error');
        setModalMessage('Server busy. Please try again later.');
        setShowModal(true);
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error during admin verification:', error);
      setModalType('error');
      setModalMessage('Server busy. Please try again later.');
      setShowModal(true);
      setIsLoading(false);
    }
  };

  checkAdminAccess();
}, [navigate]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage('');
    setModalType('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArticle({
      ...article,
      [name]: value
    });
    
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: null
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      if (!validateImageFormat(file)) {
        setValidationErrors({
          ...validationErrors,
          image: 'Image must be in PNG or JPG format'
        });
        e.target.value = null;
        setImagePreview(null);
        return;
      }

      setArticle({
        ...article,
        article_image: file
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      if (validationErrors.image) {
        setValidationErrors({
          ...validationErrors,
          image: null
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateArticleInput(article);
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      
      const firstError = Object.values(validation.errors)[0];
      setModalType('error');
      setModalMessage(firstError);
      setShowModal(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await addArticle(article);
      
      if (!response.success) {
        if (response.error === 'backend_error') {
          setModalType('error');
          setModalMessage('Server busy. Please try again later.');
          setShowModal(true);
        } 
        else if (response.error === 'token_invalid') {
          localStorage.removeItem('token');
          setModalType('token_invalid');
          setModalMessage('Session expired. Please login again.');
          setShowModal(true);
          setTimeout(() => navigate('/login'), 2000);
        }
        else {
          setModalType('error');
          setModalMessage(response.message || 'Failed to add article. Please try again.');
          setShowModal(true);
        }
      } else {
        setModalType('success');
        setModalMessage('Article published successfully!');
        setShowModal(true);
        setTimeout(() => navigate('/main'), 2000);
      }
    } catch (error) {
      console.error('Error submitting article:', error);
      setModalType('error');
      setModalMessage('Server busy. Please try again later.');
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#E34234'
      }}>
        Verifying access
        ...
      </div>
    );
  }

  return (
    <>
      <div className="bg-shape-1"></div>
      <div className="bg-shape-2"></div>
      <div className="bg-shape-3"></div>
      
      <nav>
        <div className="nav-inner">
          <div className="logo" onClick={() => navigate('/main')} style={{ cursor: 'pointer' }}>
            <div className="anteater-icon">
              <img src="/figures/logo circle no bg.png" alt="Retogen Logo" />
            </div>
            <span>Retogen</span>
          </div>
          <div className="nav-buttons">
            <button className="theme-toggle" onClick={toggleTheme}>
              {isDarkMode ? <FiMoon /> : <FiSun />}
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        <button className="btn-back" onClick={() => navigate('/main')}>
          <FiArrowLeft />
          Back
        </button>

        <div className="write-header">
          <div className="header-accent"></div>
          <h1>Write New Article</h1>
          <p>Create a new product review</p>
        </div>

        <form onSubmit={handleSubmit} className="write-form">
          <div className="form-row">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="article_title"
                value={article.article_title}
                onChange={handleChange}
                placeholder="Acer Nitro 5 Review: The Ultimate Gaming Laptop for Every Gamer"
                className={validationErrors.title ? 'error' : ''}
              />
              {validationErrors.title && (
                <span className="error-message">
                  <FiAlertCircle /> {validationErrors.title}
                </span>
              )}
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                name="article_tag"
                value={article.article_tag}
                onChange={handleChange}
                className={validationErrors.tag ? 'error' : ''}
              >
                <option value="">Select category</option>
                <option value="office">Office</option>
                <option value="budget">Budget</option>
                <option value="gaming">Gaming</option>
                <option value="flagship">Flagship</option>
              </select>
              {validationErrors.tag && (
                <span className="error-message">
                  <FiAlertCircle /> {validationErrors.tag}
                </span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>
              <FiImage style={{ marginRight: '8px' }} />
              Article Image (PNG/JPG only)
            </label>
            <input
              type="file"
              accept="image/png, image/jpg, image/jpeg"
              onChange={handleImageChange}
              className={validationErrors.image ? 'error' : ''}
            />
            {validationErrors.image && (
              <span className="error-message">
                <FiAlertCircle /> {validationErrors.image}
              </span>
            )}
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Preview</label>
            <textarea
              name="article_preview"
              value={article.article_preview}
              onChange={handleChange}
              placeholder="Brief description (max 150 characters)"
              rows="2"
              maxLength="150"
              className={validationErrors.preview ? 'error' : ''}
            />
            {validationErrors.preview && (
              <span className="error-message">
                <FiAlertCircle /> {validationErrors.preview}
              </span>
            )}
          </div>

          <div className="form-group">
            <label>Content</label>
            <textarea
              name="article_content"
              value={article.article_content}
              onChange={handleChange}
              placeholder="Write your detailed review here..."
              rows="12"
              className={validationErrors.content ? 'error' : ''}
            />
            {validationErrors.content && (
              <span className="error-message">
                <FiAlertCircle /> {validationErrors.content}
              </span>
            )}
          </div>

          <button 
            type="submit" 
            className="btn-save"
            disabled={isSubmitting}
          >
            <FiSave />
            {isSubmitting ? 'Publishing...' : 'Publish Article'}
          </button>
        </form>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className={`modal ${modalType}`} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <FiX />
            </button>
            {modalType === 'success' && <FiCheckCircle size={64} color="#00BCD4" />}
            {(modalType === 'error' || modalType === 'token_invalid' || modalType === 'not_admin') && (
              <FiXCircle size={64} color="#E34234" />
            )}
            <h3>{modalType === 'success' ? 'Success!' : 'Error'}</h3>
            <p>{modalMessage}</p>
          </div>
        </div>
      )}

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #FFFFFF;
          color: #333333;
          overflow-x: hidden;
          transition: background 0.3s ease, color 0.3s ease;
        }

        body.dark-mode {
          background: #0D0D0D;
          color: #E8E8E8;
        }

        .bg-shape-1,
        .bg-shape-2,
        .bg-shape-3 {
          position: fixed;
          border-radius: 50%;
          filter: blur(150px);
          pointer-events: none;
          z-index: -1;
        }

        .bg-shape-1 {
          width: 600px;
          height: 600px;
          background: #E34234;
          opacity: 0.4;
          top: -200px;
          left: -200px;
          animation: float 20s ease-in-out infinite;
        }

        .bg-shape-2 {
          width: 700px;
          height: 700px;
          background: #00BCD4;
          opacity: 0.4;
          bottom: -250px;
          right: -250px;
          animation: float 18s ease-in-out infinite reverse;
        }

        .bg-shape-3 {
          width: 500px;
          height: 500px;
          background: #E34234;
          opacity: 0.3;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: float 22s ease-in-out infinite;
        }

        body.dark-mode .bg-shape-1,
        body.dark-mode .bg-shape-2,
        body.dark-mode .bg-shape-3 {
          opacity: 0.25;
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(30px, 30px);
          }
        }

        nav {
          position: sticky;
          top: 0;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(100, 100, 100, 0.1);
          padding: 16px 0;
          z-index: 1000;
          transition: all 0.3s ease;
        }

        body.dark-mode nav {
          background: rgba(13, 13, 13, 0.8);
          border-bottom-color: rgba(200, 200, 200, 0.1);
        }

        .nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
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
          width: 36px;
          height: 36px;
        }

        .anteater-icon img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .nav-buttons {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .theme-toggle {
          background: transparent;
          border: 2px solid rgba(100, 100, 100, 0.2);
          width: 40px;
          height: 40px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2a2a2a;
          transition: all 0.3s ease;
        }

        .theme-toggle:hover {
          background: rgba(100, 100, 100, 0.08);
          border-color: rgba(100, 100, 100, 0.3);
        }

        body.dark-mode .theme-toggle {
          color: #f5f5f5;
          border-color: rgba(200, 200, 200, 0.2);
        }

        body.dark-mode .theme-toggle:hover {
          background: rgba(200, 200, 200, 0.1);
          border-color: rgba(200, 200, 200, 0.3);
        }

        .theme-toggle svg {
          width: 20px;
          height: 20px;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 24px;
        }

        .btn-back {
          background: transparent;
          color: #6b7280;
          border: 2px solid rgba(100, 100, 100, 0.2);
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          font-weight: 600;
          margin: 20px 0;
          transition: all 0.3s ease;
        }

        .btn-back:hover {
          background: rgba(100, 100, 100, 0.08);
          border-color: rgba(100, 100, 100, 0.3);
        }

        body.dark-mode .btn-back {
          color: #b8b8b8;
          border-color: rgba(200, 200, 200, 0.2);
        }

        body.dark-mode .btn-back:hover {
          background: rgba(200, 200, 200, 0.1);
          border-color: rgba(200, 200, 200, 0.3);
        }

        .btn-back svg {
          width: 18px;
          height: 18px;
        }

        .write-header {
          position: relative;
          text-align: center;
          padding: 60px 20px 40px;
        }

        .header-accent {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 4px;
          background: linear-gradient(90deg, transparent, #E34234, transparent);
          border-radius: 2px;
        }

        .write-header h1 {
          color: #2a2a2a;
          font-size: 42px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        body.dark-mode .write-header h1 {
          color: #f5f5f5;
        }

        .write-header p {
          color: #6b7280;
          font-size: 16px;
        }

        body.dark-mode .write-header p {
          color: #b8b8b8;
        }

        .write-form {
          max-width: 800px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          padding: 40px;
          border: 1px solid rgba(100, 100, 100, 0.1);
        }

        body.dark-mode .write-form {
          background: rgba(42, 42, 42, 0.6);
          border-color: rgba(200, 200, 200, 0.1);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-group label {
          display: flex;
          align-items: center;
          color: #2a2a2a;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        body.dark-mode .form-group label {
          color: #f5f5f5;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid rgba(100, 100, 100, 0.15);
          border-radius: 8px;
          font-size: 15px;
          background: rgba(255, 255, 255, 0.5);
          color: #2a2a2a;
          font-family: 'Poppins', sans-serif;
          transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #E34234;
          background: rgba(255, 255, 255, 0.8);
        }

        body.dark-mode .form-group input,
        body.dark-mode .form-group select,
        body.dark-mode .form-group textarea {
          background: rgba(60, 60, 60, 0.5);
          border-color: rgba(200, 200, 200, 0.15);
          color: #f5f5f5;
        }

        body.dark-mode .form-group input:focus,
        body.dark-mode .form-group select:focus,
        body.dark-mode .form-group textarea:focus {
          background: rgba(60, 60, 60, 0.8);
          border-color: #E34234;
        }

        .form-group textarea {
          resize: vertical;
        }

        .form-group input.error,
        .form-group select.error,
        .form-group textarea.error {
          border-color: #E34234;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #E34234;
          font-size: 13px;
          margin-top: 6px;
          font-weight: 500;
        }

        .error-message svg {
          width: 14px;
          height: 14px;
        }

        .image-preview {
          margin-top: 12px;
          border-radius: 8px;
          overflow: hidden;
          max-width: 300px;
        }

        .image-preview img {
          width: 100%;
          height: auto;
          display: block;
        }

        .btn-save {
          width: 100%;
          background: #E34234;
          color: white;
          border: none;
          padding: 16px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s ease;
          margin-top: 8px;
        }

        .btn-save:hover:not(:disabled) {
          background: #c73629;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(227, 66, 52, 0.3);
        }

        .btn-save:disabled {
          background: rgba(100, 100, 100, 0.3);
          cursor: not-allowed;
          transform: none;
        }

        .btn-save svg {
          width: 20px;
          height: 20px;
        }

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
          z-index: 9999;
          backdrop-filter: blur(4px);
        }

        .modal {
          position: relative;
          background: rgba(255, 255, 255, 0.95);
          padding: 40px;
          border-radius: 12px;
          text-align: center;
          max-width: 400px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: modalSlideIn 0.3s ease-out;
        }

        body.dark-mode .modal {
          background: rgba(42, 42, 42, 0.95);
        }

        .modal-close {
          position: absolute;
          top: 12px;
          right: 12px;
          background: transparent;
          border: none;
          cursor: pointer;
          color: #6b7280;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .modal-close:hover {
          background: rgba(100, 100, 100, 0.1);
          color: #2a2a2a;
        }

        body.dark-mode .modal-close {
          color: #b8b8b8;
        }

        body.dark-mode .modal-close:hover {
          background: rgba(200, 200, 200, 0.1);
          color: #f5f5f5;
        }

        .modal-close svg {
          width: 20px;
          height: 20px;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal h3 {
          margin-top: 20px;
          font-size: 24px;
          color: #2a2a2a;
        }

        body.dark-mode .modal h3 {
          color: #f5f5f5;
        }

        .modal p {
          margin-top: 10px;
          color: #6b7280;
        }

        body.dark-mode .modal p {
          color: #b8b8b8;
        }

        @media (max-width: 768px) {
          .write-header h1 {
            font-size: 32px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .write-form {
            padding: 24px;
          }

          .modal {
            margin: 0 20px;
            padding: 30px;
          }
        }
      `}</style>
    </>
  );
}

export default AdminAddArticle;