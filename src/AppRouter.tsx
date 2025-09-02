import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { App } from './App';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider } from './components/auth/AuthProvider';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
export function AppRouter() {
  return <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/*" element={<App />} />
            </Route>
            {/* Redirect to login if no route matches */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>;
}