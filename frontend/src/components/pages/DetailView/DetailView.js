import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiStar, FiSend, FiEdit, FiFlag, FiTrash2, FiCheckCircle, FiAlertCircle, FiUser } from 'react-icons/fi';
import Navbar from '../../common/Navbar/Navbar';
import DetailArticleService from '../../../services/DetailArticleService';
import DeleteArticleService from '../../../services/DeleteArticleService';
import { initializeTheme } from '../../../services/themeUtils';
import './DetailView.css';

function DetailView() {
  const navigate = useNavigate();
  const { id } = useParams();
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
  
  useEffect(() => {
    initializeTheme();
  }, []);

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
        
        <Navbar showBack={true} showAccount={true} onBackClick={() => navigate('/main')} />
        <div className="navbar-placeholder"></div>

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
        
        <Navbar showBack={true} showAccount={false} onBackClick={() => navigate('/main')} />
        <div className="navbar-placeholder"></div>

        <div className="container">
          <div className="error-container">
            <h2>Article not found</h2>
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
      
      <Navbar showBack={true} showAccount={true} onBackClick={() => navigate('/main')} />
      <div className="navbar-placeholder"></div>

      <div className="container">
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
                    Edit
                  </button>
                  <button className="btn-delete" onClick={handleDeleteArticle}>
                    <FiTrash2 />
                    Delete
                  </button>
                </>
              )}
              <button className="btn-report" onClick={() => openReportModal('article')}>
                <FiFlag />
                Report
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
    </>
  );
}

export default DetailView;