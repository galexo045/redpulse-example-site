
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive ? 'bg-brand-red text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  return (
    <header className="bg-brand-blue shadow-md">
      <nav className="container mx-auto px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-red" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span className="text-2xl font-bold text-white">RedPulse</span>
          </Link>
          <div className="flex items-center space-x-4">
            <NavLink to="/" className={navLinkClasses}>Home</NavLink>
            {currentUser && <NavLink to="/dashboard" className={navLinkClasses}>Dashboard</NavLink>}
            {currentUser && <NavLink to="/profile" className={navLinkClasses}>Profile</NavLink>}
            {currentUser ? (
              <button
                onClick={logout}
                className="bg-brand-red text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition"
              >
                Logout
              </button>
            ) : (
              <NavLink
                to="/login"
                className="bg-white text-brand-blue px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition"
              >
                Login / Register
              </NavLink>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
