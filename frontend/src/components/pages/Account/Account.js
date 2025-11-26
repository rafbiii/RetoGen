import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiCalendar, FiStar, FiLogOut, FiArrowLeft } from 'react-icons/fi';
import Navbar from '../../common/Navbar/Navbar';
import './Account.css';

function Account() {
  const navigate = useNavigate();

  // Dummy user data
  const user = {
    username: 'mrda',
    email: 'mrda@example.com',
    joinDate: '2 January 2025',
    reviewsCount: 21,
    averageRating: 4.21
  };

  return (
    <>
      <div className="bg-shape-1"></div>
      <div className="bg-shape-2"></div>
      <div className="bg-shape-3"></div>
      
      <Navbar />

      <div className="account-back-button-container">
        <button className="account-btn-back" onClick={() => navigate('/main')}>
          <FiArrowLeft />
          Back to Main
        </button>
      </div>

      <div className="container">
        <div className="account-container">
          <div className="account-card">
            <div className="account-header">
              <div className="avatar">
                <FiUser />
              </div>
              <h2>{user.username}</h2>
            </div>

            <div className="account-info">
              <div className="info-item">
                <FiMail className="info-icon" />
                <div>
                  <span className="info-label">Email</span>
                  <span className="info-value">{user.email}</span>
                </div>
              </div>

              <div className="info-item">
                <FiCalendar className="info-icon" />
                <div>
                  <span className="info-label">Member Since</span>
                  <span className="info-value">{user.joinDate}</span>
                </div>
              </div>

              <div className="info-item">
                <FiStar className="info-icon" />
                <div>
                  <span className="info-label">Reviews Written</span>
                  <span className="info-value">{user.reviewsCount} reviews</span>
                </div>
              </div>

              <div className="info-item">
                <FiStar className="info-icon" />
                <div>
                  <span className="info-label">Average Rating Given</span>
                  <span className="info-value">{user.averageRating} stars</span>
                </div>
              </div>
            </div>

            <button className="btn-logout" onClick={() => navigate('/')}>
              <FiLogOut />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Account;