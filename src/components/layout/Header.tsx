
import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiBell, FiLogOut, FiUser, FiMenu, FiChevronDown, FiBook, FiSettings } from 'react-icons/fi';
import { useAuthStore } from '../../store/authStore';
import { useState } from 'react';

const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-dark/80 backdrop-blur-lg border-b border-white/10 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and nav links */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <img 
                src="https://www.kombee.com/_next/static/media/logo-loader.34d8b33b.svg" 
                alt="Logo" 
                className="h-8 w-auto" 
              />
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex space-x-4">
                <Link 
                  to="/dashboard" 
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <FiHome className="mr-1" />
                  Dashboard
                </Link>
                <Link 
                  to="/courses" 
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <FiBook className="mr-1" />
                  Courses
                </Link>
                {user && (user.role === 'admin' || user.role === 'hr' || user.role === 'mentor' || user.role === 'lead') && (
                  <Link 
                    to="/admin" 
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <FiSettings className="mr-1" />
                    Admin
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* User profile and notifications */}
          <div className="hidden md:flex items-center">
            {user && (
              <>
                {/* Notification bell */}
                <button className="text-gray-300 hover:text-white p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white mr-3">
                  <FiBell className="h-6 w-6" />
                </button>
                
                {/* User dropdown */}
                <div className="relative ml-3">
                  <div>
                    <button 
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center max-w-xs text-sm bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                    >
                      <span className="sr-only">Open user menu</span>
                      {user.avatar ? (
                        <img 
                          className="h-8 w-8 rounded-full" 
                          src={user.avatar} 
                          alt={user.name} 
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="ml-2 text-white font-medium">{user.name}</span>
                      <FiChevronDown className="ml-1 text-white" />
                    </button>
                  </div>
                  
                  {/* Dropdown menu */}
                  {dropdownOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <FiUser className="mr-2" />
                          Profile
                        </div>
                      </Link>
                      <button 
                        onClick={() => {
                          logout();
                          setDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-center">
                          <FiLogOut className="mr-2" />
                          Sign out
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="text-gray-300 hover:text-white p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <FiMenu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/dashboard"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <FiHome className="mr-2" />
                Dashboard
              </div>
            </Link>
            <Link 
              to="/courses"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <FiBook className="mr-2" />
                Courses
              </div>
            </Link>
            {user && (user.role === 'admin' || user.role === 'hr' || user.role === 'mentor' || user.role === 'lead') && (
              <Link 
                to="/admin"
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <FiSettings className="mr-2" />
                  Admin
                </div>
              </Link>
            )}
          </div>
          
          {user && (
            <div className="pt-4 pb-3 border-t border-gray-700">
              <div className="flex items-center px-5">
                {user.avatar ? (
                  <img 
                    className="h-10 w-10 rounded-full" 
                    src={user.avatar} 
                    alt={user.name} 
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="ml-3">
                  <div className="text-base font-medium text-white">{user.name}</div>
                  <div className="text-sm font-medium text-gray-400">{user.email}</div>
                </div>
                <button className="ml-auto text-gray-300 hover:text-white p-1 rounded-full">
                  <FiBell className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <Link 
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <FiUser className="mr-2" />
                    Profile
                  </div>
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white"
                >
                  <div className="flex items-center">
                    <FiLogOut className="mr-2" />
                    Sign out
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
