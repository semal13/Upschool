import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Loader2, Dumbbell, ChefHat, Clock, Flame, RefreshCcw, Sparkles, Heart } from 'lucide-react';
import { fetchLifestylePlan } from '../services/groqService';

const GlassModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-talya-purple/20 dark:bg-slate-900/60 backdrop-blur-xl fade-in transition-colors duration-500" onClick={onClose}>
      <div 
        className="w-full max-w-sm p-8 relative shadow-[0_20px_60px_-15px_rgba(191,168,226,0.5)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] rounded-[2.5rem] bg-gradient-to-br from-white/95 to-white/70 dark:from-indigo-950/90 dark:to-indigo-900/80 backdrop-blur-2xl border border-white dark:border-white/10 transition-colors duration-500 max-h-[85vh] overflow-y-auto" 
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-5 right-5 text-[#4a3f5e]/40 dark:text-purple-200/40 hover:text-[#9B7EC9] dark:hover:text-purple-300 transition-colors bg-white/80 dark:bg-slate-800/80 rounded-full p-2 shadow-sm">
          <X size={20} strokeWidth={2.5} />
        </button>
        {children}
      </div>
    </div>
  );
};

const Lifestyle = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('recipes'); 
  const [activeFilter, setActiveFilter] = useState('Tümü');
  const [activeItem, setActiveItem] = useState(null); 
  const [plan, setPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dailyPlan, setDailyPlan] = useState(null);

  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem('talya_favorites') || '[]');
      return Array.isArray(raw) ? raw : [];
    } catch {
      return [];
    }
  });
  
  // Feedback System for ML Loop
  const [feedbacks, setFeedbacks] = useState(() => JSON.parse(localStorage.getItem('talya_feedbacks') || '[]'));
  
  const [progressScore, setProgressScore] = useState(() => Number(localStorage.getItem('talya_progress_score') || 0));
  const [showProgressToast, setShowProgressToast] = useState(false);

  // Educational Tips Setup:
  const TIPS = [
    "Tarçın tüketimi insülin duyarlılığını artırabilir.",
    "PCOS'ta magnezyum desteği uyku kalitesini ve stresi yönetmeye yardımcı olur.",
    "D vitamini eksikliği PCOS semptomlarını tetikleyebilir; güneş ışığı önemlidir.",
    "Düzenli açık hava yürüyüşleri kortizolü düşürerek hormonal dengene katkı sağlar."
  ];
  const [dailyTip, setDailyTip] = useState("");

  // YouTube Dynamic Mapper
  const getWorkoutVideoId = (item) => {
    const t = (item.type || '').toLowerCase();
    const title = (item.title || '').toLowerCase();

    // Akıllı Başlık Eşleştirmesi
    if (title.includes('yoga') || t.includes('yoga')) return 'y29TOurlWrY'; // PCOS Yoga
    if (title.includes('squat') || title.includes('güç') || title.includes('direnç') || title.includes('ağırlık') || t.includes('güç')) return 'YukpAFgNJM8'; // PCOS Strength
    if (title.includes('yürüyüş') || title.includes('adımla') || t.includes('düşük efor')) return 'vnJH2Ba0CM0'; // Walking/Low Impact
    if (title.includes('kardiyo') || title.includes('terle') || title.includes('cardio') || t.includes('kardiyo')) return 'r4G8znWFMTE'; // PCOS HIIT
    if (title.includes('pilates') || t.includes('pilates')) return 'K-PpDCDEEWA'; // Pilates fallback
    
    // Varsayılan PCOS Dostu Videolar (Low Impact / Beginner) - (Aynı ID'nin sürekli çıkmaması için Deterministik Hash Algoritması)
    const hash = (title.length + (item.id || 1)) % 3;
    const defaults = ['8-R-b7c4J2g', 'gC_L9qAHVJ8', '19mI4N5Cqxs'];
    return defaults[hash];
  };

  // Dinamik Bağlam Etiketleri (Yurt, Zaman, Bütçe Modları)
  const getDynamicContextTags = (item, isRecipe) => {
    if (!isRecipe) return [];
    const tags = [];
    const lc = JSON.parse(localStorage.getItem('talya_life_conditions') || '{"kitchenType":"full","budgetType":"standard"}');
    
    if (lc.kitchenType === 'none' || lc.kitchenType === 'kettle') {
      tags.push({ label: 'Pişirme Gerektirmez', icon: '❄️', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' });
    }
    if (lc.budgetType === 'student') {
      tags.push({ label: 'Öğrenci Dostu', icon: '🎓', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' });
    }
    const timeStr = item.time || '';
    const timeVal = parseInt(timeStr.replace(/\D/g, ''));
    if (timeVal && timeVal <= 10) {
      tags.push({ label: '10 Dakika Hızlı', icon: '⚡', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' });
    }
    return tags;
  };

  const getFavoriteKey = (item, isRecipe) => `${isRecipe ? 'recipe' : 'workout'}:${item.id}:${item.title}`;

  const toggleFavorite = (item, isRecipe) => {
    const favKey = getFavoriteKey(item, isRecipe);
    setFavorites(prev => {
      const exists = prev.some(f => f.favKey === favKey);
      const newFavs = exists
        ? prev.filter(f => f.favKey !== favKey)
        : [...prev, { ...item, isRecipe, favKey }];
      localStorage.setItem('talya_favorites', JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const handleFeedback = (item) => {
    if (feedbacks.includes(item.title)) return;
    const newFbs = [...feedbacks, item.title];
    setFeedbacks(newFbs);
    localStorage.setItem('talya_feedbacks', JSON.stringify(newFbs));

    let newScore = progressScore + 20;
    if (newScore >= 100) {
      newScore = 0;
      setShowProgressToast(true);
      setTimeout(() => setShowProgressToast(false), 3500);
    }
    setProgressScore(newScore);
    localStorage.setItem('talya_progress_score', String(newScore));
  };

  // Zeki bağlam kontrolü: Kullanıcı durumu anlık değişebilir (Örn: Yurda döndü)
  const [currentBudget, setCurrentBudget] = useState(() => {
    const data = JSON.parse(localStorage.getItem('talya:user-profile') || '{}');
    return data.budget || 'Orta Halli';
  });

  const fetchNewPlan = async (overrideProfile = null) => {
    setIsLoading(true);
    setPlan(null); // Şık iskelet ekranı devreye girsin diye temizle

    try {
      const data = JSON.parse(localStorage.getItem('talya:user-profile') || '{}');
      if (typeof overrideProfile === 'string') {
        // Backward compatibility: only budget override.
        if (overrideProfile !== data.budget) {
          data.budget = overrideProfile;
          localStorage.setItem('talya:user-profile', JSON.stringify(data));
        }
      } else if (overrideProfile && typeof overrideProfile === 'object') {
        Object.assign(data, overrideProfile);
        localStorage.setItem('talya:user-profile', JSON.stringify(data));
      }
      setCurrentBudget(data.budget || 'Orta Halli');
      
      const fetchedPlan = await fetchLifestylePlan(data);
      setPlan(fetchedPlan);
    } catch (e) {
      console.error(e);
      setPlan(await fetchLifestylePlan(JSON.parse(localStorage.getItem('talya:user-profile') || '{}')));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNewPlan();
    
    const savedPlan = localStorage.getItem('talya_daily_plan');
    if (savedPlan) {
      try {
        setDailyPlan(JSON.parse(savedPlan));
      } catch (e) {
        console.error(e);
      }
    }
    
    setDailyTip(TIPS[Math.floor(Math.random() * TIPS.length)]);
  
    const handler = () => {
      const latest = JSON.parse(localStorage.getItem('talya:user-profile') || '{}');
      fetchNewPlan(latest);
    };
    window.addEventListener('profileUpdated', handler);
    return () => window.removeEventListener('profileUpdated', handler);
  }, []);

  const handleBudgetChange = (newBudget) => {
    if (newBudget === currentBudget) return;
    setCurrentBudget(newBudget);
    fetchNewPlan(newBudget); // Anında yeni bütçe ile taze menü çek!
  };

  const filters = ['Tümü', 'Favorilerim', 'Glütensiz', 'Yüksek Protein', 'Düşük Karb', 'Düşük Efor', 'Güç', 'Yoga'];
  const visibleFilters = activeTab === 'recipes' 
    ? ['Tümü', 'Favorilerim', 'Glütensiz', 'Yüksek Protein', 'Düşük Karb']
    : ['Tümü', 'Favorilerim', 'Düşük Efor', 'Güç', 'Yoga'];

  useEffect(() => {
    if (!visibleFilters.includes(activeFilter)) {
      setActiveFilter('Tümü');
    }
  }, [activeTab]);

  const displayedItems = plan ? (
    activeFilter === 'Favorilerim'
      ? favorites.filter(f => f.isRecipe === (activeTab === 'recipes'))
      : activeTab === 'recipes' 
        ? plan.recipes.filter(r => activeFilter === 'Tümü' || r.type === activeFilter)
        : plan.workouts.filter(w => activeFilter === 'Tümü' || w.type === activeFilter)
  ) : [];

  return (
    <div className="p-6 pt-12 min-h-screen pb-40 fade-in relative transition-colors duration-500">
      
      {/* GAMIFICATION OVERLAY TOAST */}
      {showProgressToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-sm bg-gradient-to-r from-pink-400 to-[#8B5CF6] text-white p-4 rounded-3xl shadow-xl fade-in flex items-center justify-center gap-3">
          <span className="text-3xl">🎉</span>
          <p className="font-bold text-[14px]">Harika bir hafta geçirdin, Talya seninle gurur duyuyor!</p>
        </div>
      )}

      {/* Progress Bar UI */}
      <div className="w-full bg-white/40 dark:bg-slate-800/40 rounded-full h-1.5 mb-6 border border-white/50 dark:border-white/5 overflow-hidden shadow-inner flex shrink-0">
        <div 
          className="bg-gradient-to-r from-[#D7B4F3] to-[#8B5CF6] h-full rounded-full transition-all duration-1000 ease-out" 
          style={{ width: `${progressScore}%` }}
        ></div>
      </div>

      <header className="mb-8 text-center relative">
        <h1 className="text-[28px] font-bold text-[#4a3f5e] dark:text-purple-50 mb-1 transition-colors duration-500">Lifestyle Coach</h1>
        <p className="text-[#4a3f5e]/60 dark:text-purple-200/70 font-medium text-[14px] transition-colors duration-500">PCOS dostu tarifler ve egzersizler</p>
        
        {/* Dynamic Budget Segmented Control */}
        <div className="mt-4 mb-2 flex justify-center">
          <div className="bg-[#EAE2F3] dark:bg-slate-800 p-1.5 rounded-full flex gap-1 border border-white/50 dark:border-white/5 shadow-inner">
            <button 
              onClick={() => handleBudgetChange('Kısıtlı Bütçe')} 
              className={`px-4 py-2 rounded-full text-[12px] font-bold transition-all duration-300 ${currentBudget.includes('Kısıtlı') ? 'bg-[#FF6B6B] text-white shadow-[#FF6B6B]/30 shadow-md scale-[1.02]' : 'text-[#4a3f5e]/70 dark:text-purple-200/70 hover:bg-white/50 dark:hover:bg-slate-700/50'}`}
            >
              Kısıtlı
            </button>
            <button 
              onClick={() => handleBudgetChange('Orta Halli')} 
              className={`px-4 py-2 rounded-full text-[12px] font-bold transition-all duration-300 ${currentBudget.includes('Orta') ? 'bg-[#D7B4F3] text-white shadow-purple-glow scale-[1.02]' : 'text-[#4a3f5e]/70 dark:text-purple-200/70 hover:bg-white/50 dark:hover:bg-slate-700/50'}`}
            >
              Orta
            </button>
            <button 
              onClick={() => handleBudgetChange('Esnek / İyi')} 
              className={`px-4 py-2 rounded-full text-[12px] font-bold transition-all duration-300 ${currentBudget.includes('Esnek') ? 'bg-[#3b82f6] text-white shadow-[#3b82f6]/30 shadow-md scale-[1.02]' : 'text-[#4a3f5e]/70 dark:text-purple-200/70 hover:bg-white/50 dark:hover:bg-slate-700/50'}`}
            >
              Esnek
            </button>
          </div>
        </div>
        <p className="text-[#4a3f5e]/50 dark:text-purple-200/50 text-[11px] font-medium italic mt-1 bg-white/30 dark:bg-slate-800/30 inline-block px-3 py-1 rounded-full">
          Bütçe ayarını seç, tarifler senin için anında yenilensin.
        </p>

        {/* Refresh Generator Button */}
        <button 
          onClick={() => fetchNewPlan(currentBudget)} 
          disabled={isLoading} 
          className="absolute -right-2 -top-2 p-3 bg-white/60 dark:bg-slate-800/60 rounded-full shadow-sm text-[#8B5CF6] dark:text-[#a78bfa] hover:rotate-180 hover:bg-white dark:hover:bg-slate-700 active:scale-95 transition-all duration-500"
        >
           <RefreshCcw size={20} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </header>

      {/* Dynamic Tab Switcher */}
      <div className="flex bg-[#EAE2F3]/50 dark:bg-slate-800/50 p-1.5 rounded-full mb-6 relative shadow-inner border border-white/50 dark:border-white/5">
        <button 
          onClick={() => setActiveTab('recipes')} 
          className={`flex-1 py-3 text-[15px] font-bold rounded-full z-10 transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'recipes' ? 'bg-[#D7B4F3] dark:bg-[#a78bfa] text-white shadow-purple-glow' : 'text-[#4a3f5e]/70 dark:text-purple-200/70'}`}
        >
          <ChefHat size={18} /> Tarifler
        </button>
        <button 
          onClick={() => setActiveTab('workouts')} 
          className={`flex-1 py-3 text-[15px] font-bold rounded-full z-10 transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'workouts' ? 'bg-[#A38EE1] dark:bg-[#8B5CF6] text-white shadow-purple-glow' : 'text-[#4a3f5e]/70 dark:text-purple-200/70'}`}
        >
          <Dumbbell size={18} /> Egzersizler
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 mb-6 px-1">
        {visibleFilters.map(filter => (
          <button 
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-[13px] font-bold transition-all ${activeFilter === filter ? 'bg-[#8B5CF6] text-white shadow-md' : 'bg-white/60 dark:bg-slate-800/60 text-[#4a3f5e]/70 dark:text-purple-200/70 border border-white/50 dark:border-white/10'}`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* AI Daily Plan Section (YENİ) */}
      {activeFilter !== 'Favorilerim' && (
      <div className="mb-6 fade-in">
         <h2 className="text-[17px] font-bold text-[#4a3f5e] dark:text-purple-50 mb-3 px-1 flex items-center gap-2">
            <Sparkles size={16} className="text-[#8B5CF6]" /> Sana Özel Günlük Öneriler
         </h2>
         
         {dailyPlan && ((activeTab === 'recipes' && dailyPlan.recipe) || (activeTab === 'workouts' && dailyPlan.workout)) ? (
           <div 
             onClick={() => setActiveItem({ 
               ...(activeTab === 'recipes' ? dailyPlan.recipe : dailyPlan.workout), 
               isRecipe: activeTab === 'recipes',
               time: "10 dk", // Placeholder UI padding
               cal: "250 kcal",
               intensity: "Hafif"
             })}
             className="glass-card p-5 border-2 border-[#8B5CF6]/40 dark:border-[#a78bfa]/30 relative overflow-hidden group cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.15)] hover:scale-[1.02] transition-all duration-500"
           >
             <div className="absolute right-0 top-0 bg-[#8B5CF6] text-white text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-[1rem] shadow-sm z-10 flex items-center gap-1">
               <Sparkles size={10} /> AI Powered
             </div>
             <div className="flex items-center gap-4 relative z-10">
                <div className="bg-gradient-to-br from-[#D7B4F3] to-[#8B5CF6] dark:from-[#a78bfa] dark:to-[#6366f1] w-[60px] h-[60px] rounded-[1.2rem] flex items-center justify-center text-white shadow-md flex-shrink-0 transition-transform group-hover:rotate-6">
                   {activeTab === 'recipes' ? <ChefHat size={28} /> : <Dumbbell size={28} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[16px] text-[#4a3f5e] dark:text-slate-100 truncate pr-2">
                     {activeTab === 'recipes' ? dailyPlan.recipe.title : dailyPlan.workout.title}
                  </h3>
                  <p className="text-[12px] text-[#4a3f5e]/80 dark:text-purple-100/90 font-medium leading-relaxed line-clamp-2 mt-0.5">
                     {activeTab === 'recipes' ? dailyPlan.recipe.desc : dailyPlan.workout.desc}
                  </p>
                </div>
             </div>
           </div>
         ) : (
           <div 
             onClick={() => navigate('/journey')}
             className="glass-card p-5 border border-white/50 dark:border-white/10 text-center cursor-pointer hover:bg-white/40 dark:hover:bg-slate-800/60 transition-colors group"
           >
             <p className="text-[13px] font-medium text-[#4a3f5e]/70 dark:text-purple-200/70 italic mb-2">Semptomlarını Journey sayfasından gir, sana özel analizini burada görelim!</p>
             <span className="text-[#8B5CF6] font-bold text-[12px] uppercase flex items-center justify-center gap-1 group-hover:scale-105 transition-transform"><Sparkles size={12}/> Analiz Al</span>
           </div>
         )}
      </div>
      )}

      {/* Standart Liste (Favoriler Boşsa Yardım) */}
      {activeFilter === 'Favorilerim' && displayedItems.length === 0 ? (
         <div className="flex flex-col items-center justify-center p-10 text-center opacity-70">
           <Heart size={48} className="text-pink-300 dark:text-pink-900/50 mb-3" />
           <p className="text-[14px] font-medium text-[#4a3f5e] dark:text-purple-200">Henüz hiç {activeTab === 'recipes' ? 'tarif' : 'egzersiz'} favorilemedin.</p>
         </div>
      ) : isLoading || !plan ? (
        <div className="space-y-4">
          {/* Skeleton Loaders matching the List Layout */}
          <div className="flex justify-center mb-4">
             <div className="flex items-center gap-3 text-[#9B7EC9] dark:text-purple-300 font-bold bg-white/40 dark:bg-slate-800/50 py-3 px-6 rounded-full shadow-sm animate-pulse border border-white dark:border-white/5">
                <Loader2 size={18} className="animate-spin" /> Yükleniyor...
             </div>
          </div>
          {[1,2,3,4].map(idx => (
             <div key={idx} className="glass-card p-5 flex items-center gap-4 animate-pulse">
                <div className="w-[60px] h-[60px] bg-purple-200 dark:bg-slate-700 rounded-[1.2rem] flex-shrink-0"></div>
                <div className="flex-1 space-y-3">
                   <div className="h-4 w-3/4 bg-purple-200/70 dark:bg-slate-700 rounded-full"></div>
                   <div className="h-3 w-1/2 bg-purple-200/40 dark:bg-slate-700/60 rounded-full"></div>
                </div>
             </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4 fade-in">
          {displayedItems.map(item => (
            <div 
              key={item.id} 
              onClick={() => setActiveItem({ ...item, isRecipe: activeTab === 'recipes' })}
              className="glass-card p-5 flex items-center gap-4 cursor-pointer hover:scale-[1.02] active:scale-95 transition-all"
            >
              {activeTab === 'recipes' ? (
                <div className="bg-[#FFE2E2] dark:bg-[#4a2e2e] w-[60px] h-[60px] rounded-[1.2rem] flex items-center justify-center text-[#FF6B6B] dark:text-rose-400 shadow-sm border border-white dark:border-white/5 flex-shrink-0 transition-colors duration-500">
                   <ChefHat size={28} />
                </div>
              ) : (
                <div className="bg-[#EAE2F3] dark:bg-[#34264f] w-[60px] h-[60px] rounded-[1.2rem] flex items-center justify-center text-[#9B7EC9] dark:text-[#a78bfa] shadow-sm border border-white dark:border-white/5 flex-shrink-0 transition-colors duration-500">
                   <Dumbbell size={28} />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[16px] text-[#4a3f5e] dark:text-slate-100 truncate pr-2 transition-colors duration-500">{item.title}</h3>
                
                {activeTab === 'recipes' && getDynamicContextTags(item, true).length > 0 && (
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {getDynamicContextTags(item, true).map((t, idx) => (
                      <span key={idx} className={`text-[10px] font-bold px-2 py-0.5 rounded-[0.4rem] flex items-center gap-1 border border-white/50 dark:border-white/5 shadow-sm ${t.color}`}>
                        {t.icon} {t.label}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-3 mt-2 text-[13px] text-[#4a3f5e]/60 dark:text-purple-200/70 font-semibold transition-colors duration-500">
                  <span className="flex items-center gap-1.5"><Clock size={14}/> {item.time}</span>
                  {activeTab === 'recipes' ? (
                    <span className="flex items-center gap-1.5"><Flame size={14}/> {item.cal}</span>
                  ) : (
                    <span className={`px-2 py-0.5 rounded-full text-[11px] ${item.intensity === 'Hafif' ? 'bg-[#E2F0CB] text-[#2e4027] dark:bg-[#1f2b1a] dark:text-[#E2F0CB]' : 'bg-[#FFE2E2] text-[#422626] dark:bg-[#422626] dark:text-[#FFE2E2]'}`}>{item.intensity}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Educational Content Engine */}
      <div className="mt-8 mb-6 glass-card p-5 border border-[#D7B4F3]/30 dark:border-[#a78bfa]/20 relative overflow-hidden group shadow-sm transition-all hover:scale-[1.01]">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#D7B4F3] to-[#8B5CF6] rounded-l-full"></div>
        <div className="flex items-center gap-3 pl-3 fade-in">
          <div className="bg-[#EAE2F3] dark:bg-slate-800 p-2.5 rounded-full text-[#9B7EC9] dark:text-[#a78bfa] shadow-inner shrink-0 group-hover:rotate-12 transition-transform duration-500">
            <Sparkles size={18} />
          </div>
          <div>
            <h4 className="text-[11px] font-bold text-[#8B5CF6] dark:text-[#a78bfa] uppercase tracking-wider mb-0.5">Senin İçin Bir Bilgi</h4>
            <p className="text-[13px] text-[#4a3f5e]/80 dark:text-purple-100 font-medium leading-relaxed">{dailyTip}</p>
          </div>
        </div>
      </div>

      {/* Universal Detail Modal */}
      <GlassModal isOpen={!!activeItem} onClose={() => setActiveItem(null)}>
        {activeItem && (
          <>
            <div className="flex justify-between items-start mb-4 pr-6 relative">
              <h2 className="text-2xl font-bold text-[#4a3f5e] dark:text-purple-50 leading-tight transition-colors duration-500 flex-1 pr-2">
                {activeItem.title} {activeItem.isRecipe ? '🥗' : '💪'}
              </h2>
              
              <button 
                onClick={(e) => { e.stopPropagation(); toggleFavorite(activeItem, activeItem.isRecipe); }}
                className="p-2.5 text-pink-500 hover:scale-110 active:scale-95 transition-all bg-pink-50 dark:bg-pink-900/30 rounded-full shadow-sm flex-shrink-0 border border-pink-100 dark:border-pink-800/50"
              >
                 <Heart size={20} fill={favorites.some(f => f.favKey === getFavoriteKey(activeItem, activeItem.isRecipe)) ? "currentColor" : "none"} />
              </button>
            </div>

            {getDynamicContextTags(activeItem, activeItem.isRecipe).length > 0 && (
              <div className="flex gap-2 flex-wrap mb-5">
                {getDynamicContextTags(activeItem, activeItem.isRecipe).map((t, idx) => (
                  <span key={idx} className={`text-[11.5px] font-bold px-3 py-1 rounded-[0.5rem] flex items-center gap-1.5 shadow-sm border border-white/50 dark:border-white/5 ${t.color}`}>
                    {t.icon} {t.label}
                  </span>
                ))}
              </div>
            )}
            
            <div className="space-y-6">
              {activeItem.isRecipe ? (
                <>
                  <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-[1.5rem] shadow-sm border border-white/60 dark:border-white/10 transition-colors duration-500">
                    <h4 className="font-bold text-[#4a3f5e] dark:text-purple-100 mb-3 text-[15px]">🛒 Malzemeler</h4>
                    <ul className="list-disc pl-5 text-[14px] text-[#4a3f5e]/80 dark:text-purple-100/80 space-y-1.5 font-medium">
                      {activeItem.ingredients?.map((ing, i) => <li key={i}>{ing}</li>)}
                    </ul>
                  </div>
                  <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-[1.5rem] shadow-sm border border-white/60 dark:border-white/10 transition-colors duration-500">
                    <h4 className="font-bold text-[#4a3f5e] dark:text-purple-100 mb-3 text-[15px]">👩‍🍳 Hazırlanış</h4>
                    <ol className="list-decimal pl-5 text-[14px] text-[#4a3f5e]/80 dark:text-purple-100/80 space-y-2 font-medium leading-relaxed">
                      {activeItem.steps?.map((step, i) => <li key={i}>{step}</li>)}
                    </ol>
                  </div>
                </>
              ) : (
                <>
                  {/* Dynamic YouTube Embed Module */}
                  <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-[1.5rem] shadow-sm border border-white/60 dark:border-white/10 transition-colors duration-500">
                    <div className="w-full aspect-video rounded-[1rem] overflow-hidden shadow-inner mb-3 bg-slate-200 dark:bg-slate-900 border border-white/50 dark:border-white/5">
                      <iframe 
                        width="100%" 
                        height="100%" 
                        src={`https://www.youtube.com/embed/${getWorkoutVideoId(activeItem)}?autoplay=0&rel=0`} 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                    </div>
                    <p className="text-center text-[12.5px] font-bold text-[#8B5CF6] dark:text-[#a78bfa] italic drop-shadow-sm px-2 mb-3">
                       "Bu egzersiz bugün hormonlarını dengelemene yardımcı olacak 🌸"
                    </p>
                    
                    {/* YouTube Arama (Fallback Integration) */}
                    <a 
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent("PCOS " + activeItem.title)}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 font-bold py-2.5 rounded-full text-[13px] hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors border border-red-100 dark:border-red-900/50 shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg> 
                      YouTube'da "{activeItem.title}" Ara
                    </a>
                  </div>

                  <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-[1.5rem] shadow-sm border border-white/60 dark:border-white/10 transition-colors duration-500">
                    <h4 className="font-bold text-[#4a3f5e] dark:text-purple-100 mb-3 text-[15px]">🧘‍♀️ Hareketler</h4>
                    <div className="space-y-3">
                      {activeItem.movements?.map((move, i) => (
                        <div key={i} className="bg-white/60 dark:bg-slate-700/60 px-4 py-3 rounded-[1rem] shadow-sm transition-colors duration-500">
                          <h5 className="font-bold text-[14px] text-[#4a3f5e] dark:text-purple-50">{move.name}</h5>
                          <p className="text-[12px] text-[#4a3f5e]/70 dark:text-purple-100/70 mt-1 font-medium leading-relaxed">{move.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-[#f8f5fb] dark:bg-slate-800/80 p-4 rounded-[1.5rem] border border-[#8B5CF6]/20 transition-colors duration-500">
                    <h4 className="font-bold text-[#8B5CF6] dark:text-[#a78bfa] text-[12px] uppercase tracking-wider mb-2">✨ Ekipman</h4>
                    <p className="text-[13px] text-[#4a3f5e]/80 dark:text-purple-100/80 font-medium leading-relaxed">{activeItem.equipmentNote}</p>
                  </div>
                </>
              )}
            </div>

            <div className="mt-8 text-center space-y-4">
              <p className="font-bold text-[#9B7EC9] dark:text-[#a78bfa] italic transition-colors duration-500">
                {activeItem.isRecipe ? 'Harika duruyor! 💕' : 'Kendini mükemmel hissedeceksin! 💕'}
              </p>
              
              <div className="flex flex-col gap-3">
                {feedbacks.includes(activeItem.title) ? (
                  <div className="bg-pink-50 dark:bg-pink-900/20 text-pink-500 dark:text-pink-300 font-bold py-3.5 rounded-full text-[14px] flex items-center justify-center gap-2 border border-pink-200 dark:border-pink-800/50 shadow-sm fade-in">
                    <span>✨</span> Geri bildirimin alındı, öğreniyoruz!
                  </div>
                ) : (
                  <button 
                    onClick={() => handleFeedback(activeItem)}
                    className="w-full bg-white/60 dark:bg-slate-800/60 hover:bg-pink-50 dark:hover:bg-pink-900/30 text-pink-500 dark:text-pink-400 font-bold py-3.5 rounded-full border border-pink-200 dark:border-pink-800/50 shadow-sm transition-all text-[14px] flex items-center justify-center gap-2"
                  >
                    Bunu denedim ve iyi geldi 💜
                  </button>
                )}

                <button 
                  onClick={() => setActiveItem(null)}
                  className="w-full bg-gradient-to-r from-[#D7B4F3] to-[#A38EE1] dark:from-[#8B5CF6] dark:to-[#6366f1] text-white font-bold py-3.5 rounded-full shadow-purple-glow hover:scale-[1.02] active:scale-95 transition-all text-[16px]"
                >
                  Kapat
                </button>
              </div>
            </div>
          </>
        )}
      </GlassModal>
    </div>
  );
};

export default Lifestyle;
