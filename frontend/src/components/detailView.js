import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSun, FiMoon, FiUser, FiArrowLeft, FiStar, FiSend, FiEdit, FiFlag, FiTrash2, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import DetailArticleService from '../services/DetailArticleService';
import DeleteArticleService from '../services/DeleteArticleService';

function DetailView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState('');
  const [reportTarget, setReportTarget] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Article data from API
  const [article, setArticle] = useState(null);
  const [userclass, setUserclass] = useState('user');
  const [username, setUsername] = useState('');
  
  const [comments, setComments] = useState([
    { id: 1, user: 'Alice', rating: 5, text: 'Excellent laptop! Very satisfied with the performance.' },
    { id: 2, user: 'Bob', rating: 4, text: 'Great build quality, minor heating issues.' }
  ]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    
    if (!token) {
      navigate('/login');
      return;
    }

    if (storedUsername) {
      setUsername(storedUsername);
    }

    fetchArticleData(token);
  }, [id]);

  const fetchArticleData = async (token) => {
    setIsLoading(true);
    try {
      const response = await DetailArticleService.viewArticle(token, id);

      if (response.confirmation === 'token invalid') {
        displayPopup('token invalid');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return;
      }

      if (response.confirmation === 'backend error') {
        displayPopup('server busy');
        setIsLoading(false);
        return;
      }

      if (response.confirmation === 'article fetch successful') {
        setArticle({
          title: response.article_title,
          content: response.article_content,
          tag: response.article_tag,
          image: response.article_image
        });
        setUserclass(response.userclass);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      displayPopup('server busy');
      setIsLoading(false);
    }
  };

  const displayPopup = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating > 0 && comment.trim()) {
      setComments([...comments, { 
        id: comments.length + 1, 
        user: username || 'User', 
        rating, 
        text: comment 
      }]);
      setRating(0);
      setComment('');
    }
  };

  const openReportModal = (type, target = null) => {
    setReportType(type);
    setReportTarget(target);
    setShowReportModal(true);
  };

  const handleReport = () => {
    console.log(`Reporting ${reportType}:`, reportReason, reportTarget);
    displayPopup('Report submitted!');
    setShowReportModal(false);
    setReportReason('');
  };

  const handleEditArticle = () => {
    navigate(`/admin/edit/${id}`);
  };

  const handleDeleteArticle = () => {
    setShowDeleteConfirmModal(true);
  };

  const confirmDelete = async () => {
    setShowDeleteConfirmModal(false);
    setIsDeleting(true);

    const token = localStorage.getItem('token');
    
    try {
      const response = await DeleteArticleService.deleteArticle(token, id);

      if (response.confirmation === 'token invalid') {
        displayPopup('token invalid');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return;
      }

      if (response.confirmation === 'not admin') {
        displayPopup("you're not admin");
        setIsDeleting(false);
        return;
      }

      if (response.confirmation === 'backend error') {
        displayPopup('server busy');
        setIsDeleting(false);
        return;
      }

      if (response.confirmation === 'successful: article deleted') {
        setSuccessMessage('Article has been deleted');
        setShowSuccessModal(true);
        setTimeout(() => {
          navigate('/main');
        }, 2000);
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      displayPopup('server busy');
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmModal(false);
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
              <button className="btn-account" onClick={() => navigate('/account')}>
                <FiUser />
                <span>{username || 'User'}</span>
              </button>
            </div>
          </div>
        </nav>

        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading article...</p>
          </div>
        </div>
      </>
    );
  }

  if (!article) {
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
          </div>
        </nav>

        <div className="container">
          <div className="error-container">
            <h2>Article not found</h2>
            <button className="btn-back" onClick={() => navigate('/main')}>
              <FiArrowLeft />
              Back to Main
            </button>
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
            <button className="btn-account" onClick={() => navigate('/account')}>
              <FiUser />
              <span>{username || 'User'}</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        <button className="btn-back" onClick={() => navigate('/main')}>
          <FiArrowLeft />
          Back
        </button>

        <div className="article-detail">
          {article.image && (
            <div className="laptop-image">
              <img 
                src={`data:image/jpeg;base64,${article.image}`} 
                alt={article.title}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
          
          <div className="article-header">
            <div className="header-accent"></div>
            <h1>{article.title}</h1>
            <div className="tag-container">
              <span className="article-tag">{article.tag}</span>
            </div>
            <div className="header-actions">
              {userclass === 'admin' && (
                <>
                  <button className="btn-edit" onClick={handleEditArticle}>
                    <FiEdit />
                    Edit Article
                  </button>
                  <button className="btn-delete" onClick={handleDeleteArticle}>
                    <FiTrash2 />
                    Delete Article
                  </button>
                </>
              )}
              <button className="btn-report" onClick={() => openReportModal('article')}>
                <FiFlag />
                Report Article
              </button>
            </div>
          </div>

          <div className="article-body">
            <p>{article.content}</p>
          </div>

          <div className="rating-section">
            <h2>Rate & Review</h2>
            <form onSubmit={handleSubmit}>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    className={`star ${rating >= star ? 'active' : ''}`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
              <div className="comment-input">
                <textarea
                  placeholder="Share your experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows="3"
                />
                <button type="submit" className="btn-submit">
                  <FiSend />
                  Post Review
                </button>
              </div>
            </form>
          </div>

          <div className="comments-section">
            <h2>User Reviews ({comments.length})</h2>
            <div className="comments-list">
              {comments.map((c) => (
                <div key={c.id} className="comment-card">
                  <div className="comment-header">
                    <div className="user-info">
                      <FiUser className="user-icon" />
                      <span>{c.user}</span>
                    </div>
                    <div className="comment-actions">
                      <div className="comment-rating">
                        {[...Array(c.rating)].map((_, i) => (
                          <FiStar key={i} className="star-filled" />
                        ))}
                      </div>
                      <button 
                        className="btn-report-comment" 
                        onClick={() => openReportModal('comment', c.id)}
                        title="Report comment"
                      >
                        <FiFlag />
                      </button>
                    </div>
                  </div>
                  <p className="comment-text">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showReportModal && (
          <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Report {reportType === 'article' ? 'Article' : 'Comment'}</h3>
              <p>Please provide a reason for reporting this {reportType}:</p>
              <textarea
                className="report-textarea"
                placeholder="Describe the issue..."
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                rows="4"
              />
              <div className="modal-buttons">
                <button className="btn-cancel" onClick={() => setShowReportModal(false)}>
                  Cancel
                </button>
                <button className="btn-confirm-report" onClick={handleReport}>
                  <FiFlag />
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        )}

        {showPopup && (
          <div className="popup-notification">
            {popupMessage}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirmModal && (
          <div className="modal-overlay" onClick={cancelDelete}>
            <div className="modal-content delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
              <FiAlertCircle size={64} color="#E34234" />
              <h3>Delete Article?</h3>
              <p>Are you sure you want to delete this article? This action cannot be undone.</p>
              <div className="modal-buttons">
                <button className="btn-cancel" onClick={cancelDelete}>
                  Cancel
                </button>
                <button className="btn-confirm-delete" onClick={confirmDelete} disabled={isDeleting}>
                  <FiTrash2 />
                  {isDeleting ? 'Deleting...' : 'Delete'}
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
              <h3>{successMessage}</h3>
              <p>Redirecting to main page...</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .loading-container,
        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          gap: 20px;
        }

        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(227, 66, 52, 0.1);
          border-top-color: #E34234;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-container p,
        .error-container h2 {
          color: #6b7280;
          font-size: 18px;
        }

        body.dark-mode .loading-container p,
        body.dark-mode .error-container h2 {
          color: #b8b8b8;
        }

        .tag-container {
          margin: 12px 0;
        }

        .article-tag {
          display: inline-block;
          background: rgba(0, 188, 212, 0.1);
          color: #00BCD4;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          border: 1px solid rgba(0, 188, 212, 0.2);
        }

        body.dark-mode .article-tag {
          background: rgba(0, 188, 212, 0.15);
          border-color: rgba(0, 188, 212, 0.3);
        }

        .btn-delete {
          background: transparent;
          color: #E34234;
          border: 2px solid rgba(227, 66, 52, 0.3);
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-delete:hover {
          background: rgba(227, 66, 52, 0.1);
          border-color: #E34234;
        }

        body.dark-mode .btn-delete {
          border-color: rgba(227, 66, 52, 0.4);
        }

        body.dark-mode .btn-delete:hover {
          background: rgba(227, 66, 52, 0.15);
        }

        .popup-notification {
          position: fixed;
          top: 90px;
          right: 24px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(100, 100, 100, 0.1);
          border-radius: 12px;
          padding: 16px 24px;
          font-size: 15px;
          font-weight: 600;
          color: #2a2a2a;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          z-index: 1001;
          animation: slideIn 0.3s ease;
        }

        body.dark-mode .popup-notification {
          background: rgba(42, 42, 42, 0.95);
          border-color: rgba(200, 200, 200, 0.1);
          color: #f5f5f5;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
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

        .btn-account {
          background: transparent;
          border: 2px solid rgba(100, 100, 100, 0.2);
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          font-weight: 600;
          color: #2a2a2a;
          transition: all 0.3s ease;
        }

        .btn-account:hover {
          background: rgba(100, 100, 100, 0.08);
          border-color: rgba(100, 100, 100, 0.3);
        }

        body.dark-mode .btn-account {
          color: #f5f5f5;
          border-color: rgba(200, 200, 200, 0.2);
        }

        body.dark-mode .btn-account:hover {
          background: rgba(200, 200, 200, 0.1);
          border-color: rgba(200, 200, 200, 0.3);
        }

        .btn-account svg {
          width: 18px;
          height: 18px;
        }

        .article-detail {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px 0 80px;
        }

        .laptop-image {
          width: 100%;
          height: 400px;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 40px;
          background: rgba(100, 100, 100, 0.05);
        }

        .laptop-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        body.dark-mode .laptop-image {
          background: rgba(200, 200, 200, 0.05);
        }

        .article-header {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(100, 100, 100, 0.08);
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 24px;
          position: relative;
          overflow: hidden;
        }

        body.dark-mode .article-header {
          background: rgba(42, 42, 42, 0.6);
          border-color: rgba(200, 200, 200, 0.08);
        }

        .header-accent {
          position: absolute;
          top: 0;
          left: 0;
          width: 6px;
          height: 100%;
          background: linear-gradient(180deg, #E34234, #00BCD4);
        }

        .article-header h1 {
          color: #2a2a2a;
          font-size: 42px;
          font-weight: 700;
          margin-bottom: 8px;
          line-height: 1.2;
        }

        body.dark-mode .article-header h1 {
          color: #f5f5f5;
        }

        .subtitle {
          color: #6b7280;
          font-size: 16px;
          margin-bottom: 20px;
        }

        body.dark-mode .subtitle {
          color: #b8b8b8;
        }

        .header-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 20px;
        }

        .btn-edit,
        .btn-report {
          background: transparent;
          color: #00BCD4;
          border: 2px solid rgba(0, 188, 212, 0.3);
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-edit:hover,
        .btn-report:hover {
          background: rgba(0, 188, 212, 0.1);
          border-color: #00BCD4;
        }

        body.dark-mode .btn-edit,
        body.dark-mode .btn-report {
          border-color: rgba(0, 188, 212, 0.4);
        }

        body.dark-mode .btn-edit:hover,
        body.dark-mode .btn-report:hover {
          background: rgba(0, 188, 212, 0.15);
        }

        .btn-report {
          color: #E34234;
          border-color: rgba(227, 66, 52, 0.3);
        }

        .btn-report:hover {
          background: rgba(227, 66, 52, 0.1);
          border-color: #E34234;
        }

        body.dark-mode .btn-report {
          border-color: rgba(227, 66, 52, 0.4);
        }

        body.dark-mode .btn-report:hover {
          background: rgba(227, 66, 52, 0.15);
        }

        .article-body {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(100, 100, 100, 0.08);
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 24px;
          max-height: 600px; /* Batas tinggi maksimal */
          overflow-y: auto; /* Tambah scrollbar jika melebihi */
        }

        .article-body p {
          color: #2a2a2a;
          font-size: 16px;
          line-height: 1.8;
          white-space: pre-wrap;
          word-wrap: break-word;
          word-break: break-word;
          overflow-wrap: break-word;
        }

        body.dark-mode .article-body {
          background: rgba(42, 42, 42, 0.6);
          border-color: rgba(200, 200, 200, 0.08);
        }

        body.dark-mode .article-body p {
          color: #e8e8e8;
        }

        .rating-section {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(100, 100, 100, 0.08);
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 24px;
        }

        body.dark-mode .rating-section {
          background: rgba(42, 42, 42, 0.6);
          border-color: rgba(200, 200, 200, 0.08);
        }

        .rating-section h2 {
          color: #2a2a2a;
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 20px;
        }

        body.dark-mode .rating-section h2 {
          color: #f5f5f5;
        }

        .star-rating {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
        }

        .star {
          width: 32px;
          height: 32px;
          color: #d1d5db;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .star:hover,
        .star.active {
          color: #E34234;
          fill: #E34234;
          transform: scale(1.1);
        }

        .comment-input {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .comment-input textarea {
          width: 100%;
          padding: 14px 18px;
          border: 2px solid rgba(100, 100, 100, 0.15);
          border-radius: 12px;
          font-size: 15px;
          background: rgba(255, 255, 255, 0.5);
          color: #2a2a2a;
          font-family: 'Poppins', sans-serif;
          resize: vertical;
          transition: all 0.3s ease;
        }

        .comment-input textarea:focus {
          outline: none;
          border-color: #00BCD4;
          background: rgba(255, 255, 255, 0.8);
        }

        body.dark-mode .comment-input textarea {
          background: rgba(60, 60, 60, 0.5);
          border-color: rgba(200, 200, 200, 0.15);
          color: #f5f5f5;
        }

        body.dark-mode .comment-input textarea:focus {
          background: rgba(60, 60, 60, 0.8);
          border-color: #00BCD4;
        }

        .btn-submit {
          background: #E34234;
          color: white;
          border: none;
          padding: 14px 28px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          align-self: flex-start;
          transition: all 0.3s ease;
        }

        .btn-submit:hover {
          background: #c73629;
          transform: translateY(-2px);
        }

        .comments-section {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(100, 100, 100, 0.08);
          border-radius: 16px;
          padding: 32px;
        }

        body.dark-mode .comments-section {
          background: rgba(42, 42, 42, 0.6);
          border-color: rgba(200, 200, 200, 0.08);
        }

        .comments-section h2 {
          color: #2a2a2a;
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 20px;
        }

        body.dark-mode .comments-section h2 {
          color: #f5f5f5;
        }

        .comments-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .comment-card {
          background: rgba(100, 100, 100, 0.03);
          border: 1px solid rgba(100, 100, 100, 0.08);
          border-radius: 12px;
          padding: 20px;
        }

        body.dark-mode .comment-card {
          background: rgba(200, 200, 200, 0.03);
          border-color: rgba(200, 200, 200, 0.08);
        }

        .comment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .comment-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn-report-comment {
          background: transparent;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
        }

        .btn-report-comment:hover {
          color: #E34234;
          background: rgba(227, 66, 52, 0.08);
        }

        body.dark-mode .btn-report-comment {
          color: #b8b8b8;
        }

        body.dark-mode .btn-report-comment:hover {
          color: #ff6b5e;
          background: rgba(227, 66, 52, 0.1);
        }

        .btn-report-comment svg {
          width: 16px;
          height: 16px;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .user-icon {
          width: 18px;
          height: 18px;
          color: #6b7280;
        }

        body.dark-mode .user-icon {
          color: #b8b8b8;
        }

        .user-info span {
          color: #2a2a2a;
          font-weight: 600;
        }

        body.dark-mode .user-info span {
          color: #f5f5f5;
        }

        .comment-rating {
          display: flex;
          gap: 4px;
        }

        .star-filled {
          width: 14px;
          height: 14px;
          color: #E34234;
          fill: #E34234;
        }

        .comment-text {
          color: #6b7280;
          font-size: 15px;
          line-height: 1.6;
        }

        body.dark-mode .comment-text {
          color: #b8b8b8;
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
          max-width: 450px;
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
          margin-bottom: 16px;
        }

        body.dark-mode .modal-content p {
          color: #b8b8b8;
        }

        .report-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid rgba(100, 100, 100, 0.15);
          border-radius: 8px;
          font-size: 15px;
          background: rgba(255, 255, 255, 0.5);
          color: #2a2a2a;
          font-family: 'Poppins', sans-serif;
          resize: vertical;
          margin-bottom: 20px;
        }

        .report-textarea:focus {
          outline: none;
          border-color: #E34234;
          background: rgba(255, 255, 255, 0.8);
        }

        body.dark-mode .report-textarea {
          background: rgba(60, 60, 60, 0.5);
          border-color: rgba(200, 200, 200, 0.15);
          color: #f5f5f5;
        }

        body.dark-mode .report-textarea:focus {
          background: rgba(60, 60, 60, 0.8);
          border-color: #E34234;
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

        .btn-confirm-report {
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

        .btn-confirm-report:hover {
          background: #c73629;
          transform: translateY(-2px);
        }

        .btn-confirm-report svg {
          width: 16px;
          height: 16px;
        }

        .delete-confirm-modal {
          text-align: center;
        }

        .delete-confirm-modal svg {
          margin-bottom: 16px;
        }

        .btn-confirm-delete {
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

        .btn-confirm-delete:hover:not(:disabled) {
          background: #c73629;
          transform: translateY(-2px);
        }

        .btn-confirm-delete:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-confirm-delete svg {
          width: 16px;
          height: 16px;
        }

        .success-modal {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          padding: 40px;
          border-radius: 16px;
          text-align: center;
          max-width: 400px;
          border: 1px solid rgba(100, 100, 100, 0.1);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        body.dark-mode .success-modal {
          background: rgba(42, 42, 42, 0.95);
          border-color: rgba(200, 200, 200, 0.1);
        }

        .success-modal svg {
          margin-bottom: 16px;
        }

        .success-modal h3 {
          margin-top: 20px;
          font-size: 24px;
          font-weight: 700;
          color: #2a2a2a;
        }

        body.dark-mode .success-modal h3 {
          color: #f5f5f5;
        }

        .success-modal p {
          margin-top: 10px;
          color: #6b7280;
          font-size: 15px;
        }

        body.dark-mode .success-modal p {
          color: #b8b8b8;
        }

        @media (max-width: 768px) {
          .laptop-image {
            height: 250px;
          }

          .article-header h1 {
            font-size: 32px;
          }

          .article-body,
          .rating-section,
          .comments-section {
            padding: 24px;
          }

          .btn-account span {
            display: none;
          }

          .header-actions {
            flex-direction: column;
          }

          .header-actions button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}

export default DetailView;