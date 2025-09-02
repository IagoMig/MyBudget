import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Navigation from './components/Navigation';
import BillsPage from './components/BillsPage';
import BillForm from './components/BillForm';
import IncomePage from './components/IncomePage';
import IncomeForm from './components/IncomeForm';
import { useAuth } from './components/auth/AuthProvider';
export function App() {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  useEffect(() => {
    // Check if we've shown the splash screen before
    const hasSeenSplash = localStorage.getItem('hasSeenSplash');
    if (hasSeenSplash) {
      setShowSplash(false);
    } else {
      // Set a flag in localStorage so we don't show the splash on subsequent visits
      localStorage.setItem('hasSeenSplash', 'true');
    }
  }, []);
  const handleSplashComplete = () => {
    setShowSplash(false);
  };
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }
  return <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add-expense" element={<ExpenseForm />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/bills" element={<BillsPage />} />
        <Route path="/add-bill" element={<BillForm />} />
        <Route path="/income" element={<IncomePage />} />
        <Route path="/add-income" element={<IncomeForm />} />
      </Routes>
      <Navigation />
    </div>;
}