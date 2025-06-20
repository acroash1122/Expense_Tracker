// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const isValid = userId && userId.length > 12 && token && token.length > 20;

  return isValid ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
