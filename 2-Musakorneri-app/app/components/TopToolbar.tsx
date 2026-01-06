"use client";

import { useState, useEffect } from "react";

export function TopToolbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-8">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Musakorneri
          </h1>
          <nav className="flex space-x-4">
            <a href="/" className="nav-link">
              Home
            </a>
          </nav>
        </div>
        {isLoggedIn ? (
          <button onClick={handleLogout} className="nav-link">
            Logout
          </button>
        ) : (
          <a href="/login" className="nav-link">
            Login
          </a>
        )}
      </div>
    </div>
  );
}