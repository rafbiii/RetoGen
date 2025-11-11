import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSun, FiMoon, FiUser, FiMail, FiCalendar, FiStar, FiLogOut, FiArrowLeft } from 'react-icons/fi';

function Account() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

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
            <button className="btn btn-back" onClick={() => navigate('/main')}>
              <FiArrowLeft />
              Back
            </button>
          </div>
        </div>
      </nav>

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

      <style jsx>{`
        .account-container {
          display: flex;
          justify-content: center;
          padding: 60px 20px 80px;
        }

        .account-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          padding: 48px;
          width: 100%;
          max-width: 500px;
          border: 1px solid rgba(100, 100, 100, 0.1);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
        }

        body.dark-mode .account-card {
          background: rgba(42, 42, 42, 0.7);
          border-color: rgba(200, 200, 200, 0.1);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
        }

        .account-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(227, 66, 52, 0.1), rgba(0, 206, 209, 0.1));
          border: 3px solid rgba(100, 100, 100, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }

        body.dark-mode .avatar {
          background: linear-gradient(135deg, rgba(227, 66, 52, 0.15), rgba(0, 206, 209, 0.15));
          border-color: rgba(200, 200, 200, 0.15);
        }

        .avatar svg {
          width: 48px;
          height: 48px;
          color: #6b7280;
          stroke-width: 1.5;
        }

        body.dark-mode .avatar svg {
          color: #b8b8b8;
        }

        .account-header h2 {
          color: #2a2a2a;
          font-size: 28px;
          font-weight: 700;
        }

        body.dark-mode .account-header h2 {
          color: #f5f5f5;
        }

        .account-info {
          display: flex;
          flex-direction: column;
          gap: 24px;
          margin-bottom: 32px;
        }

        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 16px;
          background: rgba(100, 100, 100, 0.03);
          border-radius: 8px;
          border: 1px solid rgba(100, 100, 100, 0.08);
        }

        body.dark-mode .info-item {
          background: rgba(200, 200, 200, 0.03);
          border-color: rgba(200, 200, 200, 0.08);
        }

        .info-icon {
          width: 20px;
          height: 20px;
          color: #00ced1;
          stroke-width: 2;
          flex-shrink: 0;
          margin-top: 2px;
        }

        body.dark-mode .info-icon {
          color: #5dd7da;
        }

        .info-item > div {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-label {
          font-size: 13px;
          color: #6b7280;
          font-weight: 500;
        }

        body.dark-mode .info-label {
          color: #b8b8b8;
        }

        .info-value {
          font-size: 16px;
          color: #2a2a2a;
          font-weight: 600;
        }

        body.dark-mode .info-value {
          color: #f5f5f5;
        }

        .btn-logout {
          width: 100%;
          padding: 14px;
          background: transparent;
          border: 2px solid #E34234;
          border-radius: 8px;
          color: #E34234;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .btn-logout:hover {
          background: rgba(227, 66, 52, 0.08);
        }

        body.dark-mode .btn-logout {
          border-color: #ff6b5e;
          color: #ff6b5e;
        }

        body.dark-mode .btn-logout:hover {
          background: rgba(227, 66, 52, 0.1);
        }

        .btn-logout svg {
          width: 18px;
          height: 18px;
        }

        .btn-back {
          background: transparent;
          color: #6b7280;
          border: 2px solid rgba(100, 100, 100, 0.2);
          padding: 8px 16px;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .btn-back:hover {
          background: rgba(100, 100, 100, 0.08);
          color: #2a2a2a;
          border-color: rgba(100, 100, 100, 0.3);
        }

        body.dark-mode .btn-back {
          color: #b8b8b8;
          border-color: rgba(200, 200, 200, 0.2);
        }

        body.dark-mode .btn-back:hover {
          background: rgba(200, 200, 200, 0.1);
          color: #f5f5f5;
          border-color: rgba(200, 200, 200, 0.3);
        }

        @media (max-width: 768px) {
          .account-card {
            padding: 32px 24px;
          }

          .btn-back {
            padding: 8px;
          }

          .btn-back span {
            display: none;
          }
        }
      `}</style>
    </>
  );
}

export default Account;