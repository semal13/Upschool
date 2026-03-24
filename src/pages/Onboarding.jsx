import React, { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';

const Onboarding = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    lifestyle: 'Öğrenci - Yurtta',
    budget: 'Kısıtlı (Öğrenci Bütçesi)',
    cyclePhase: 'Foliküler'
  });

  const lifestyles = ['Öğrenci - Yurtta', 'Öğrenci - Evde', 'Çalışan - Evde', 'Ev Hanımı'];
  const budgets = ['Kısıtlı (Öğrenci Bütçesi)', 'Orta Halli', 'Esnek/İyi'];

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const setSelection = (key, value) => {
    setFormData({...formData, [key]: value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    
    localStorage.setItem('talya_user_data', JSON.stringify(formData));
    onComplete();
  };

  return (
    <div className="min-h-screen p-6 py-12 flex flex-col justify-center fade-in max-w-lg mx-auto pb-32 relative">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-1000 overflow-hidden">
        {/* Subtle Stardust Effect Container for Dark Mode */}
        <div className="absolute top-[10%] left-[20%] text-yellow-200/30 text-xs animate-pulse">✨</div>
        <div className="absolute top-[40%] right-[15%] text-purple-200/20 text-sm animate-pulse" style={{animationDelay: '1s'}}>✨</div>
        <div className="absolute bottom-[30%] left-[15%] text-cyan-200/30 text-xs animate-pulse" style={{animationDelay: '0.5s'}}>✨</div>
      </div>

      <div className="mb-8 text-center relative z-10">
        <h1 className="text-4xl font-bold text-[#4a3f5e] dark:text-slate-100 mb-3 tracking-tight transition-colors duration-500">Talya</h1>
        <p className="text-[#4a3f5e]/80 dark:text-purple-200/70 font-medium text-[15px] leading-relaxed transition-colors duration-500">Seni daha yakından tanıyabilmemiz için birkaç sorumuz var.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
        {/* Name input */}
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-[2rem] shadow-sm border border-white dark:border-white/10 transition-colors duration-500">
          <label className="block text-[15px] font-bold text-[#4a3f5e] dark:text-slate-200 mb-3 transition-colors duration-500">Adın (veya Takma Adın)</label>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-[#f8f5fb] dark:bg-slate-800/80 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#8B5CF6] transition-all text-[#4a3f5e] dark:text-slate-100 font-medium placeholder-[#4a3f5e]/40 dark:placeholder-slate-400 shadow-inner"
            placeholder="Örn: Ayşe"
            required
          />
        </div>

        {/* Lifestyle Grid */}
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-[2rem] shadow-sm border border-white dark:border-white/10 transition-colors duration-500">
          <label className="block text-[15px] font-bold text-[#4a3f5e] dark:text-slate-200 mb-3 transition-colors duration-500">Yaşam Tarzı</label>
          <div className="grid grid-cols-2 gap-3">
            {lifestyles.map(option => (
              <div 
                key={option}
                onClick={() => setSelection('lifestyle', option)}
                className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border-2 ${
                  formData.lifestyle === option 
                    ? 'border-[#8B5CF6] dark:border-[#a78bfa]/80 bg-[#f8f5fb] dark:bg-slate-800 shadow-sm scale-[1.02]' 
                    : 'border-transparent bg-white/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800/60'
                }`}
              >
                <span className={`text-[13px] font-semibold ${formData.lifestyle === option ? 'text-[#8B5CF6] dark:text-[#a78bfa]' : 'text-[#4a3f5e]/80 dark:text-slate-300'}`}>
                  {option}
                </span>
                {formData.lifestyle === option && (
                  <div className="bg-[#8B5CF6] dark:bg-[#a78bfa] rounded-full p-0.5 text-white">
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Budget Grid */}
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-[2rem] shadow-sm border border-white dark:border-white/10 transition-colors duration-500">
          <label className="block text-[15px] font-bold text-[#4a3f5e] dark:text-slate-200 mb-3 transition-colors duration-500">Ekonomik Durum</label>
          <div className="grid grid-cols-1 gap-3">
            {budgets.map(option => (
              <div 
                key={option}
                onClick={() => setSelection('budget', option)}
                className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border-2 ${
                  formData.budget === option 
                    ? 'border-[#8B5CF6] dark:border-[#a78bfa]/80 bg-[#f8f5fb] dark:bg-slate-800 shadow-sm scale-[1.02]' 
                    : 'border-transparent bg-white/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800/60'
                }`}
              >
                <span className={`text-[14px] font-semibold ${formData.budget === option ? 'text-[#8B5CF6] dark:text-[#a78bfa]' : 'text-[#4a3f5e]/80 dark:text-slate-300'}`}>
                  {option}
                </span>
                {formData.budget === option && (
                  <div className="bg-[#8B5CF6] dark:bg-[#a78bfa] rounded-full p-0.5 text-white">
                    <Check size={14} strokeWidth={3} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Cycle Stage */}
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-[2rem] shadow-sm border border-white dark:border-white/10 transition-colors duration-500">
          <label className="block text-[15px] font-bold text-[#4a3f5e] dark:text-slate-200 mb-3 transition-colors duration-500">Döngü Evren</label>
          <select 
            name="cyclePhase"
            value={formData.cyclePhase}
            onChange={handleChange}
            className="w-full bg-[#f8f5fb] dark:bg-slate-800/80 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#8B5CF6] transition-all text-[#4a3f5e] dark:text-slate-100 font-medium shadow-inner appearance-none"
          >
            <option value="Regl (Menstrüasyon)">Regl (Menstrüasyon)</option>
            <option value="Foliküler">Foliküler (Regl Sonrası)</option>
            <option value="Ovülasyon">Ovülasyon (Yumurtlama)</option>
            <option value="Luteal">Luteal (Regl Öncesi)</option>
            <option value="Bilinmiyor">Emin Değilim</option>
          </select>
        </div>

        <button 
          type="submit"
          className="w-full bg-gradient-to-r from-purple-400 to-pink-300 dark:from-[#8B5CF6] dark:to-[#ec4899] text-white font-bold text-lg py-4 rounded-full mt-4 hover:opacity-90 transition-opacity shadow-purple-glow dark:shadow-[0_0_20px_rgba(236,72,153,0.4)] transform active:scale-95"
        >
          Yolculuğa Başla
        </button>
      </form>
    </div>
  );
};

export default Onboarding;
