import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import Home from './pages/Home';
import Calm from './pages/Calm';
import Lifestyle from './pages/Lifestyle';
import Journey from './pages/Journey';
import Community from './pages/Community';
import Onboarding from './pages/Onboarding';
import BottomNav from './components/BottomNav';

const App = () => {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('talya_user_data');
    if (data) {
      setHasCompletedOnboarding(true);
    }
    
    const theme = localStorage.getItem('talya_theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('talya_theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('talya_theme', 'dark');
      setIsDarkMode(true);
    }
  };

  return (
    <Router>
      <button 
        onClick={toggleTheme} 
        className="fixed top-6 right-6 z-[200] p-2.5 rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-md shadow-sm border border-white/40 dark:border-slate-700/50 hover:scale-105 transition-all text-[#4a3f5e] dark:text-purple-200"
        aria-label="Toggle Theme"
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="w-full max-w-md mx-auto min-h-screen relative overflow-x-hidden">
        <Routes>
          <Route 
            path="/onboarding" 
            element={!hasCompletedOnboarding ? <Onboarding onComplete={() => setHasCompletedOnboarding(true)} /> : <Navigate to="/home" />} 
          />
          <Route 
            path="/home" 
            element={hasCompletedOnboarding ? <Home /> : <Navigate to="/onboarding" />} 
          />
          <Route 
            path="/calm" 
            element={hasCompletedOnboarding ? <Calm /> : <Navigate to="/onboarding" />} 
          />
          <Route 
            path="/lifestyle" 
            element={hasCompletedOnboarding ? <Lifestyle /> : <Navigate to="/onboarding" />} 
          />
          <Route 
            path="/journey" 
            element={hasCompletedOnboarding ? <Journey /> : <Navigate to="/onboarding" />} 
          />
          <Route 
            path="/community" 
            element={hasCompletedOnboarding ? <Community /> : <Navigate to="/onboarding" />} 
          />
          <Route 
            path="/" 
            element={<Navigate to={hasCompletedOnboarding ? "/home" : "/onboarding"} />} 
          />
        </Routes>
        
        {hasCompletedOnboarding && <BottomNav />}
      </div>
    </Router>
  );
};

export default App;
