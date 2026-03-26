import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Moon, Sun, Settings } from 'lucide-react';
import Home from './pages/Home';
import Calm from './pages/Calm';
import Lifestyle from './pages/Lifestyle';
import Journey from './pages/Journey';
import Community from './pages/Community';
import Onboarding from './pages/Onboarding';
import BottomNav from './components/BottomNav';
import ProfileSettings from './components/ProfileSettings';

const App = () => {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 1500);

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

  if (showSplash) {
    return (
      <div className="fixed inset-0 min-h-screen bg-[#FFFBF7] dark:bg-slate-900 flex items-center justify-center z-[999] transition-colors duration-1000">
        <div className="flex flex-col items-center justify-center animate-[pulse_1.5s_ease-in-out_infinite]">
          <div className="w-24 h-24 mb-6 rounded-[2.5rem] bg-gradient-to-br from-[#D7B4F3] to-[#8B5CF6] shadow-[0_0_50px_rgba(215,180,243,0.6)] dark:shadow-[0_0_50px_rgba(139,92,246,0.4)] flex items-center justify-center text-white text-[42px] font-black italic">
            T
          </div>
          <h1 className="text-[32px] font-extrabold text-[#4a3f5e] dark:text-purple-50 tracking-wide mb-1">Talya</h1>
          <p className="text-[#8B5CF6] dark:text-[#a78bfa] font-bold tracking-widest text-[11px] uppercase">PCOS Companion</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      {hasCompletedOnboarding && (
        <button
          onClick={() => setIsProfileSettingsOpen(true)}
          className="fixed top-6 left-6 z-[210] p-2.5 rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-md shadow-sm border border-white/40 dark:border-slate-700/50 hover:scale-105 transition-all text-[#4a3f5e] dark:text-purple-200"
          aria-label="Profil Ayarları"
        >
          <Settings size={20} />
        </button>
      )}
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

      <ProfileSettings
        isOpen={isProfileSettingsOpen}
        onClose={() => setIsProfileSettingsOpen(false)}
      />
    </Router>
  );
};

export default App;
