import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSun, FiMoon, FiArrowLeft, FiSave, FiImage, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { getArticleForEdit, updateArticle } from '../services/editArticleService';
import { verifyAdmin } from '../services/verificationService';

function AdminEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState({});
  
  const [article, setArticle] = useState({
    article_id: id,
    article_title: '',
    article_tag: '',
    article_preview: '',
    article_content: '',
    article_image: null
  });
  
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const loadArticleData = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login', { state: { message: 'token invalid' } });
        return;
      }

      try {
        const responseData = await verifyAdmin(token);
        if (responseData.confirmation === 'token invalid') {
          navigate('/login', { state: { message: 'token invalid' } });
        } else if (responseData.confirmation === 'not admin') {
          setErrorMessage("You're not admin");
          setShowErrorModal(true);
          setTimeout(() => {
            navigate('/main');
          }, 2000);
        }

        const response = await getArticleForEdit(id, token);
        
        if (response.confirmation === 'token invalid') {
          navigate('/login', { state: { message: 'token invalid' } });
        } else if (response.confirmation === 'not admin') {
          setErrorMessage("You're not admin");
          setShowErrorModal(true);
          setTimeout(() => {
            navigate('/main');
          }, 2000);
        } else if (response.confirmation === 'backend error') {
          setErrorMessage('Server busy');
          setShowErrorModal(true);
        } else if (response.confirmation === 'successful') {
          console.log('Article data received:', response);
          console.log('Article image:', response.article_image ? 'Image exists' : 'No image');
          
          setArticle({
            article_id: response.article_id,
            article_title: response.article_title,
            article_tag: response.article_tag,
            article_preview: response.article_preview,
            article_content: response.article_content,
            article_image: response.article_image
          });
          
          // Set image preview from database (existing image)
          if (response.article_image) {
            let imageToDisplay = response.article_image;
            
            // Check if image already has data:image prefix
            if (!response.article_image.startsWith('data:image')) {
              // If it's raw base64 without prefix, add it
              // Default to jpeg, but you can also try png
              imageToDisplay = 'data:image/jpeg;base64,' + response.article_image;
              console.log('Added data URI prefix to image');
            }
            
            console.log('Setting image preview, length:', imageToDisplay.length);
            setImagePreview(imageToDisplay);
          } else {
            console.log('No image in response');
          }
          
          setIsLoading(false);
        }
      } catch (error) {
        setErrorMessage('Server busy');
        setShowErrorModal(true);
        setIsLoading(false);
      }
    };

    loadArticleData();
  }, [id, navigate]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  const handleChange = (e) => {
    setArticle({
      ...article,
      [e.target.name]: e.target.value
    });
    // Clear validation error for this field
    if (validationErrors[e.target.name]) {
      setValidationErrors({
        ...validationErrors,
        [e.target.name]: ''
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      console.log('New file selected:', file.name, 'Type:', file.type);
      
      // Validation: Check if file is PNG or JPG
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        console.log('Invalid file type');
        setValidationErrors({
          ...validationErrors,
          article_image: 'Image must be PNG or JPG format'
        });
        return;
      }

      // Clear validation error
      setValidationErrors({
        ...validationErrors,
        article_image: ''
      });

      // Convert to base64 and REPLACE the existing image from database
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        console.log('File converted to base64, length:', base64String.length);
        
        // Update article with new image (replaces old image)
        setArticle({
          ...article,
          article_image: base64String
        });
        // Replace preview with new uploaded image
        setImagePreview(base64String);
        console.log('Image preview updated with new image');
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {};

    // Check for empty fields
    if (!article.article_title.trim()) {
      errors.article_title = 'Please fill';
    }
    if (!article.article_tag.trim()) {
      errors.article_tag = 'Please fill';
    }
    if (!article.article_preview.trim()) {
      errors.article_preview = 'Please fill';
    }
    if (!article.article_content.trim()) {
      errors.article_content = 'Please fill';
    }
    if (!article.article_image) {
      errors.article_image = 'Please fill';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    // Show confirmation modal
    setShowConfirmModal(true);
  };

  const confirmUpdate = async () => {
    setShowConfirmModal(false);
    const token = localStorage.getItem('token');

    try {
      const response = await updateArticle(article, token);
      
      if (response.confirmation === 'backend error') {
        setErrorMessage('Server busy');
        setShowErrorModal(true);
      } else if (response.confirmation === 'successful: article edited') {
        // Show success modal
        setShowSuccessModal(true);
        
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate(`/article/${response.article_id}`);
        }, 2000);
      }
    } catch (error) {
      setErrorMessage('Server busy');
      setShowErrorModal(true);
    }
  };

  if (isLoading) {
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
          <div className="loading-container">
            <p>Loading article...</p>
          </div>
        </div>
      </>
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
        <button className="btn-back" onClick={() => navigate(`/article/${id}`)}>
          <FiArrowLeft />
          Back
        </button>

        <div className="edit-header">
          <div className="header-accent"></div>
          <h1>Edit Article</h1>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-row">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="article_title"
                value={article.article_title}
                onChange={handleChange}
                placeholder="Article title"
                className={validationErrors.article_title ? 'error' : ''}
              />
              {validationErrors.article_title && (
                <span className="error-message">
                  <FiAlertCircle /> {validationErrors.article_title}
                </span>
              )}
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                name="article_tag"
                value={article.article_tag}
                onChange={handleChange}
                className={validationErrors.article_tag ? 'error' : ''}
              >
                <option value="">Select category</option>
                <option value="office">Office</option>
                <option value="budget">Budget</option>
                <option value="gaming">Gaming</option>
                <option value="flagship">Flagship</option>
              </select>
              {validationErrors.article_tag && (
                <span className="error-message">
                  <FiAlertCircle /> {validationErrors.article_tag}
                </span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>
              <FiImage style={{ marginRight: '8px' }} />
              Image (PNG/JPG only)
            </label>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleImageChange}
              className={validationErrors.article_image ? 'error' : ''}
            />
            {validationErrors.article_image && (
              <span className="error-message">
                <FiAlertCircle /> {validationErrors.article_image}
              </span>
            )}
            {imagePreview && (
              <p style={{ fontSize: '12px', color: '#00BCD4', marginTop: '8px' }}>
                ✓ Image loaded (Click to change)
              </p>
            )}
          </div>

          {imagePreview && (
            <div className="image-preview">
              <img 
                src={imagePreview} 
                alt="Preview"
                onError={(e) => {
                  console.error('Image failed to load');
                  console.log('Image src length:', imagePreview.length);
                  console.log('Image src preview:', imagePreview.substring(0, 100) + '...');
                  e.target.style.display = 'none';
                }}
                onLoad={() => {
                  console.log('Image loaded successfully');
                }}
              />
              <div className="image-preview-label">
                Current Image Preview
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Preview</label>
            <textarea
              name="article_preview"
              value={article.article_preview}
              onChange={handleChange}
              placeholder="Brief description (max 150 characters)"
              rows="2"
              maxLength="150"
              className={validationErrors.article_preview ? 'error' : ''}
            />
            {validationErrors.article_preview && (
              <span className="error-message">
                <FiAlertCircle /> {validationErrors.article_preview}
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
              className={validationErrors.article_content ? 'error' : ''}
            />
            {validationErrors.article_content && (
              <span className="error-message">
                <FiAlertCircle /> {validationErrors.article_content}
              </span>
            )}
          </div>

          <div className="button-group">
            <button type="submit" className="btn-save">
              <FiSave />
              Update Article
            </button>
          </div>
        </form>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Update Article?</h3>
              <p>Are you sure you want to update this article?</p>
              <div className="modal-buttons">
                <button className="btn-cancel" onClick={() => setShowConfirmModal(false)}>
                  Cancel
                </button>
                <button className="btn-confirm" onClick={confirmUpdate}>
                  <FiSave />
                  Update Article
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="modal-overlay">
            <div className="success-modal">
              <FiCheckCircle size={64} color="#00BCD4" />
              <h3>Article Updated!</h3>
              <p>Redirecting to article page...</p>
            </div>
          </div>
        )}

        {/* Error Modal */}
        {showErrorModal && (
          <div className="modal-overlay" onClick={() => setShowErrorModal(false)}>
            <div className="error-modal" onClick={(e) => e.stopPropagation()}>
              <FiAlertCircle size={64} color="#E34234" />
              <h3>Error</h3>
              <p>{errorMessage}</p>
              <button className="btn-close" onClick={() => setShowErrorModal(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .edit-header {
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
          
        .edit-header h1 {
          color: #2a2a2a;
          font-size: 42px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        body.dark-mode .edit-header h1 {
          color: #f5f5f5;
        }

        .loading-container {
          text-align: center;
          padding: 100px 20px;
          color: #6b7280;
        }

        body.dark-mode .loading-container {
          color: #b8b8b8;
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

        .edit-form {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 20px 80px;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          padding: 40px;
          border: 1px solid rgba(100, 100, 100, 0.1);
        }

        body.dark-mode .edit-form {
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

        .form-group input.error,
        .form-group select.error,
        .form-group textarea.error {
          border-color: #E34234;
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

        body.dark-mode .form-group input.error,
        body.dark-mode .form-group select.error,
        body.dark-mode .form-group textarea.error {
          border-color: #E34234;
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

        .error-message {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #E34234;
          font-size: 12px;
          margin-top: 4px;
          font-weight: 500;
        }

        .error-message svg {
          width: 14px;
          height: 14px;
        }

        .image-preview {
          width: 100%;
          height: 300px;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 24px;
          border: 2px solid rgba(100, 100, 100, 0.1);
          position: relative;
        }

        .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-preview-label {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          color: white;
          padding: 8px 16px;
          font-size: 12px;
          font-weight: 600;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        body.dark-mode .image-preview-label {
          background: rgba(0, 0, 0, 0.8);
        }

        .button-group {
          display: flex;
          justify-content: center;
          margin-top: 8px;
        }

        .btn-save {
          background: #E34234;
          color: white;
          border: none;
          padding: 16px 32px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s ease;
        }

        .btn-save:hover {
          background: #c73629;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(227, 66, 52, 0.3);
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
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          padding: 32px;
          max-width: 400px;
          width: 90%;
          border: 1px solid rgba(100, 100, 100, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        body.dark-mode .modal-content {
          background: rgba(42, 42, 42, 0.95);
          border-color: rgba(200, 200, 200, 0.1);
        }

        .modal-content h3 {
          color: #2a2a2a;
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        body.dark-mode .modal-content h3 {
          color: #f5f5f5;
        }

        .modal-content p {
          color: #6b7280;
          font-size: 15px;
          line-height: 1.6;
          margin-bottom: 24px;
        }

        body.dark-mode .modal-content p {
          color: #b8b8b8;
        }

        .modal-buttons {
          display: flex;
          gap: 12px;
        }

        .btn-cancel {
          flex: 1;
          background: transparent;
          color: #6b7280;
          border: 2px solid rgba(100, 100, 100, 0.2);
          padding: 12px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-cancel:hover {
          background: rgba(100, 100, 100, 0.08);
          border-color: rgba(100, 100, 100, 0.3);
        }

        body.dark-mode .btn-cancel {
          color: #b8b8b8;
          border-color: rgba(200, 200, 200, 0.2);
        }

        body.dark-mode .btn-cancel:hover {
          background: rgba(200, 200, 200, 0.1);
          border-color: rgba(200, 200, 200, 0.3);
        }

        .btn-confirm {
          flex: 1;
          background: #E34234;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .btn-confirm:hover {
          background: #c73629;
          transform: translateY(-2px);
        }

        .btn-confirm svg {
          width: 16px;
          height: 16px;
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

        .error-modal {
          background: rgba(255, 255, 255, 0.95);
          padding: 40px;
          border-radius: 12px;
          text-align: center;
          max-width: 400px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        body.dark-mode .error-modal {
          background: rgba(42, 42, 42, 0.95);
        }

        .error-modal h3 {
          margin-top: 20px;
          font-size: 24px;
          color: #2a2a2a;
        }

        body.dark-mode .error-modal h3 {
          color: #f5f5f5;
        }

        .error-modal p {
          margin-top: 10px;
          color: #6b7280;
          margin-bottom: 20px;
        }

        body.dark-mode .error-modal p {
          color: #b8b8b8;
        }

        .btn-close {
          background: #E34234;
          color: white;
          border: none;
          padding: 12px 32px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-close:hover {
          background: #c73629;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .edit-header h1 {
            font-size: 32px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .edit-form {
            padding: 24px;
          }

          .button-group {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}

export default AdminEdit;