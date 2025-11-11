import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSun, FiMoon, FiUser, FiSave, FiImage, FiTrash2 } from 'react-icons/fi';

function AdminEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [article, setArticle] = useState({
    title: '',
    category: '',
    excerpt: '',
    content: '',
    imageUrl: ''
  });

  useEffect(() => {
    // Load existing article data (dummy data for now)
    setArticle({
      title: `Product Review ${id}`,
      category: 'Ultrabook',
      excerpt: 'Brief description of the product',
      content: 'Detailed review content goes here...',
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=500&fit=crop'
    });
  }, [id]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  const handleChange = (e) => {
    setArticle({
      ...article,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Article updated:', article);
    alert('Article updated!');
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    console.log('Article deleted:', id);
    setShowDeleteModal(false);
    navigate('/main');
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
              <span>Admin</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
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
                name="title"
                value={article.title}
                onChange={handleChange}
                placeholder="Product name"
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={article.category}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                <option value="Ultrabook">Ultrabook</option>
                <option value="Premium">Premium</option>
                <option value="Business">Business</option>
                <option value="Gaming">Gaming</option>
                <option value="Budget">Budget</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>
              <FiImage style={{ marginRight: '8px' }} />
              Image URL
            </label>
            <input
              type="url"
              name="imageUrl"
              value={article.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {article.imageUrl && (
            <div className="image-preview">
              <img src={article.imageUrl} alt="Preview" />
            </div>
          )}

          <div className="form-group">
            <label>Excerpt</label>
            <textarea
              name="excerpt"
              value={article.excerpt}
              onChange={handleChange}
              placeholder="Brief description (max 150 characters)"
              rows="2"
              maxLength="150"
              required
            />
          </div>

          <div className="form-group">
            <label>Content</label>
            <textarea
              name="content"
              value={article.content}
              onChange={handleChange}
              placeholder="Write your detailed review here..."
              rows="12"
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" className="btn-save">
              <FiSave />
              Update Article
            </button>
            <button type="button" className="btn-delete" onClick={handleDelete}>
              <FiTrash2 />
              Delete
            </button>
          </div>
        </form>

        {showDeleteModal && (
          <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Delete Article?</h3>
              <p>This action cannot be undone. Are you sure you want to delete this article?</p>
              <div className="modal-buttons">
                <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <button className="btn-confirm-delete" onClick={confirmDelete}>
                  <FiTrash2 />
                  Delete
                </button>
              </div>
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

        .edit-header h1 {
          color: #2a2a2a;
          font-size: 42px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        body.dark-mode .edit-header h1 {
          color: #f5f5f5;
        }

        .edit-header p {
          color: #6b7280;
          font-size: 16px;
        }

        body.dark-mode .edit-header p {
          color: #b8b8b8;
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

        .image-preview {
          width: 100%;
          height: 300px;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 24px;
          border: 2px solid rgba(100, 100, 100, 0.1);
        }

        .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .button-group {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 12px;
          margin-top: 8px;
        }

        .btn-save {
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

        .btn-delete {
          background: transparent;
          color: #E34234;
          border: 2px solid #E34234;
          padding: 16px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .btn-delete:hover {
          background: rgba(227, 66, 52, 0.1);
        }

        body.dark-mode .btn-delete {
          color: #ff6b5e;
          border-color: #ff6b5e;
        }

        .btn-delete svg {
          width: 18px;
          height: 18px;
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

        .btn-confirm-delete:hover {
          background: #c73629;
          transform: translateY(-2px);
        }

        .btn-confirm-delete svg {
          width: 16px;
          height: 16px;
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
            grid-template-columns: 1fr;
          }

          .btn-account span {
            display: none;
          }
        }
      `}</style>
    </>
  );
}

export default AdminEdit;