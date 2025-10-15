import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import MainPage from './components/MainPage';
import Account from './components/Account';
import DetailView from './components/DetailView';
import AdminWrite from './components/AdminWrite';
import AdminEdit from './components/AdminEdit';
import AdminUsers from './components/AdminUsers';
import './styles/styles.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/account" element={<Account />} />
        <Route path="/article/:id" element={<DetailView />} />
        <Route path="/admin/write" element={<AdminWrite />} />
        <Route path="/admin/edit/:id" element={<AdminEdit />} />
        <Route path="/admin/users" element={<AdminUsers />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;