"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { MobileSidebar } from "./MobileSidebar/MobileSidebar";

export function TopToolbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <>
      {/* Desktop/Tablet Navigation */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Musakorneri
            </h1>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-4">
              <Link href="/" className="nav-link">
                Home
              </Link>
              <Link href="/album-charts" className="nav-link">
                Album Charts
              </Link>
              {isLoggedIn && (
                <Link href="/review-album" className="nav-link">
                  Review album
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* Desktop Auth */}
            <div className="hidden md:block">
              {isLoggedIn ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="nav-link flex items-center"
                  >
                    Account ▼
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-50">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <a href="/login" className="nav-link">
                  Login
                </a>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-gray-900 dark:text-white"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <MobileSidebar
          setSidebarOpen={setSidebarOpen}
          isLoggedIn={isLoggedIn}
          handleLogout={handleLogout}
        ></MobileSidebar>
      )}
    </>
  );
}
