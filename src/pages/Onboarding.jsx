import React, { useMemo, useState } from 'react';
import { Check, Sparkles, ArrowLeft } from 'lucide-react';

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    lifestyle: 'Öğrenci - Yurtta',
    budget: 'Kısıtlı (Öğrenci Bütçesi)',
    kitchen: 'Tam Donanımlı',
    dietaryRestrictions: [],
    allergens: [],
    goal: null,
    cyclePhase: 'Foliküler'
  });

  const lifestyles = ['Öğrenci - Yurtta', 'Öğrenci - Evde', 'Çalışan - Evde', 'Ev Hanımı'];
  const budgets = ['Kısıtlı (Öğrenci Bütçesi)', 'Orta Halli', 'Esnek/İyi'];
  const kitchenOptions = ['Tam Donanımlı', 'Temel Mutfak', 'Sadece Kettle/Buzdolabı', 'Mutfak Yok'];
  const allergenOptions = useMemo(
    () => [
      { id: 'Gluten', label: '🌾 Gluten' },
      { id: 'Laktoz', label: '🥛 Laktoz' },
      { id: 'Yumurta', label: '🥚 Yumurta' },
      { id: 'Fıstık', label: '🥜 Fıstık' },
      { id: 'Balık & Deniz Ürünleri', label: '🐟 Balık & Deniz Ürünleri' },
      { id: 'Kırmızı Et', label: '🍖 Kırmızı Et' },
      { id: 'Tavuk', label: '🐓 Tavuk' },
      { id: 'Vejetaryen', label: '🌱 Vejetaryen' },
      { id: 'Vegan', label: '🥦 Vegan' },
      { id: 'Şeker', label: '🍬 Şeker' },
      { id: 'Kafein', label: '☕ Kafein' }
    ],
    []
  );
  const goalOptions = useMemo(
    () => [
      { id: 'Kilo Dengesi', icon: '⚖️', title: 'Kilo Dengesi', desc: 'İnsülin direncini yönet' },
      { id: 'Kas & Güç', icon: '💪', title: 'Kas & Güç', desc: 'Protein odaklı beslen' },
      { id: 'Hormon Dengesi', icon: '🌸', title: 'Hormon Dengesi', desc: 'PCOS semptomlarını azalt' },
      { id: 'Enerji & Odak', icon: '⚡', title: 'Enerji & Odak', desc: 'Gün boyu enerjik kal' },
      { id: 'Daha İyi Uyku', icon: '😴', title: 'Daha İyi Uyku', desc: 'Geceleri rahat uyu' }
    ],
    []
  );

  const mapKitchenToLifeConditions = (kitchen) => {
    switch (kitchen) {
      case 'Tam Donanımlı':
        return 'full';
      case 'Temel Mutfak':
        return 'basic';
      case 'Sadece Kettle/Buzdolabı':
        return 'kettle';
      case 'Mutfak Yok':
        return 'none';
      default:
        return 'full';
    }
  };

  const mapBudgetToLifeConditions = (budget) => {
    if ((budget || '').toLowerCase().includes('kısıtlı')) return 'student';
    if ((budget || '').toLowerCase().includes('orta')) return 'standard';
    return 'flexible';
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const setSelection = (key, value) => {
    setFormData({...formData, [key]: value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    
    localStorage.setItem('talya_user_data', JSON.stringify({
      name: formData.name,
      lifestyle: formData.lifestyle,
      kitchen: formData.kitchen,
      budget: formData.budget,
      dietaryRestrictions: formData.dietaryRestrictions || [],
      goal: formData.goal || null,
      cyclePhase: formData.cyclePhase,
      allergens: formData.allergens || []
    }));
    localStorage.setItem('talya_life_conditions', JSON.stringify({
      kitchenType: mapKitchenToLifeConditions(formData.kitchen),
      budgetType: mapBudgetToLifeConditions(formData.budget)
    }));
    const lifeConditions = JSON.parse(
      localStorage.getItem('talya_life_conditions') || '{"kitchenType":"full","budgetType":"standard"}'
    );
    localStorage.setItem(
      'userProfile',
      JSON.stringify({
        name: formData.name,
        lifestyle: formData.lifestyle,
        kitchen: lifeConditions.kitchenType ?? null,
        budget: formData.budget,
        dietaryRestrictions: formData.dietaryRestrictions ?? [],
        goal: formData.goal ?? null,
        symptoms: formData.symptoms ?? [],
        cycleLength: formData.cycleLength ?? null,
        lastPeriodDate: formData.lastPeriodDate ?? null
      })
    );
    onComplete();
  };

  const toggleAllergen = (id) => {
    const current = formData.allergens || [];
    const isSelected = current.includes(id);
    if (isSelected) {
      setFormData({ ...formData, allergens: current.filter(a => a !== id) });
      return;
    }
    if (current.length >= 5) return;
    setFormData({ ...formData, allergens: [...current, id] });
  };

  const goNext = () => {
    if (step === 0 && !formData.name) return;
    setStep(s => Math.min(s + 1, 2));
  };

  const goBack = () => setStep(s => Math.max(s - 1, 0));

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
        {/* Step 0: Basic */}
        {step === 0 && (
          <>
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

            <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-[2rem] shadow-sm border border-white dark:border-white/10 transition-colors duration-500">
              <label className="block text-[15px] font-bold text-[#4a3f5e] dark:text-slate-200 mb-3 transition-colors duration-500">Mutfak İmkanım</label>
              <div className="grid grid-cols-2 gap-3">
                {kitchenOptions.map(option => (
                  <div
                    key={option}
                    onClick={() => setSelection('kitchen', option)}
                    className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border-2 ${
                      formData.kitchen === option
                        ? 'border-[#8B5CF6] dark:border-[#a78bfa]/80 bg-[#f8f5fb] dark:bg-slate-800 shadow-sm scale-[1.02]'
                        : 'border-transparent bg-white/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <span className={`text-[13px] font-semibold ${formData.kitchen === option ? 'text-[#8B5CF6] dark:text-[#a78bfa]' : 'text-[#4a3f5e]/80 dark:text-slate-300'}`}>
                      {option}
                    </span>
                    {formData.kitchen === option && (
                      <div className="bg-[#8B5CF6] dark:bg-[#a78bfa] rounded-full p-0.5 text-white">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

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
          </>
        )}

        {/* Step 1: Allergens */}
        {step === 1 && (
          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-[2rem] shadow-sm border border-white dark:border-white/10 transition-colors duration-500">
            <h2 className="text-[20px] font-bold text-[#4a3f5e] dark:text-slate-100 mb-1">Kaçındığın veya alerjen olduğun şeyler var mı?</h2>
            <p className="text-[#4a3f5e]/70 dark:text-purple-200/70 font-medium text-[13px] leading-relaxed mb-4">
              Tarifler buna göre şekillenecek 🌿
            </p>

            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-[#8B5CF6] dark:text-[#a78bfa] bg-[#EAE2F3] dark:bg-slate-800 px-3 py-1 rounded-full border border-white/50 dark:border-white/5">
                {(formData.allergens || []).length} / 5 seçildi
              </span>
              <button
                type="button"
                onClick={() => { setFormData({ ...formData, allergens: [] }); setStep(2); }}
                className="text-[12px] font-bold text-[#8B5CF6] dark:text-[#a78bfa] hover:underline underline-offset-4"
              >
                Alerjenim Yok →
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {allergenOptions.map(opt => {
                const selected = (formData.allergens || []).includes(opt.id);
                const disabled = !selected && (formData.allergens || []).length >= 5;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleAllergen(opt.id)}
                    disabled={disabled}
                    className={`text-[12px] font-bold py-2 px-3.5 rounded-full transition-all duration-300 flex items-center gap-1.5 border shadow-sm ${
                      selected
                        ? 'bg-gradient-to-r from-[#D7B4F3] to-[#A38EE1] dark:from-[#8B5CF6] dark:to-[#6366f1] text-white border-transparent scale-[1.03]'
                        : 'bg-white/60 dark:bg-slate-800/60 text-[#4a3f5e] dark:text-slate-200 border-white/80 dark:border-white/10 hover:bg-white dark:hover:bg-slate-700'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {opt.label}
                    {selected && <Check size={14} strokeWidth={3} />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Goal */}
        {step === 2 && (
          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-[2rem] shadow-sm border border-white dark:border-white/10 transition-colors duration-500">
            <h2 className="text-[20px] font-bold text-[#4a3f5e] dark:text-slate-100 mb-1">Temel beslenme hedefin ne?</h2>
            <p className="text-[#4a3f5e]/70 dark:text-purple-200/70 font-medium text-[13px] leading-relaxed mb-4">
              Talya önerilerini buna göre kişiselleştirecek.
            </p>

            <div className="grid grid-cols-1 gap-3">
              {goalOptions.map(g => {
                const isSelected = formData.goal === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, goal: g.id })}
                    className={`w-full text-left p-4 rounded-[1.5rem] transition-all border flex items-start gap-3 ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#8B5CF6] to-[#6366f1] text-white shadow-md shadow-[#8B5CF6]/30 border-transparent scale-[1.01]'
                        : 'bg-white/60 dark:bg-slate-800/60 text-[#4a3f5e] dark:text-slate-100 border-white/70 dark:border-white/10 hover:bg-white dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-[1.2rem] flex items-center justify-center text-[18px] flex-shrink-0 ${
                      isSelected ? 'bg-white/15' : 'bg-[#f8f5fb] dark:bg-slate-900/60 border border-white/50 dark:border-white/5'
                    }`}>
                      {g.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h4 className={`text-[14px] font-extrabold ${isSelected ? 'text-white' : 'text-[#4a3f5e] dark:text-slate-100'}`}>
                          {g.title}
                        </h4>
                        {isSelected && (
                          <span className="text-[11px] font-bold bg-white/15 px-3 py-1 rounded-full">
                            Seçildi
                          </span>
                        )}
                      </div>
                      <p className={`text-[12px] font-medium mt-1 ${isSelected ? 'text-white/90' : 'text-[#4a3f5e]/70 dark:text-purple-200/70'}`}>
                        {g.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-3 pt-1">
          {step > 0 ? (
            <button
              type="button"
              onClick={goBack}
              className="flex-1 bg-white/60 dark:bg-slate-800/60 text-[#4a3f5e] dark:text-slate-100 font-bold py-4 rounded-full border border-white/60 dark:border-white/10 shadow-sm hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} /> Geri
            </button>
          ) : (
            <div className="flex-1" />
          )}

          {step < 2 ? (
            <button
              type="button"
              onClick={goNext}
              className="flex-1 bg-gradient-to-r from-purple-400 to-pink-300 dark:from-[#8B5CF6] dark:to-[#ec4899] text-white font-bold text-lg py-4 rounded-full hover:opacity-90 transition-opacity shadow-purple-glow dark:shadow-[0_0_20px_rgba(236,72,153,0.4)] transform active:scale-95"
            >
              Devam Et
            </button>
          ) : (
            <button 
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-400 to-pink-300 dark:from-[#8B5CF6] dark:to-[#ec4899] text-white font-bold text-lg py-4 rounded-full hover:opacity-90 transition-opacity shadow-purple-glow dark:shadow-[0_0_20px_rgba(236,72,153,0.4)] transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Sparkles size={18} /> Yolculuğa Başla
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Onboarding;
