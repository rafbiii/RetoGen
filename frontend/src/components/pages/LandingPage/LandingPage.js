import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../common/Navbar/Navbar';
import { FiSearch, FiUsers, FiShield, FiZap, FiLock, FiBarChart2 } from 'react-icons/fi';
import './LandingPage.css';
import { initializeTheme } from '../../../services/themeUtils';

function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    initializeTheme();
  }, []);

  return (
    <>
      <div className="grid-background"></div>
      <div className="bg-shape-1"></div>
      <div className="bg-shape-2"></div>
      <div className="bg-shape-3"></div>
      
      <Navbar />

      <div className="container">
        <div className="hero">
          <h1>Real Ratings. Real People.</h1>
          <p className="subtitle">Honest laptop reviews from consumers, for consumers.</p>
          <button className="btn btn-register" onClick={() => navigate('/register')}>
            Join the Community
          </button>
          
          <div className="badges">
            <div className="badge">100% Consumer Driven</div>
            <div className="badge">Reliable Server</div>
            <div className="badge">Authentic Reviews</div>
          </div>
        </div>

        {/* Showcase Section */}
        <div className="showcase-section">
          <div className="showcase-decorations">
            <div className="showcase-circle circle-1"></div>
            <div className="showcase-circle circle-2"></div>
            <div className="showcase-circle circle-3"></div>
          </div>
          <div className="showcase-image-container">
            <img 
              src="/figures/landingpage_showcase.png" 
              alt="Retogen Platform Showcase" 
              className="showcase-image"
            />
          </div>
        </div>

        <div className="features">
          <div className="feature-card">
            <div className="feature-icon">
              <FiSearch />
            </div>
            <h3 className="feature-title">Unbiased Reviews</h3>
            <p className="feature-text">Every rating comes from real users. No paid promotions or hidden agendas.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FiUsers />
            </div>
            <h3 className="feature-title">Community Powered</h3>
            <p className="feature-text">Built by consumers, for consumers. Your voice shapes what others buy.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FiShield />
            </div>
            <h3 className="feature-title">Zero Business Ties</h3>
            <p className="feature-text">Completely independent from manufacturers. Just honest opinions.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FiZap />
            </div>
            <h3 className="feature-title">Fast & Simple</h3>
            <p className="feature-text">Rate products in seconds. No lengthy forms required.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FiLock />
            </div>
            <h3 className="feature-title">Privacy First</h3>
            <p className="feature-text">Your data stays private. We never sell your information.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FiBarChart2 />
            </div>
            <h3 className="feature-title">Transparent Data</h3>
            <p className="feature-text">See real statistics and breakdowns. No manipulation.</p>
          </div>
        </div>

        <div className="cta-section">
          <h2 className="cta-title">Ready to Make Informed Decisions?</h2>
          <p className="cta-text">Join thousands of consumers sharing real experiences.</p>
          <button className="btn btn-register" onClick={() => navigate('/register')}>
            Get Started Free
          </button>
        </div>
      </div>

      <footer>
        <div className="footer-content">
          <div className="footer-section">
            <h3>About Retogen</h3>
            <p className="footer-text">Content coming soon...</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Home</a></li>
              <li><a href="#" className="footer-link">Reviews</a></li>
              <li><a href="#" className="footer-link">Community</a></li>
              <li><a href="#" className="footer-link">About Us</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Support</h3>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Help Center</a></li>
              <li><a href="#" className="footer-link">Contact Us</a></li>
              <li><a href="#" className="footer-link">FAQs</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Legal</h3>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Privacy Policy</a></li>
              <li><a href="#" className="footer-link">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 Retogen. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default LandingPage;