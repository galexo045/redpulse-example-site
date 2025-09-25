
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import NewRequestPage from './pages/NewRequestPage';
import RequestDetailsPage from './pages/RequestDetailsPage';
import ChatPage from './pages/ChatPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <div className="min-h-screen bg-gray-50 text-brand-dark">
          <Header />
          <main className="container mx-auto p-4 md:p-6">
            <AppRoutes />
          </main>
        </div>
      </HashRouter>
    </AuthProvider>
  );
};

const AppRoutes: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={currentUser ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/dashboard" element={currentUser ? <DashboardPage /> : <Navigate to="/login" />} />
      <Route path="/profile" element={currentUser ? <ProfilePage /> : <Navigate to="/login" />} />
      <Route path="/request/new" element={currentUser ? <NewRequestPage /> : <Navigate to="/login" />} />
      <Route path="/request/:id" element={<RequestDetailsPage />} />
      <Route path="/chat/:userId" element={currentUser ? <ChatPage /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
