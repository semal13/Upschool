import React from 'react';
import { Home, Heart, Coffee, BarChart2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/calm', icon: Heart, label: 'Calm' },
    { path: '/lifestyle', icon: Coffee, label: 'Lifestyle' },
    { path: '/journey', icon: BarChart2, label: 'Journey' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[340px] z-50 px-2 transition-all">
      <div className="glass-nav flex justify-between items-center px-4 py-3 shadow-[0_10px_40px_-10px_rgba(131,115,155,0.2)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.4)]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (location.pathname === '/' && item.path === '/home') || (location.pathname === '/home' && item.path === '/');
          const Icon = item.icon;
          
          return (
            <button
               key={item.path}
               onClick={() => navigate(item.path)}
               className="flex flex-col items-center justify-center p-2 rounded-2xl relative"
            >
              {isActive ? (
                <div className="flex flex-col items-center">
                  <div className="bg-[#EAE2F3] dark:bg-slate-800 px-4 py-1.5 rounded-full mb-1 border border-white/50 dark:border-white/10 shadow-inner transition-colors duration-500">
                    <Icon size={20} strokeWidth={2.5} className="text-[#9B7EC9] dark:text-[#a78bfa] transition-colors duration-500" />
                  </div>
                  <span className="text-[10px] font-bold text-[#9B7EC9] dark:text-[#a78bfa] tracking-wide transition-colors duration-500">{item.label}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center opacity-40 hover:opacity-70 dark:opacity-60 dark:hover:opacity-100 transition-opacity">
                  <div className="py-1.5 mb-1">
                    <Icon size={20} strokeWidth={2.5} className="text-[#4a3f5e] dark:text-purple-100 transition-colors duration-500" />
                  </div>
                  <span className="text-[10px] font-bold text-[#4a3f5e] dark:text-purple-100 tracking-wide transition-colors duration-500">{item.label}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
