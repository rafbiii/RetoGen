import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSun, FiMoon, FiUser, FiSave, FiImage } from 'react-icons/fi';

function AdminWrite() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [article, setArticle] = useState({
    title: '',
    category: '',
    excerpt: '',
    content: '',
    imageUrl: ''
  });

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
    console.log('Article submitted:', article);
    // Add your save logic here
    alert('Article saved!');
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

          <button type="submit" className="btn-save">
            <FiSave />
            Publish Article
          </button>
        </form>
      </div>

      <style jsx>{`
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

        .write-form {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 20px 80px;
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

        .btn-save:hover {
          background: #c73629;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(227, 66, 52, 0.3);
        }

        .btn-save svg {
          width: 20px;
          height: 20px;
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

          .btn-account span {
            display: none;
          }
        }
      `}</style>
    </>
  );
}

export default AdminWrite;