import React, { useEffect, useMemo, useState } from 'react';
import { X, Settings, Sparkles, Check } from 'lucide-react';

const DEFAULT_PROFILE = {
  name: '',
  lifestyle: 'Öğrenci - Yurtta',
  kitchen: 'Tam Donanımlı',
  budget: 'Orta Halli',
  allergens: [],
  dietaryRestrictions: [],
  goal: null,
  cyclePhase: 'Bilinmiyor'
};

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

const normalizeProfile = (raw) => {
  const p = raw && typeof raw === 'object' ? raw : {};
  return {
    name: typeof p.name === 'string' ? p.name : DEFAULT_PROFILE.name,
    lifestyle: typeof p.lifestyle === 'string' ? p.lifestyle : DEFAULT_PROFILE.lifestyle,
    kitchen: typeof p.kitchen === 'string' ? p.kitchen : DEFAULT_PROFILE.kitchen,
    budget: typeof p.budget === 'string' ? p.budget : DEFAULT_PROFILE.budget,
    allergens: Array.isArray(p.allergens) ? p.allergens : [],
    dietaryRestrictions: Array.isArray(p.dietaryRestrictions) ? p.dietaryRestrictions : [],
    goal: typeof p.goal === 'string' ? p.goal : (p.goal ?? null),
    cyclePhase: typeof p.cyclePhase === 'string' ? p.cyclePhase : DEFAULT_PROFILE.cyclePhase
  };
};

