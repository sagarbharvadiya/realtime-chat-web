// App.js
import React, { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import RegistrationForm from './Component/RegistrationForm ';
import LoginForm from './Component/LoginForm';
import Dashboard from './Component/Dashboard'; // Import the Dashboard component
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Routes>
      <Route
        path="/"
        element={isLoggedIn ? <Dashboard /> : <RegistrationForm />}
      />
      <Route
        path="/login"
        element={<LoginForm setIsLoggedIn={setIsLoggedIn} />}
      />
      <Route
        path="/chat"
        element={<Navigate to="/login" />}
      />
      <Route path="/dashboard" element={<Dashboard />} /> {/* Add this line */}
    </Routes>
  );
};

export default App;
