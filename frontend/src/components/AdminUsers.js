import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSun, FiMoon, FiUser, FiSearch, FiFilter, FiTrash2 } from 'react-icons/fi';

function AdminUsers() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([
    { id: 1, username: 'JohnDoe', email: 'john@example.com', joinDate: 'Jan 2024', reviews: 12 },
    { id: 2, username: 'Alice', email: 'alice@example.com', joinDate: 'Feb 2024', reviews: 8 },
    { id: 3, username: 'Bob', email: 'bob@example.com', joinDate: 'Mar 2024', reviews: 5 },
    { id: 4, username: 'Charlie', email: 'charlie@example.com', joinDate: 'Mar 2024', reviews: 15 },
    { id: 5, username: 'Diana', email: 'diana@example.com', joinDate: 'Apr 2024', reviews: 3 }
  ]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setUsers(users.filter(u => u.id !== selectedUser.id));
    setShowDeleteModal(false);
    setSelectedUser(null);
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
        <div className="users-header">
          <div className="header-accent"></div>
          <h1>Manage Users</h1>
          <p>View and manage all registered users</p>
        </div>

        <div className="filters-bar">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="sort-box">
            <FiFilter className="filter-icon" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="most-reviews">Most Reviews</option>
              <option value="least-reviews">Least Reviews</option>
            </select>
          </div>
        </div>

        <div className="users-list">
          {users.map((user) => (
            <div key={user.id} className="user-card">
              <div className="user-avatar">
                <FiUser />
              </div>
              <div className="user-info">
                <h3>{user.username}</h3>
                <p className="user-email">{user.email}</p>
                <div className="user-stats">
                  <span>Joined: {user.joinDate}</span>
                  <span>•</span>
                  <span>{user.reviews} reviews</span>
                </div>
              </div>
              <button 
                className="btn-delete-user" 
                onClick={() => openDeleteModal(user)}
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        {showDeleteModal && (
          <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Delete User Account?</h3>
              <p>Are you sure you want to delete <strong>{selectedUser?.username}</strong>? This will permanently remove their account and all associated data.</p>
              <div className="modal-buttons">
                <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <button className="btn-confirm-delete" onClick={confirmDelete}>
                  <FiTrash2 />
                  Delete User
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .users-header {
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

        .users-header h1 {
          color: #2a2a2a;
          font-size: 42px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        body.dark-mode .users-header h1 {
          color: #f5f5f5;
        }

        .users-header p {
          color: #6b7280;
          font-size: 16px;
        }

        body.dark-mode .users-header p {
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

        .filters-bar {
          max-width: 900px;
          margin: 0 auto 32px;
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

        .users-list {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 20px 80px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .user-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(100, 100, 100, 0.1);
          border-radius: 12px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          transition: all 0.3s ease;
        }

        body.dark-mode .user-card {
          background: rgba(42, 42, 42, 0.7);
          border-color: rgba(200, 200, 200, 0.1);
        }

        .user-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          background: rgba(255, 255, 255, 0.9);
        }

        body.dark-mode .user-card:hover {
          background: rgba(42, 42, 42, 0.9);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }

        .user-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(227, 66, 52, 0.1), rgba(0, 206, 209, 0.1));
          border: 2px solid rgba(100, 100, 100, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        body.dark-mode .user-avatar {
          background: linear-gradient(135deg, rgba(227, 66, 52, 0.15), rgba(0, 206, 209, 0.15));
          border-color: rgba(200, 200, 200, 0.15);
        }

        .user-avatar svg {
          width: 28px;
          height: 28px;
          color: #6b7280;
        }

        body.dark-mode .user-avatar svg {
          color: #b8b8b8;
        }

        .user-info {
          flex: 1;
        }

        .user-info h3 {
          color: #2a2a2a;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        body.dark-mode .user-info h3 {
          color: #f5f5f5;
        }

        .user-email {
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 8px;
        }

        body.dark-mode .user-email {
          color: #b8b8b8;
        }

        .user-stats {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #6b7280;
          font-size: 13px;
        }

        body.dark-mode .user-stats {
          color: #b8b8b8;
        }

        .btn-delete-user {
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
          flex-shrink: 0;
        }

        .btn-delete-user:hover {
          background: rgba(227, 66, 52, 0.1);
        }

        body.dark-mode .btn-delete-user {
          color: #ff6b5e;
          border-color: #ff6b5e;
        }

        body.dark-mode .btn-delete-user:hover {
          background: rgba(227, 66, 52, 0.15);
        }

        .btn-delete-user svg {
          width: 16px;
          height: 16px;
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
          line-height: 1.6;
          margin-bottom: 24px;
        }

        body.dark-mode .modal-content p {
          color: #b8b8b8;
        }

        .modal-content strong {
          color: #E34234;
          font-weight: 700;
        }

        body.dark-mode .modal-content strong {
          color: #ff6b5e;
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
          .users-header h1 {
            font-size: 32px;
          }

          .filters-bar {
            flex-direction: column;
          }

          .user-card {
            flex-direction: column;
            text-align: center;
          }

          .user-info {
            text-align: center;
          }

          .user-stats {
            justify-content: center;
          }

          .btn-delete-user {
            width: 100%;
            justify-content: center;
          }

          .btn-account span {
            display: none;
          }
        }
      `}</style>
    </>
  );
}

export default AdminUsers;