const Chip = ({ selected, disabled, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`text-[11.5px] font-bold py-2 px-3.5 rounded-full transition-all duration-300 flex items-center gap-1.5 border shadow-sm touch-manipulation ${
      selected
        ? 'bg-gradient-to-r from-[#D7B4F3] to-[#A38EE1] dark:from-[#8B5CF6] dark:to-[#6366f1] text-white border-transparent scale-105'
        : 'bg-white/60 dark:bg-slate-800/60 text-[#4a3f5e] dark:text-slate-200 border-white/80 dark:border-white/10 hover:bg-white dark:hover:bg-slate-700'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {children}
    {selected && <Check size={14} strokeWidth={3} />}
  </button>
);

const ProfileSettings = ({ isOpen, onClose }) => {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [showToast, setShowToast] = useState(false);

  const lifestyleOptions = useMemo(
    () => [
      { id: 'Öğrenci - Yurtta', icon: '🎓' },
      { id: 'Öğrenci - Evde', icon: '🏠' },
      { id: 'Çalışan - Evde', icon: '💼' },
      { id: 'Aktif Çalışan', icon: '🏃' },
      { id: 'Ev Hanımı', icon: '👩‍🍳' }
    ],
    []
  );

  const kitchenOptions = useMemo(
    () => [
      { id: 'Tam Donanımlı', icon: '🏡' },
      { id: 'Temel Mutfak', icon: '🍳' },
      { id: 'Sadece Kettle/Buzdolabı', icon: '⚡' },
      { id: 'Mutfak Yok', icon: '❌' }
    ],
    []
  );

  const budgetOptions = useMemo(
    () => [
      { id: 'Kısıtlı', label: '💰 Kısıtlı' },
      { id: 'Orta Halli', label: '💳 Orta Halli' },
      { id: 'Esnek/İyi', label: '✨ Esnek/İyi' }
    ],
    []
  );

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

  const dietaryOptions = useMemo(
    () => [
      { id: 'Glutensiz', label: '🌾 Glutensiz' },
      { id: 'Laktoz İntoleransı', label: '🥛 Laktoz İntoleransı' },
      { id: 'Vejetaryen', label: '🌱 Vejetaryen' },
      { id: 'Pescatarian', label: '🐟 Pescatarian' },
      { id: 'Vegan', label: '🥚 Vegan' },
      { id: 'Şekersiz', label: '🍬 Şekersiz' }
    ],
    []
  );

  const goalOptions = useMemo(
    () => [
      { id: 'Kilo Dengesi', icon: '⚖️', desc: 'İnsülin direncini yönet' },
      { id: 'Kas & Güç', icon: '💪', desc: 'Protein odaklı beslen' },
      { id: 'Hormon Dengesi', icon: '🌸', desc: 'PCOS semptomlarını azalt' },
      { id: 'Enerji & Odak', icon: '⚡', desc: 'Gün boyu enerjik kal' },
      { id: 'Daha İyi Uyku', icon: '😴', desc: 'Geceleri rahat uyu' }
    ],
    []
  );

  useEffect(() => {
    if (!isOpen) return;
    try {
      const raw = JSON.parse(localStorage.getItem('talya_user_data') || '{}');
      setProfile(normalizeProfile(raw));
    } catch {
      setProfile(DEFAULT_PROFILE);
    }
    setShowToast(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleMulti = (key, id, max) => {
    const current = Array.isArray(profile[key]) ? profile[key] : [];
    const selected = current.includes(id);
    if (selected) {
      setProfile({ ...profile, [key]: current.filter(x => x !== id) });
      return;
    }
    if (current.length >= max) return;
    setProfile({ ...profile, [key]: [...current, id] });
  };

  const handleSave = () => {
    const next = {
      name: profile.name,
      lifestyle: profile.lifestyle,
      kitchen: profile.kitchen,
      budget: profile.budget,
      dietaryRestrictions: profile.dietaryRestrictions || [],
      goal: profile.goal || null,
      cyclePhase: profile.cyclePhase
    };

    localStorage.setItem('talya_user_data', JSON.stringify({ ...next, allergens: profile.allergens || [] }));
    localStorage.setItem('talya_life_conditions', JSON.stringify({
      kitchenType: mapKitchenToLifeConditions(profile.kitchen),
      budgetType: mapBudgetToLifeConditions(profile.budget)
    }));

    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      onClose?.();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-talya-purple/30 dark:bg-slate-900/80 backdrop-blur-md fade-in transition-colors duration-500"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md p-6 relative shadow-[0_20px_60px_-15px_rgba(191,168,226,0.6)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] rounded-[2.5rem] bg-gradient-to-br from-white/95 to-white/80 dark:from-indigo-950/95 dark:to-indigo-900/90 backdrop-blur-2xl border border-white dark:border-white/10 transition-colors duration-500 overflow-y-auto max-h-[88vh] no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#4a3f5e]/40 dark:text-purple-200/40 hover:text-[#9B7EC9] dark:hover:text-purple-300 transition-colors bg-white/80 dark:bg-slate-800/80 rounded-full p-2 shadow-sm z-10 flex-shrink-0"
          aria-label="Kapat"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <h2 className="text-[22px] font-bold text-[#4a3f5e] dark:text-purple-50 mb-6 px-1 flex items-center gap-2">
          <Settings size={22} className="text-[#8B5CF6]" /> Profil Ayarları
        </h2>

        <div className="relative space-y-6">
          {showToast && (
            <div className="absolute inset-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm flex items-center justify-center fade-in rounded-[1.5rem]">
              <div className="bg-gradient-to-br from-[#D7B4F3] to-[#8B5CF6] text-white px-6 py-4 rounded-[1.5rem] shadow-purple-glow text-center transform scale-105 transition-all">
                <Sparkles size={28} className="mx-auto mb-2 drop-shadow-sm" />
                <p className="font-bold text-[15px] leading-relaxed tracking-wide shadow-sm">Profil güncellendi! 💜</p>
              </div>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="text-[12px] font-bold text-[#4a3f5e]/70 dark:text-purple-200/70 uppercase tracking-widest mb-1.5 pl-1 block">Adın</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full bg-white/60 dark:bg-slate-800/60 border border-white/50 dark:border-white/10 rounded-[1.2rem] px-5 py-3.5 text-[15px] font-bold text-[#4a3f5e] dark:text-slate-100 outline-none focus:ring-2 focus:ring-[#8B5CF6] transition-all shadow-inner"
              placeholder="Adın nedir?"
            />
          </div>

          {/* Lifestyle */}
          <div>
            <label className="text-[12px] font-bold text-[#4a3f5e]/70 dark:text-purple-200/70 uppercase tracking-widest mb-2.5 pl-1 block">Yaşam Tarzı</label>
            <div className="grid grid-cols-2 gap-3">
              {lifestyleOptions.map((opt) => {
                const selected = profile.lifestyle === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setProfile({ ...profile, lifestyle: opt.id })}
                    className={`p-4 rounded-[1.4rem] border text-left transition-all ${
                      selected
                        ? 'bg-gradient-to-br from-[#D7B4F3] to-[#8B5CF6] text-white border-transparent shadow-lg scale-[1.01]'
                        : 'bg-white/50 dark:bg-slate-800/50 text-[#4a3f5e] dark:text-slate-100 border-white/40 dark:border-white/5 hover:bg-white dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[18px] ${selected ? 'bg-white/15' : 'bg-white/70 dark:bg-slate-900/50 border border-white/40 dark:border-white/5'}`}>
                        {opt.icon}
                      </div>
                      <div className="min-w-0">
                        <div className={`text-[12.5px] font-extrabold leading-tight ${selected ? 'text-white' : 'text-[#4a3f5e] dark:text-slate-100'}`}>
                          {opt.id}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Kitchen */}
          <div>
            <label className="text-[12px] font-bold text-[#4a3f5e]/70 dark:text-purple-200/70 uppercase tracking-widest mb-2.5 pl-1 block">Mutfak</label>
            <div className="grid grid-cols-2 gap-3">
              {kitchenOptions.map((opt) => {
                const selected = profile.kitchen === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setProfile({ ...profile, kitchen: opt.id })}
                    className={`p-4 rounded-[1.4rem] border text-left transition-all ${
                      selected
                        ? 'bg-white/90 dark:bg-slate-700 border-[#8B5CF6]/60 shadow-md ring-1 ring-[#8B5CF6]/40 scale-[1.01]'
                        : 'bg-white/40 dark:bg-slate-800/40 border-white/30 dark:border-white/5 hover:bg-white/60 dark:hover:bg-slate-800 hover:scale-[1.01]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[18px] bg-white dark:bg-slate-900 shadow-sm border ${selected ? 'border-[#8B5CF6]/30' : 'border-black/5 dark:border-white/5'}`}>
                        {opt.icon}
                      </div>
                      <div className="min-w-0">
                        <div className={`text-[12.5px] font-extrabold leading-tight ${selected ? 'text-[#8B5CF6] dark:text-[#a78bfa]' : 'text-[#4a3f5e] dark:text-slate-200'}`}>
                          {opt.id}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="text-[12px] font-bold text-[#4a3f5e]/70 dark:text-purple-200/70 uppercase tracking-widest mb-2.5 pl-1 block">Bütçe</label>
            <div className="flex gap-2">
              {budgetOptions.map((opt) => {
                const selected = profile.budget === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setProfile({ ...profile, budget: opt.id })}
                    className={`flex-1 py-3 px-2 rounded-[1.2rem] cursor-pointer transition-all duration-300 border text-[12px] font-extrabold ${
                      selected
                        ? 'bg-gradient-to-br from-[#D7B4F3] to-[#8B5CF6] text-white shadow-md scale-[1.02] ring-1 ring-white/50 border-transparent'
                        : 'bg-white/40 dark:bg-slate-800/40 text-[#4a3f5e]/70 dark:text-purple-200/70 hover:bg-white/60 dark:hover:bg-slate-700 border-white/50 dark:border-white/5'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Allergens */}
          <div>
            <div className="flex items-center justify-between mb-2.5 px-1">
              <h3 className="text-[12px] font-bold text-[#4a3f5e]/70 dark:text-purple-200/70 uppercase tracking-widest">Alerjenler</h3>
              <span className="text-[10px] font-bold text-[#8B5CF6] dark:text-[#a78bfa] bg-[#EAE2F3] dark:bg-slate-800 px-2.5 py-1 rounded-full shadow-sm border border-white/50 dark:border-white/5">
                {(profile.allergens || []).length} / 5 seçildi
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {allergenOptions.map((opt) => {
                const selected = (profile.allergens || []).includes(opt.id);
                const disabled = !selected && (profile.allergens || []).length >= 5;
                return (
                  <Chip
                    key={opt.id}
                    selected={selected}
                    disabled={disabled}
                    onClick={() => toggleMulti('allergens', opt.id, 5)}
                  >
                    {opt.label}
                  </Chip>
                );
              })}
            </div>
          </div>

          {/* Dietary restrictions */}
          <div>
            <div className="flex items-center justify-between mb-2.5 px-1">
              <h3 className="text-[12px] font-bold text-[#4a3f5e]/70 dark:text-purple-200/70 uppercase tracking-widest">Beslenme Kısıtlamaları</h3>
              <span className="text-[10px] font-bold text-[#8B5CF6] dark:text-[#a78bfa] bg-[#EAE2F3] dark:bg-slate-800 px-2.5 py-1 rounded-full shadow-sm border border-white/50 dark:border-white/5">
                {(profile.dietaryRestrictions || []).length} / 3 seçildi
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {dietaryOptions.map((opt) => {
                const selected = (profile.dietaryRestrictions || []).includes(opt.id);
                const disabled = !selected && (profile.dietaryRestrictions || []).length >= 3;
                return (
                  <Chip
                    key={opt.id}
                    selected={selected}
                    disabled={disabled}
                    onClick={() => toggleMulti('dietaryRestrictions', opt.id, 3)}
                  >
                    {opt.label}
                  </Chip>
                );
              })}
            </div>
          </div>

          {/* Goal */}
          <div>
            <h3 className="text-[12px] font-bold text-[#4a3f5e]/70 dark:text-purple-200/70 uppercase tracking-widest mb-2.5 pl-1">Hedef</h3>
            <div className="grid grid-cols-1 gap-2.5">
              {goalOptions.map((g) => {
                const selected = profile.goal === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setProfile({ ...profile, goal: g.id })}
                    className={`flex items-center gap-3 p-4 rounded-[1.2rem] cursor-pointer transition-all duration-300 border ${
                      selected
                        ? 'bg-gradient-to-r from-[#8B5CF6] to-[#6366f1] text-white shadow-md shadow-[#8B5CF6]/30 border-transparent scale-[1.01]'
                        : 'bg-white/50 dark:bg-slate-800/50 text-[#4a3f5e] dark:text-slate-100 border-white/50 dark:border-white/5 hover:bg-white dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[16px] ${selected ? 'bg-white/20 shadow-inner' : 'bg-white/80 dark:bg-slate-900 border border-white/50 dark:border-white/5'}`}>
                      {g.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-[13px] font-extrabold leading-tight">{g.id}</div>
                      <div className={`text-[11px] font-medium mt-0.5 ${selected ? 'text-white/90' : 'text-[#4a3f5e]/60 dark:text-purple-200/60'}`}>
                        {g.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save */}
          <div className="pt-2 pb-1">
            <button
              type="button"
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-[#D7B4F3] to-[#A38EE1] dark:from-[#8B5CF6] dark:to-[#6366f1] text-white font-bold py-4 rounded-[1.2rem] shadow-purple-glow hover:scale-[1.02] active:scale-95 transition-all text-[15px] tracking-wide flex items-center justify-center gap-2"
            >
              <Sparkles size={18} /> Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;

