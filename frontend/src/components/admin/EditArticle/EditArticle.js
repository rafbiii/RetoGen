import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSun, FiMoon, FiArrowLeft, FiSave, FiImage, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { getArticleForEdit, updateArticle } from '../../../services/EditArticleService';
import { verifyAdmin } from '../../../services/VerificationService';
import './EditArticle.css';

function EditArticle() {
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
          
          if (response.article_image) {
            let imageToDisplay = response.article_image;
            
            if (!response.article_image.startsWith('data:image')) {
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
      
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        console.log('Invalid file type');
        setValidationErrors({
          ...validationErrors,
          article_image: 'Image must be PNG or JPG format'
        });
        return;
      }

      setValidationErrors({
        ...validationErrors,
        article_image: ''
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        console.log('File converted to base64, length:', base64String.length);
        
        setArticle({
          ...article,
          article_image: base64String
        });
        setImagePreview(base64String);
        console.log('Image preview updated with new image');
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {};

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
    
    if (!validateForm()) {
      return;
    }

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
        setShowSuccessModal(true);
        
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
        
        <nav className="edit-article-nav">
          <div className="edit-article-nav-inner">
            <div className="edit-article-logo" onClick={() => navigate('/main')}>
              <div className="edit-article-logo-icon">
                <img src="/figures/logo.png" alt="Retogen Logo" />
              </div>
              <span>Retogen</span>
            </div>
            <div className="edit-article-nav-buttons">
              <button className="edit-article-theme-toggle" onClick={toggleTheme}>
                {isDarkMode ? <FiMoon /> : <FiSun />}
              </button>
            </div>
          </div>
        </nav>

        <div className="edit-article-container">
          <div className="edit-article-loading">
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
      
      <nav className="edit-article-nav">
        <div className="edit-article-nav-inner">
          <div className="edit-article-logo" onClick={() => navigate('/main')}>
            <div className="edit-article-logo-icon">
              <img src="/figures/logo.png" alt="Retogen Logo" />
            </div>
            <span>Retogen</span>
          </div>
          <div className="edit-article-nav-buttons">
            <button className="edit-article-theme-toggle" onClick={toggleTheme}>
              {isDarkMode ? <FiMoon /> : <FiSun />}
            </button>
          </div>
        </div>
      </nav>

      <div className="edit-article-container">
        <button className="edit-article-btn-back" onClick={() => navigate(`/article/${id}`)}>
          <FiArrowLeft />
          Back
        </button>

        <div className="edit-article-header">
          <div className="edit-article-header-accent"></div>
          <h1>Edit Article</h1>
        </div>

        <form onSubmit={handleSubmit} className="edit-article-form">
          <div className="edit-article-form-row">
            <div className="edit-article-form-group">
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
                <span className="edit-article-error-message">
                  <FiAlertCircle /> {validationErrors.article_title}
                </span>
              )}
            </div>

            <div className="edit-article-form-group">
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
                <span className="edit-article-error-message">
                  <FiAlertCircle /> {validationErrors.article_tag}
                </span>
              )}
            </div>
          </div>

          <div className="edit-article-form-group">
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
              <span className="edit-article-error-message">
                <FiAlertCircle /> {validationErrors.article_image}
              </span>
            )}
            {imagePreview && (
              <p className="edit-article-image-status">
                ✓ Image loaded (Click to change)
              </p>
            )}
          </div>

          {imagePreview && (
            <div className="edit-article-image-preview">
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
              <div className="edit-article-image-preview-label">
                Current Image Preview
              </div>
            </div>
          )}

          <div className="edit-article-form-group">
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
              <span className="edit-article-error-message">
                <FiAlertCircle /> {validationErrors.article_preview}
              </span>
            )}
          </div>

          <div className="edit-article-form-group">
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
              <span className="edit-article-error-message">
                <FiAlertCircle /> {validationErrors.article_content}
              </span>
            )}
          </div>

          <div className="edit-article-button-group">
            <button type="submit" className="edit-article-btn-save">
              <FiSave />
              Update Article
            </button>
          </div>
        </form>

        {showConfirmModal && (
          <div className="edit-article-modal-overlay" onClick={() => setShowConfirmModal(false)}>
            <div className="edit-article-modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Update Article?</h3>
              <p>Are you sure you want to update this article?</p>
              <div className="edit-article-modal-buttons">
                <button className="edit-article-btn-cancel" onClick={() => setShowConfirmModal(false)}>
                  Cancel
                </button>
                <button className="edit-article-btn-confirm" onClick={confirmUpdate}>
                  <FiSave />
                  Update Article
                </button>
              </div>
            </div>
          </div>
        )}

        {showSuccessModal && (
          <div className="edit-article-modal-overlay">
            <div className="edit-article-success-modal">
              <FiCheckCircle size={64} color="#00BCD4" />
              <h3>Article Updated!</h3>
              <p>Redirecting to article page...</p>
            </div>
          </div>
        )}

        {showErrorModal && (
          <div className="edit-article-modal-overlay" onClick={() => setShowErrorModal(false)}>
            <div className="edit-article-error-modal" onClick={(e) => e.stopPropagation()}>
              <FiAlertCircle size={64} color="#E34234" />
              <h3>Error</h3>
              <p>{errorMessage}</p>
              <button className="edit-article-btn-close" onClick={() => setShowErrorModal(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default EditArticle;