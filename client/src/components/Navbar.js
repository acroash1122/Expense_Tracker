// src/components/Navbar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-700 text-white shadow-md p-4 flex items-center justify-between">
      <h1 className="text-xl font-bold tracking-wide">💰 Expense Tracker</h1>

      <div className="flex items-center gap-4">
        {/* Optional: Show user name/email if stored in localStorage */}
        {/* <span className="text-sm">Hi, {localStorage.getItem("email")}</span> */}

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm font-medium transition-all"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
