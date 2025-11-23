import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/landingPage';
import Auth from './components/auth';
import MainPage from './components/mainPage';
import Account from './components/account';
import DetailView from './components/detailView';
import AdminWrite from './components/adminAddArticle';
import AdminEdit from './components/adminEditArticle';
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;