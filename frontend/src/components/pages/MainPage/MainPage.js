import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSun, FiMoon, FiUser, FiSearch, FiFilter, FiPlus } from 'react-icons/fi';
import { fetchMainPageData, transformArticles } from '../../../services/MainPageService';
import { verifyAdmin } from '../../../services/VerificationService';
import './MainPage.css';

function MainPage() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [username, setUsername] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  useEffect(() => {
    const loadMainPageData = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');

        if (!token) {
          navigate('/login');
          return;
        }

        // Verify admin role using service
        const verifyResult = await verifyAdmin(token);

        if (!verifyResult.success) {
          if (verifyResult.error === 'token_invalid') {
            localStorage.removeItem('token');
            alert('Token invalid. Please login again.');
            navigate('/login');
            return;
          }

          if (verifyResult.error === 'backend_error') {
            console.warn('Backend error during admin verification');
          }

          setIsAdmin(false);
        } else {
          setIsAdmin(verifyResult.isAdmin);
        }

        // Fetch data using service
        const result = await fetchMainPageData(token);

        if (!result.success) {
          // Handle different error types
          if (result.error === 'network_error') {
            setError('Network error. Please check your connection.');
          } else if (result.data?.confirmation === 'token invalid') {
            localStorage.removeItem('token');
            alert('Token invalid. Please login again.');
            navigate('/login');
            return;
          } else if (result.data?.confirmation === 'backend error') {
            setError('Server is busy, try again later');
          } else {
            setError('An error occurred. Please try again.');
          }
          setLoading(false);
          return;
        }

        const data = result.data;

        // Handle different response confirmations
        if (data.confirmation === 'token invalid') {
          localStorage.removeItem('token');
          alert('Token invalid. Please login again.');
          navigate('/login');
          return;
        }

        if (data.confirmation === 'backend error') {
          setError('Server is busy, try again later');
          setLoading(false);
          return;
        }

        if (data.confirmation === 'fetch data successful') {
          setUsername(data.username);
          const transformedArticles = transformArticles(data.list_article);
          setArticles(transformedArticles);
          setLoading(false);
        }
      } catch (error) {
        console.error('Unexpected error in loadMainPageData:', error);
        setError('An unexpected error occurred');
        setLoading(false);
      }
    };

    loadMainPageData();
  }, [navigate]);

  // Filter and sort articles
  const getFilteredArticles = () => {
    let filtered = articles;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    if (sortBy === 'newest') {
      filtered = [...filtered].reverse();
    } else if (sortBy === 'oldest') {
      filtered = [...filtered];
    }
    // Note: 'popular' sorting would need additional data from backend

    return filtered;
  };

  // Loading state
  if (loading) {
    return (
      <div className="main-page">
        <div className="bg-shape-1"></div>
        <div className="bg-shape-2"></div>
        <div className="bg-shape-3"></div>

        <nav className="navbar">
          <div className="nav-inner">
            <div className="logo">
              <div className="anteater-icon">
                <img src="/figures/logo.png" alt="Retogen Logo" />
              </div>
              <span>Retogen</span>
            </div>
          </div>
        </nav>

        <div className="container">
          <div className="loading-message">
            <h2>Loading...</h2>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="main-page">
        <div className="bg-shape-1"></div>
        <div className="bg-shape-2"></div>
        <div className="bg-shape-3"></div>

        <nav className="navbar">
          <div className="nav-inner">
            <div className="logo">
              <div className="anteater-icon">
                <img src="/figures/logo.png" alt="Retogen Logo" />
              </div>
              <span>Retogen</span>
            </div>
          </div>
        </nav>

        <div className="container">
          <div className="error-message">
            <h2>{error}</h2>
            <button className="btn-retry" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredArticles = getFilteredArticles();

  return (
    <div className="main-page">
      <div className="bg-shape-1"></div>
      <div className="bg-shape-2"></div>
      <div className="bg-shape-3"></div>

      <nav className="navbar">
        <div className="nav-inner">
          <div className="logo" onClick={() => navigate('/main')} style={{ cursor: 'pointer' }}>
            <div className="anteater-icon">
              <img src="/figures/logo.png" alt="Retogen Logo" />
            </div>
            <span>Retogen</span>
          </div>
          <div className="nav-buttons">
            {isAdmin && (
              <button className="btn-add-article" onClick={() => navigate('/admin/write')}>
                <FiPlus size={18} />
                <span>Add Article</span>
              </button>
            )}
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {isDarkMode ? <FiMoon size={20} /> : <FiSun size={20} />}
            </button>
            <button className="btn-account" onClick={() => navigate('/account')}>
              <FiUser size={18} />
              <span>{username || 'User'}</span>
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
            <FiSearch className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search articles"
            />
          </div>

          <div className="sort-box">
            <FiFilter className="filter-icon" size={18} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort articles"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        <div className="articles-list">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <div
                key={article.id}
                className="article-card"
                onClick={() => navigate(`/article/${article.id}`)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') navigate(`/article/${article.id}`);
                }}
              >
                <div className="card-accent"></div>
                <div className="article-image">
                  {article.image ? (
                    <img src={article.image} alt={article.title} />
                  ) : (
                    <div className="image-placeholder">
                      <span>No Image</span>
                    </div>
                  )}
                </div>
                <div className="article-content">
                  <span className="category">{article.category}</span>
                  <h2>{article.title}</h2>
                  <p>{article.excerpt}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <h3>No articles found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainPage;