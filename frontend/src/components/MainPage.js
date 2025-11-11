import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSun, FiMoon, FiUser, FiSearch, FiFilter } from 'react-icons/fi';

function MainPage() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  const articles = [
    { 
      id: 1, 
      title: 'Dell XPS 13', 
      category: 'Ultrabook', 
      excerpt: 'Compact powerhouse for professionals with stunning display and exceptional performance',
      image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=400&fit=crop'
    },
    { 
      id: 2, 
      title: 'MacBook Pro 14"', 
      category: 'Premium', 
      excerpt: 'M3 chip delivers exceptional performance for creative professionals and power users',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop'
    },
    { 
      id: 3, 
      title: 'ThinkPad X1 Carbon', 
      category: 'Business', 
      excerpt: 'Legendary keyboard meets modern design in this enterprise-grade ultrabook',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop'
    }
  ];

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
        <div className="hero-section">
          <div className="hero-accent"></div>
          <h1>Featured Reviews</h1>
          <p>Discover the best laptops reviewed by our community</p>
        </div>

        <div className="filters-bar">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search articles..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="sort-box">
            <FiFilter className="filter-icon" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        <div className="articles-list">
          {articles.map((article) => (
            <div 
              key={article.id} 
              className="article-card"
              onClick={() => navigate(`/article/${article.id}`)}
            >
              <div className="card-accent"></div>
              <div className="article-image">
                <img src={article.image} alt={article.title} />
              </div>
              <div className="article-content">
                <span className="category">{article.category}</span>
                <h2>{article.title}</h2>
                <p>{article.excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .hero-section {
          position: relative;
          text-align: center;
          padding: 80px 20px 40px;
        }

        .hero-accent {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 4px;
          background: linear-gradient(90deg, transparent, #E34234, transparent);
          border-radius: 2px;
        }

        .hero-section h1 {
          color: #2a2a2a;
          font-size: 48px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        body.dark-mode .hero-section h1 {
          color: #f5f5f5;
        }

        .hero-section p {
          color: #6b7280;
          font-size: 18px;
        }

        body.dark-mode .hero-section p {
          color: #b8b8b8;
        }

        .filters-bar {
          max-width: 900px;
          margin: 40px auto 32px;
          display: flex;
          gap: 16px;
          padding: 0 20px;
        }

        .search-box {
          flex: 1;
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          width: 18px;
          height: 18px;
          color: #6b7280;
        }

        body.dark-mode .search-icon {
          color: #b8b8b8;
        }

        .search-box input {
          width: 100%;
          padding: 12px 16px 12px 44px;
          border: 2px solid rgba(100, 100, 100, 0.15);
          border-radius: 8px;
          font-size: 15px;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(8px);
          color: #2a2a2a;
          transition: all 0.3s ease;
        }

        .search-box input:focus {
          outline: none;
          border-color: #E34234;
          background: rgba(255, 255, 255, 0.9);
        }

        body.dark-mode .search-box input {
          background: rgba(60, 60, 60, 0.6);
          border-color: rgba(200, 200, 200, 0.15);
          color: #f5f5f5;
        }

        body.dark-mode .search-box input:focus {
          background: rgba(60, 60, 60, 0.9);
          border-color: #E34234;
        }

        .sort-box {
          position: relative;
        }

        .filter-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          width: 18px;
          height: 18px;
          color: #6b7280;
          pointer-events: none;
          z-index: 1;
        }

        body.dark-mode .filter-icon {
          color: #b8b8b8;
        }

        .sort-box select {
          padding: 12px 16px 12px 44px;
          border: 2px solid rgba(100, 100, 100, 0.15);
          border-radius: 8px;
          font-size: 15px;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(8px);
          color: #2a2a2a;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
        }

        .sort-box select:focus {
          outline: none;
          border-color: #E34234;
          background: rgba(255, 255, 255, 0.9);
        }

        body.dark-mode .sort-box select {
          background: rgba(60, 60, 60, 0.6);
          border-color: rgba(200, 200, 200, 0.15);
          color: #f5f5f5;
        }

        body.dark-mode .sort-box select:focus {
          background: rgba(60, 60, 60, 0.9);
          border-color: #E34234;
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

        .articles-list {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 20px 80px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .article-card {
          position: relative;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(100, 100, 100, 0.1);
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          display: grid;
          grid-template-columns: 300px 1fr;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
        }

        body.dark-mode .article-card {
          background: rgba(42, 42, 42, 0.7);
          border-color: rgba(200, 200, 200, 0.1);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }

        .article-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
          background: rgba(255, 255, 255, 0.9);
        }

        body.dark-mode .article-card:hover {
          background: rgba(42, 42, 42, 0.9);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
        }

        .card-accent {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #E34234, #ff6b5e);
        }

        .article-image {
          width: 100%;
          height: 220px;
          overflow: hidden;
        }

        .article-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .article-card:hover .article-image img {
          transform: scale(1.05);
        }

        .article-content {
          padding: 32px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .category {
          display: inline-block;
          background: rgba(227, 66, 52, 0.1);
          color: #E34234;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 12px;
          width: fit-content;
        }

        body.dark-mode .category {
          background: rgba(227, 66, 52, 0.15);
          color: #ff6b5e;
        }

        .article-content h2 {
          color: #2a2a2a;
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        body.dark-mode .article-content h2 {
          color: #f5f5f5;
        }

        .article-content p {
          color: #6b7280;
          font-size: 15px;
          line-height: 1.6;
        }

        body.dark-mode .article-content p {
          color: #b8b8b8;
        }

        @media (max-width: 768px) {
          .hero-section h1 {
            font-size: 36px;
          }

          .filters-bar {
            flex-direction: column;
          }

          .article-card {
            grid-template-columns: 1fr;
          }

          .article-image {
            height: 180px;
          }

          .article-content {
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

export default MainPage;