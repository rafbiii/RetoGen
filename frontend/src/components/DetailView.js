import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSun, FiMoon, FiUser, FiArrowLeft, FiStar, FiSend, FiEdit, FiFlag } from 'react-icons/fi';

function DetailView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState(''); // 'article' or 'comment'
  const [reportTarget, setReportTarget] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const isAdmin = true; // Set to true for admin view
  const [comments, setComments] = useState([
    { id: 1, user: 'Alice', rating: 5, text: 'Excellent laptop! Very satisfied with the performance.' },
    { id: 2, user: 'Bob', rating: 4, text: 'Great build quality, minor heating issues.' }
  ]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating > 0 && comment.trim()) {
      setComments([...comments, { 
        id: comments.length + 1, 
        user: 'JohnDoe', 
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
    alert('Report submitted!');
    setShowReportModal(false);
    setReportReason('');
  };

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
              <span>JohnDoe</span>
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
          <div className="laptop-image">
            <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=500&fit=crop" alt="Laptop" />
          </div>
          
          <div className="article-header">
            <div className="header-accent"></div>
            <h1>Product Review {id}</h1>
            <p className="subtitle">Detailed analysis and user experience</p>
            <div className="header-actions">
              {isAdmin && (
                <button className="btn-edit" onClick={() => navigate(`/admin/edit/${id}`)}>
                  <FiEdit />
                  Edit Article
                </button>
              )}
              <button className="btn-report" onClick={() => openReportModal('article')}>
                <FiFlag />
                Report Article
              </button>
            </div>
          </div>

          <div className="article-body">
            <p>Comprehensive review content will appear here...</p>
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
      </div>

      <style jsx>{`
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
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .laptop-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .article-header {
          position: relative;
          padding-top: 24px;
          margin-bottom: 32px;
        }

        .header-accent {
          position: absolute;
          top: 0;
          left: 0;
          width: 60px;
          height: 4px;
          background: #E34234;
          border-radius: 2px;
        }

        .article-header h1 {
          color: #2a2a2a;
          font-size: 42px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        body.dark-mode .article-header h1 {
          color: #f5f5f5;
        }

        .subtitle {
          color: #6b7280;
          font-size: 18px;
        }

        body.dark-mode .subtitle {
          color: #b8b8b8;
        }

        .header-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        .btn-edit {
          background: #00ced1;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .btn-edit:hover {
          background: #00b8bb;
          transform: translateY(-2px);
        }

        body.dark-mode .btn-edit {
          background: #5dd7da;
          color: #2a2a2a;
        }

        body.dark-mode .btn-edit:hover {
          background: #7de2e5;
        }

        .btn-edit svg {
          width: 16px;
          height: 16px;
        }

        .btn-report {
          background: transparent;
          color: #E34234;
          border: 2px solid #E34234;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .btn-report:hover {
          background: rgba(227, 66, 52, 0.08);
        }

        body.dark-mode .btn-report {
          color: #ff6b5e;
          border-color: #ff6b5e;
        }

        body.dark-mode .btn-report:hover {
          background: rgba(227, 66, 52, 0.1);
        }

        .btn-report svg {
          width: 16px;
          height: 16px;
        }

        .article-body {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          padding: 40px;
          border: 1px solid rgba(100, 100, 100, 0.1);
          border-left: 4px solid #E34234;
          margin-bottom: 40px;
        }

        body.dark-mode .article-body {
          background: rgba(42, 42, 42, 0.6);
          border-color: rgba(200, 200, 200, 0.1);
          border-left-color: #E34234;
        }

        .article-body p {
          color: #6b7280;
          font-size: 16px;
          line-height: 1.8;
        }

        body.dark-mode .article-body p {
          color: #b8b8b8;
        }

        .rating-section {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          padding: 32px;
          border: 1px solid rgba(100, 100, 100, 0.1);
          margin-bottom: 32px;
        }

        body.dark-mode .rating-section {
          background: rgba(42, 42, 42, 0.6);
          border-color: rgba(200, 200, 200, 0.1);
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
          stroke-width: 2;
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
          padding: 12px 16px;
          border: 2px solid rgba(100, 100, 100, 0.15);
          border-radius: 8px;
          font-size: 15px;
          background: rgba(255, 255, 255, 0.5);
          color: #2a2a2a;
          resize: vertical;
          font-family: 'Poppins', sans-serif;
          transition: all 0.3s ease;
        }

        .comment-input textarea:focus {
          outline: none;
          border-color: #E34234;
          background: rgba(255, 255, 255, 0.8);
        }

        body.dark-mode .comment-input textarea {
          background: rgba(60, 60, 60, 0.5);
          border-color: rgba(200, 200, 200, 0.15);
          color: #f5f5f5;
        }

        body.dark-mode .comment-input textarea:focus {
          background: rgba(60, 60, 60, 0.8);
          border-color: #E34234;
        }

        .btn-submit {
          align-self: flex-end;
          background: #E34234;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .btn-submit:hover {
          background: #c73629;
          transform: translateY(-2px);
        }

        .btn-submit svg {
          width: 16px;
          height: 16px;
        }

        .comments-section {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          padding: 32px;
          border: 1px solid rgba(100, 100, 100, 0.1);
        }

        body.dark-mode .comments-section {
          background: rgba(42, 42, 42, 0.6);
          border-color: rgba(200, 200, 200, 0.1);
        }

        .comments-section h2 {
          color: #2a2a2a;
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 24px;
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
        }
      `}</style>
    </>
  );
}

export default DetailView;