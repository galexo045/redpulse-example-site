
import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const dropdownLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2 text-sm ${
      isActive ? 'bg-brand-red text-white' : 'text-gray-700 hover:bg-gray-100'
    }`;

  const closeMenu = () => {
    setIsOpen(false);
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-center p-1 rounded-md text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-expanded={isOpen}
              aria-haspopup="true"
            >
              <span className="sr-only">Open main menu</span>
              {currentUser ? (
                <div className="w-8 h-8 bg-white text-brand-blue rounded-full flex items-center justify-center font-bold text-lg">
                  {currentUser.name.charAt(0)}
                </div>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
            {isOpen && (
              <div
                className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                role="menu"
                aria-orientation="vertical"
              >
                <div className="py-1" role="none">
                  <NavLink to="/" className={dropdownLinkClasses} onClick={closeMenu} role="menuitem">Home</NavLink>
                  {currentUser ? (
                    <>
                      <NavLink to="/dashboard" className={dropdownLinkClasses} onClick={closeMenu} role="menuitem">Dashboard</NavLink>
                      <NavLink to="/profile" className={dropdownLinkClasses} onClick={closeMenu} role="menuitem">Profile</NavLink>
                      <NavLink to="/settings" className={dropdownLinkClasses} onClick={closeMenu} role="menuitem">Settings</NavLink>
                      <button
                        onClick={() => { logout(); closeMenu(); }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <NavLink to="/login" className={dropdownLinkClasses} onClick={closeMenu} role="menuitem">
                      Login / Register
                    </NavLink>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
