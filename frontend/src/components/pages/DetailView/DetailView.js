import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiStar, FiSend, FiEdit, FiFlag, FiTrash2, FiCheckCircle, FiAlertCircle, FiUser, FiX, FiMessageCircle } from 'react-icons/fi';
import Navbar from '../../common/Navbar/Navbar';
import DetailArticleService from '../../../services/DetailArticleService';
import DeleteArticleService from '../../../services/DeleteArticleService';
import AddCommentService from '../../../services/AddCommentService';
import EditCommentService from '../../../services/EditCommentService';
import DeleteCommentService from '../../../services/DeleteCommentService';
import AddRatingService from '../../../services/AddRatingService';
import { initializeTheme } from '../../../services/themeUtils';
import './DetailView.css';

// Recursive comment component - MOVED OUTSIDE to prevent re-creation on state change
const CommentItem = ({
  comment,
  depth = 0,
  username,
  ratings,
  editingCommentId,
  editCommentContent,
  setEditCommentContent,
  replyingToCommentId,
  replyContent,
  setReplyContent,
  isSubmittingReply,
  handleEditComment,
  handleCancelEdit,
  handleSaveEdit,
  handleDeleteComment,
  handleReplyClick,
  handleCancelReply,
  handleSubmitReply,
  openReportModal
}) => {

  const { id } = useParams();
  const [articleOwner, setArticleOwner] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const data = await DetailArticleService.viewArticle(token, id);
      setArticleOwner(data.username);
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const isOwner = comment.owner === articleOwner;
  const isEditing = editingCommentId === comment.comment_id;
  const isReplying = replyingToCommentId === comment.comment_id;

  const getUserRating = (owner) => {
    const userRatingObj = ratings.find((r) => r.owner === owner);
    return userRatingObj ? userRatingObj.rating_value : null;
  };

  const commentUserRating = getUserRating(comment.owner);

  const effectiveDepth = Math.min(depth, 2);
  const marginLeft = effectiveDepth * 20;
  return (
    <div 
      className="comment-item" 
      style={{ marginLeft: `${marginLeft}px` }}
    >
      <div className="comment-header">
        <div className="comment-author">
          <FiUser />
          <span className="author-name">{comment.owner}</span>
          {commentUserRating !== null && (
            <div className="comment-user-rating">
              <FiStar className="rating-icon-small" />
              <span className="rating-value-small">{commentUserRating}</span>
            </div>
          )}
        </div>
        {!isEditing && (
        <div className="comment-actions">
          {isOwner && (
            <>
              <button 
                className="btn-action-edit" 
                onClick={() => handleEditComment(comment.comment_id, comment.comment_content)}
              >
                <FiEdit />
                Edit
              </button>

              <button 
                className="btn-action-delete" 
                onClick={() => handleDeleteComment(comment.comment_id)}
              >
                <FiTrash2 />
                Delete
              </button>
            </>
          )}
        </div>
      )}
      </div>

      {isEditing ? (
        <div className="edit-comment-form">
          <textarea
            className="edit-textarea"
            value={editCommentContent}
            onChange={(e) => setEditCommentContent(e.target.value)}
            rows="4"
            maxLength={8192}
          />
          <div className="character-count">
            {editCommentContent.length} / 8192 characters
          </div>
          <div className="edit-buttons">
            <button className="btn-cancel-edit" onClick={handleCancelEdit}>
              <FiX />
              Cancel
            </button>
            <button 
              className="btn-save-edit" 
              onClick={() => handleSaveEdit(comment.comment_id)}
              disabled={!editCommentContent.trim()}
            >
              <FiCheckCircle />
              Save
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="comment-text">{comment.comment_content}</p>
          <div className="comment-footer">
            <button 
              className="btn-reply" 
              onClick={() => handleReplyClick(comment.comment_id)}
            >
              <FiMessageCircle />
              Reply
            </button>
            <button 
              className="btn-report-comment" 
              onClick={() => openReportModal('comment', comment.comment_id)}
            >
              <FiFlag />
              Report
            </button>
          </div>
        </>
      )}

      {isReplying && (
        <div className="reply-form">
          <textarea
            className="reply-textarea"
            placeholder="Write your reply... (1-8192 characters)"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            rows="3"
            maxLength={8192}
          />
          <div className="character-count">
            {replyContent.length} / 8192 characters
          </div>
          <div className="reply-buttons">
            <button className="btn-cancel-reply" onClick={handleCancelReply}>
              <FiX />
              Cancel
            </button>
            <button 
              className="btn-submit-reply" 
              onClick={() => handleSubmitReply(comment.comment_id)}
              disabled={isSubmittingReply || !replyContent.trim()}
            >
              <FiSend />
              {isSubmittingReply ? 'Posting...' : 'Post Reply'}
            </button>
          </div>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="replies-container">
          {comment.replies.map(reply => (
            <CommentItem 
              key={reply.comment_id} 
              comment={reply} 
              depth={Math.min(depth + 1, 2)}
              username={username}
              ratings={ratings}
              editingCommentId={editingCommentId}
              editCommentContent={editCommentContent}
              setEditCommentContent={setEditCommentContent}
              replyingToCommentId={replyingToCommentId}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
              isSubmittingReply={isSubmittingReply}
              handleEditComment={handleEditComment}
              handleCancelEdit={handleCancelEdit}
              handleSaveEdit={handleSaveEdit}
              handleDeleteComment={handleDeleteComment}
              handleReplyClick={handleReplyClick}
              handleCancelReply={handleCancelReply}
              handleSubmitReply={handleSubmitReply}
              openReportModal={openReportModal}
            />
          ))}
        </div>
      )}
    </div>
  );
};

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
  
  // New states for comment and rating functionality
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [hasUserRated, setHasUserRated] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  
  // Reply states
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  
  // Rating confirmation modal
  const [showRatingConfirmModal, setShowRatingConfirmModal] = useState(false);
  const [pendingRating, setPendingRating] = useState(0);
  
  useEffect(() => {
    initializeTheme();
  }, []);

  // Article data from API
  const [article, setArticle] = useState(null);
  const [userclass, setUserclass] = useState('user');
  const [username, setUsername] = useState('');
  const [comments, setComments] = useState([]);
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }

    fetchArticleData(token);
  }, [id]);

  const fetchArticleData = async (token) => {
    setIsLoading(true);
    try {
      const data = await DetailArticleService.viewArticle(token, id);
      const currentUsername = data.username;

      if (data.confirmation === 'token invalid') {
        displayPopup('token invalid');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return;
      }

      if (data.confirmation === 'backend error') {
        displayPopup('server busy');
        setIsLoading(false);
        return;
      }

      if (data.confirmation === 'successful') {
        setArticle({
          title: data.article_title,
          content: data.article_content,
          tag: data.article_tag,
          image: data.article_image
        });
        setUserclass(data.userclass);
        setUsername(currentUsername);
        
        // Set comments from API
        if (data.comments && Array.isArray(data.comments)) {
          setComments(data.comments);
        }
        
        // Set ratings from API and calculate average
        if (data.ratings && Array.isArray(data.ratings)) {
          setRatings(data.ratings);
          setRatingCount(data.ratings.length);
          
          if (data.ratings.length > 0) {
            const sum = data.ratings.reduce((acc, r) => acc + r.rating_value, 0);
            setAverageRating((sum / data.ratings.length).toFixed(1));
          }
          
          // Check if current user has already rated and get their rating
          const userRatingObj = data.ratings.find(r => r.owner === currentUsername);
          if (userRatingObj) {
            setHasUserRated(true);
            setUserRating(userRatingObj.rating_value);
            setRating(userRatingObj.rating_value); // Set rating state untuk tampilan
          }
        }
        
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

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!comment.trim()) {
      displayPopup('Comment cannot be empty');
      return;
    }
    
    if (comment.length < 1 || comment.length > 8192) {
      displayPopup('Comment must be between 1-8192 characters');
      return;
    }
    
    setIsSubmittingComment(true);
    const token = localStorage.getItem('token');
    
    try {
      const data = await AddCommentService.addComment(token, id, comment, "");
      
      if (data.confirmation === 'token invalid') {
        displayPopup('token invalid');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return;
      }
      

      if (data.confirmation === 'backend error') {
        displayPopup('server busy');
        setIsSubmittingComment(false);
        return;
      }
      
      if (data.confirmation === 'successful') {
        // Update article data with new response
        setArticle({
          title: data.article_title,
          content: data.article_content,
          tag: data.article_tag,
          image: data.article_image
        });
        setComments(data.comments || []);
        setRatings(data.ratings || []);
        
        setComment('');
        displayPopup('Comment added successfully');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      displayPopup('server busy');
    }
    
    setIsSubmittingComment(false);
  };

  const handleSubmitReply = async (parentCommentId) => {
    // Validation
    if (!replyContent.trim()) {
      displayPopup('Reply cannot be empty');
      return;
    }
    
    if (replyContent.length < 1 || replyContent.length > 8192) {
      displayPopup('Reply must be between 1-8192 characters');
      return;
    }
    
    setIsSubmittingReply(true);
    const token = localStorage.getItem('token');
    
    try {
      const data = await AddCommentService.addComment(token, id, replyContent, parentCommentId);
      
      if (data.confirmation === 'token invalid') {
        displayPopup('token invalid');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return;
      }
      
      if (data.confirmation === 'backend error') {
        displayPopup('server busy');
        setIsSubmittingReply(false);
        return;
      }
      
      if (data.confirmation === 'successful') {
        // Update article data with new response
        setArticle({
          title: data.article_title,
          content: data.article_content,
          tag: data.article_tag,
          image: data.article_image
        });
        setComments(data.comments || []);
        setRatings(data.ratings || []);
        
        setReplyContent('');
        setReplyingToCommentId(null);
        displayPopup('Reply added successfully');
      }
    } catch (error) {
      console.error('Error adding reply:', error);
      displayPopup('server busy');
    }
    
    setIsSubmittingReply(false);
  };

  const handleRatingClick = (selectedRating) => {
    if (hasUserRated) return; // Prevent re-rating
    setPendingRating(selectedRating);
    setShowRatingConfirmModal(true);
  };

  const confirmRatingSubmission = async () => {
    setIsSubmittingRating(true);
    const token = localStorage.getItem('token');
    
    try {
      const data = await AddRatingService.addRating(token, id, pendingRating);
      
      if (data.confirmation === 'token invalid') {
        displayPopup('token invalid');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return;
      }
      
      if (data.confirmation === 'backend error') {
        displayPopup('server busy');
        setIsSubmittingRating(false);
        setShowRatingConfirmModal(false);
        return;
      }
      
      if (data.confirmation === 'successful') {
        // Update article data with new response
        setArticle({
          title: data.article_title,
          content: data.article_content,
          tag: data.article_tag,
          image: data.article_image
        });
        setComments(data.comments || []);
        setRatings(data.ratings || []);
        
        // Update rating states
        setHasUserRated(true);
        setUserRating(pendingRating);
        setRating(pendingRating);
        
        // Recalculate average
        if (data.ratings && data.ratings.length > 0) {
          const sum = data.ratings.reduce((acc, r) => acc + r.rating_value, 0);
          setAverageRating((sum / data.ratings.length).toFixed(1));
          setRatingCount(data.ratings.length);
        }
        
        displayPopup('Rating submitted successfully');
        setShowRatingConfirmModal(false);
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      displayPopup('server busy');
    }
    
    setIsSubmittingRating(false);
  };

  const cancelRatingSubmission = () => {
    setShowRatingConfirmModal(false);
    setPendingRating(0);
    setRating(userRating || 0); // Reset to user's existing rating or 0
  };

  const handleEditComment = (commentId, currentContent) => {
    setEditingCommentId(commentId);
    setEditCommentContent(currentContent);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditCommentContent('');
  };

  const handleSaveEdit = async (commentId) => {
    // Validation
    if (!editCommentContent.trim()) {
      displayPopup('Comment cannot be empty');
      return;
    }
    
    if (editCommentContent.length < 1 || editCommentContent.length > 8192) {
      displayPopup('Comment must be between 1-8192 characters');
      return;
    }
    
    const token = localStorage.getItem('token');
    
    try {
      const data = await EditCommentService.editComment(token, id, commentId, editCommentContent);
      
      if (data.confirmation === 'token invalid') {
        displayPopup('token invalid');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return;
      }
      
      if (data.confirmation === 'backend error') {
        displayPopup('server busy');
        return;
      }
      
      if (data.confirmation === 'successful') {
        // Update article data with new response
        setArticle({
          title: data.article_title,
          content: data.article_content,
          tag: data.article_tag,
          image: data.article_image
        });
        setComments(data.comments || []);
        setRatings(data.ratings || []);
        
        setEditingCommentId(null);
        setEditCommentContent('');
        displayPopup('Comment updated successfully');
      }
    } catch (error) {
      console.error('Error editing comment:', error);
      displayPopup('server busy');
    }
  };

  const handleDeleteComment = (commentId) => {
    setDeletingCommentId(commentId);
    setShowDeleteCommentModal(true);
  };

  const confirmDeleteComment = async () => {
    const token = localStorage.getItem('token');
    
    try {
      const data = await DeleteCommentService.deleteComment(token, id, deletingCommentId);

      if (data.confirmation === 'token invalid') {
        displayPopup('token invalid');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return;
      }
      
      if (data.confirmation === 'backend error') {
        displayPopup('server busy');
        setShowDeleteCommentModal(false);
        return;
      }
      
      if (data.confirmation === 'successful') {
        // Update article data with new response
        console.log("Delete comment response:", data); // Debug log
        
        setShowDeleteCommentModal(false);
        setDeletingCommentId(null);
        displayPopup('Comment deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      displayPopup('server busy');
    }
  };

  const cancelDeleteComment = () => {
    setShowDeleteCommentModal(false);
    setDeletingCommentId(null);
  };

  const openReportModal = (type, target = null) => {
    setReportType(type);
    setReportTarget(target);
    setShowReportModal(true);
  };

  const handleReport = () => {
    // Implement report functionality
    displayPopup(`${reportType} reported successfully`);
    setShowReportModal(false);
    setReportReason('');
  };

  const handleEditArticle = () => {
    navigate(`/edit-article/${id}`);
  };

  const handleDeleteArticle = () => {
    setShowDeleteConfirmModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    const token = localStorage.getItem('token');
    
    try {
      const data = await DeleteArticleService.deleteArticle(token, id);
      
      if (data.confirmation === 'token invalid') {
        displayPopup('token invalid');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return;
      }
      
      if (data.confirmation === 'backend error') {
        displayPopup('server busy');
        setIsDeleting(false);
        setShowDeleteConfirmModal(false);
        return;
      }
      
      if (data.confirmation === 'successful') {
        setShowDeleteConfirmModal(false);
        setSuccessMessage('Article deleted successfully!');
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

  const handleReplyClick = (commentId) => {
    setReplyingToCommentId(commentId);
    setReplyContent('');
  };

  const handleCancelReply = () => {
    setReplyingToCommentId(null);
    setReplyContent('');
  };

  // Organize comments into parent-child structure with depth tracking
  const organizeComments = () => {
    const commentMap = new Map();
    const rootComments = [];

    // First pass: create a map of all comments
    comments.forEach(comment => {
      commentMap.set(comment.comment_id, { ...comment, replies: [], depth: 0 });
    });

    // Second pass: organize into tree structure and track depth
    comments.forEach(comment => {
      if (comment.parent_comment_id && comment.parent_comment_id !== "") {
        const parent = commentMap.get(comment.parent_comment_id);
        const child = commentMap.get(comment.comment_id);
        if (parent && child) {
          child.depth = parent.depth + 1;
          parent.replies.push(child);
        }
      } else {
        const rootComment = commentMap.get(comment.comment_id);
        if (rootComment) {
          rootComments.push(rootComment);
        }
      }
    });

    return rootComments;
  };

  const organizedComments = organizeComments();

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="navbar-placeholder"></div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading article...</p>
        </div>
      </>
    );
  }

  if (!article) {
    return (
      <>
        <Navbar />
        <div className="navbar-placeholder"></div>
        <div className="error-container">
          <h2>Article not found</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="navbar-placeholder"></div>
      <Navbar showBack={true} showAccount={true} onBackClick={() => navigate('/main')} />
      <div className="article-detail">
        {article.image && (
          <div className="laptop-image">
            <img src={`data:image/jpeg;base64,${article.image}`} alt={article.title} />
          </div>
        )}

        <div className="article-header">
          <div className="header-accent"></div>
          <h1>{article.title}</h1>
          
          {article.tag && (
            <div className="tag-container">
              <span className="article-tag">{article.tag}</span>
            </div>
          )}
          
          {ratingCount > 0 && (
            <div className="average-rating-display">
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    className={`star-display ${averageRating >= star ? 'filled' : ''}`}
                  />
                ))}
              </div>
              <span className="rating-text">
                {averageRating} / 5 ({ratingCount} {ratingCount === 1 ? 'rating' : 'ratings'})
              </span>
            </div>
          )}
          
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

        {/* Rating Section - 1-5 scale */}
        <div className="rating-section">
          <h2>{hasUserRated ? 'Your Rating' : 'Rate This Article'}</h2>
          {hasUserRated ? (
            <div className="user-rating-display">
              <div className="star-rating-display">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    className={`star-display ${userRating >= star ? 'filled' : ''}`}
                  />
                ))}
              </div>
              <p className="rating-value">You rated: {userRating} / 5</p>
            </div>
          ) : (
            <div className="rating-input-container">
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    className={`star ${rating >= star ? 'active' : ''}`}
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => !hasUserRated && setRating(star)}
                    onMouseLeave={() => !hasUserRated && setRating(userRating || 0)}
                  />
                ))}
              </div>
              <p className="rating-helper">Click a star to rate from 1 to 5</p>
            </div>
          )}
        </div>

        {/* Comment Section */}
        <div className="rating-section">
          <h2>Share Your Thoughts</h2>
          <form onSubmit={handleSubmitComment}>
            <div className="comment-input">
              <textarea
                placeholder="Write your comment here... (1-8192 characters)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="4"
                maxLength={8192}
              />
              <div className="character-count">
                {comment.length} / 8192 characters
              </div>
              <button 
                type="submit" 
                className="btn-submit"
                disabled={isSubmittingComment || !comment.trim()}
              >
                <FiSend />
                {isSubmittingComment ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        </div>

        {/* Comments List */}
        <div className="comments-section">
          <h2>Comments ({comments.length})</h2>
          {comments.length === 0 ? (
            <p className="no-comments">No comments yet. Be the first to comment!</p>
          ) : (
            <div className="comments-list">
              {organizedComments.map((c) => (
                <CommentItem 
                  key={c.comment_id} 
                  comment={c} 
                  depth={0}
                  username={username}
                  ratings={ratings}
                  editingCommentId={editingCommentId}
                  editCommentContent={editCommentContent}
                  setEditCommentContent={setEditCommentContent}
                  replyingToCommentId={replyingToCommentId}
                  replyContent={replyContent}
                  setReplyContent={setReplyContent}
                  isSubmittingReply={isSubmittingReply}
                  handleEditComment={handleEditComment}
                  handleCancelEdit={handleCancelEdit}
                  handleSaveEdit={handleSaveEdit}
                  handleDeleteComment={handleDeleteComment}
                  handleReplyClick={handleReplyClick}
                  handleCancelReply={handleCancelReply}
                  handleSubmitReply={handleSubmitReply}
                  openReportModal={openReportModal}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Rating Confirmation Modal */}
      {showRatingConfirmModal && (
        <div className="modal-overlay" onClick={cancelRatingSubmission}>
          <div className="modal-content rating-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <FiStar size={64} color="#E34234" />
            <h3>Confirm Your Rating</h3>
            <p>Are you sure you want to rate this article <strong>{pendingRating} out of 5 stars</strong>?</p>
            <div className="star-rating-display-modal">
              {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                  key={star}
                  className={`star-display ${pendingRating >= star ? 'filled' : ''}`}
                />
              ))}
            </div>
            <p className="rating-warning">Note: Ratings cannot be edited once submitted.</p>
            <div className="modal-buttons">
              <button className="btn-cancel" onClick={cancelRatingSubmission}>
                Cancel
              </button>
              <button className="btn-confirm-rating" onClick={confirmRatingSubmission} disabled={isSubmittingRating}>
                <FiCheckCircle />
                {isSubmittingRating ? 'Submitting...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
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

      {/* Popup Notification */}
      {showPopup && (
        <div className="popup-notification">
          {popupMessage}
        </div>
      )}

      {/* Delete Article Confirmation Modal */}
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

      {/* Delete Comment Confirmation Modal */}
      {showDeleteCommentModal && (
        <div className="modal-overlay" onClick={cancelDeleteComment}>
          <div className="modal-content delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <FiAlertCircle size={64} color="#E34234" />
            <h3>Delete Comment?</h3>
            <p>Are you sure you want to delete this comment? This action cannot be undone.</p>
            <div className="modal-buttons">
              <button className="btn-cancel" onClick={cancelDeleteComment}>
                Cancel
              </button>
              <button className="btn-confirm-delete" onClick={confirmDeleteComment}>
                <FiTrash2 />
                Delete
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
    </>
  );
}

export default DetailView;