import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Loader2, Dumbbell, ChefHat, Clock, Flame, RefreshCcw } from 'lucide-react';
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
  const fallbackPlan = {
    focus: "Tavsiyen Talya tarafından hazırlanıyor...",
    recipes: [
      { id: 1, title: "Anti-İnflamatuar Özel Kase", time: "25 dk", cal: "380 kcal", type: "Glütensiz", ingredients: ["Kinoa", "Canlı Ispanak", "Avokado", "Ceviz", "Gerçek Zeytinyağı"], steps: ["Kinoayı kısık ateşte haşla.", "Tüm malzemeleri derin, güzel bir kasede birleştir.", "Üzerine nazikçe zeytinyağı gezdir ve taze yeşilliklerle servis et."] },
      { id: 2, title: "Orman Meyveli Hormon Dostu", time: "5 dk", cal: "220 kcal", type: "Yüksek Protein", ingredients: ["Taze Orman Meyveleri", "Yarım Olgun Muz", "Badem Sütü", "Chia Tohumu"], steps: ["Tüm meyveleri ve tatlı sütü rondodan pürüzsüz olana dek geçir.", "Üzerine chia tohumu ekleyerek bekletmeden taptaze tüket."] },
      { id: 3, title: "Somon & Kinoa Harmanı", time: "30 dk", cal: "450 kcal", type: "Yüksek Protein", ingredients: ["Taze Somon", "Kinoa", "Limon", "Dereotu"], steps: ["Somonu fırın kağıdında nazikçe fırınla.", "Kinoayı haşla ve mis kokulu taze otlarla harmanla."] },
      { id: 4, title: "Zerdeçallı Altın Gece Sütü", time: "10 dk", cal: "120 kcal", type: "Düşük Karb", ingredients: ["Badem Sütü", "Toz Organik Zerdeçal", "Karabiber", "Seylan Tarçın"], steps: ["Sütü ocağa alıp yavaşça ısıt.", "Baharatları ekleyip çırpıcıyla yumuşacık köpürt."] }
    ],
    workouts: [
      { id: 5, title: "Sabah Yoga Akışı", time: "20 dk", intensity: "Hafif", type: "Yoga", movements: [{name: "Aşağı Bakan Köpek", desc: "Omurgayı esnet ve bedenine sevgi gönder."}, {name: "Çocuk Duruşu", desc: "Zihni boşalt ve sadece nefesine odaklan."}], equipmentNote: "Favori yoga matın" },
      { id: 6, title: "PCOS Güç ve Direnç", time: "35 dk", intensity: "Orta", type: "Güç", movements: [{name: "Yarım Squat", desc: "Sırt dik, kendine yüklenmeden 15 tekrar."}, {name: "Glute Bridge", desc: "Nefes vererek yukarı 15 tekrar."}], equipmentNote: "İsteğe bağlı dambıl ve mat" },
      { id: 7, title: "Rahatlatıcı Esneme", time: "15 dk", intensity: "Hafif", type: "Düşük Efor", movements: [{name: "Kedi-İnek Duruşu", desc: "Omurganı rahatlat, 10 tur."}, {name: "Oturarak Öne Eğilme", desc: "Arkaya yaslanmadan bacaklarına nazikçe uzan."}], equipmentNote: "Sadece bedenin" }
    ]
  };

  const [activeTab, setActiveTab] = useState('recipes'); 
  const [activeFilter, setActiveFilter] = useState('Tümü');
  const [activeItem, setActiveItem] = useState(null); 
  const [plan, setPlan] = useState(fallbackPlan);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNewPlan = async () => {
    setIsLoading(true);
    try {
      const data = localStorage.getItem('talya_user_data');
      const parsedUserData = data ? JSON.parse(data) : {};
      
      const fetchedPlan = await fetchLifestylePlan(parsedUserData);
      if (fetchedPlan && fetchedPlan.recipes && fetchedPlan.workouts) {
        setPlan(fetchedPlan);
      }
    } catch (e) {
      console.error("Plan alınırken hata", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNewPlan();
  }, []);

  const filters = ['Tümü', 'Glütensiz', 'Yüksek Protein', 'Düşük Karb', 'Düşük Efor', 'Güç', 'Yoga'];
  const visibleFilters = activeTab === 'recipes' 
    ? ['Tümü', 'Glütensiz', 'Yüksek Protein', 'Düşük Karb']
    : ['Tümü', 'Düşük Efor', 'Güç', 'Yoga'];

  useEffect(() => {
    if (!visibleFilters.includes(activeFilter)) {
      setActiveFilter('Tümü');
    }
  }, [activeTab]);

  const displayedItems = activeTab === 'recipes' 
    ? plan.recipes.filter(r => activeFilter === 'Tümü' || r.type === activeFilter)
    : plan.workouts.filter(w => activeFilter === 'Tümü' || w.type === activeFilter);

  return (
    <div className="p-6 pt-16 min-h-screen pb-40 fade-in relative transition-colors duration-500">
      <header className="mb-8 text-center relative">
        <h1 className="text-[28px] font-bold text-[#4a3f5e] dark:text-purple-50 mb-1 transition-colors duration-500">Lifestyle Coach</h1>
        <p className="text-[#4a3f5e]/60 dark:text-purple-200/70 font-medium text-[14px] transition-colors duration-500">PCOS dostu tarifler ve egzersizler</p>
        
        {/* Refresh Generator Button */}
        <button 
          onClick={fetchNewPlan} 
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

      {isLoading && (
        <div className="flex items-center justify-center gap-2 text-[#9B7EC9] dark:text-purple-300 font-medium my-10">
          <Loader2 size={18} className="animate-spin" />
          <span className="animate-pulse">Talya sana ilham veriyor...</span>
        </div>
      )}

      {/* Items List */}
      <div className="space-y-4">
        {!isLoading && displayedItems.map(item => (
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
              <div className="flex items-center gap-3 mt-1.5 text-[13px] text-[#4a3f5e]/60 dark:text-purple-200/70 font-semibold transition-colors duration-500">
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

      {/* Universal Detail Modal */}
      <GlassModal isOpen={!!activeItem} onClose={() => setActiveItem(null)}>
        {activeItem && (
          <>
            <h2 className="text-2xl font-bold text-[#4a3f5e] dark:text-purple-50 mb-6 pr-6 leading-tight transition-colors duration-500">
              {activeItem.title} {activeItem.isRecipe ? '🥗' : '💪'}
            </h2>
            
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
                {activeItem.isRecipe ? 'Afiyet Olsun! 💕' : 'Harika hissediyorsun! 💕'}
              </p>
              <button 
                onClick={() => setActiveItem(null)}
                className="w-full bg-gradient-to-r from-[#D7B4F3] to-pink-300 dark:from-[#8B5CF6] dark:to-[#ec4899] text-white font-bold py-4 rounded-full shadow-purple-glow hover:scale-[1.02] active:scale-95 transition-all text-[17px]"
              >
                Tamamla
              </button>
            </div>
          </>
        )}
      </GlassModal>
    </div>
  );
};

export default Lifestyle;
