import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Activity, Coffee, Loader2, Sparkles, Droplets, Footprints, Lightbulb } from 'lucide-react';
import { fetchMotivation, sendGeneralMessage } from '../services/groqService';
import { sendSymptomsToN8n } from '../services/n8nService';
import ChatModal from '../components/ChatModal';

const pcosTips = [
  "PYS Sırrı 💧: Düzenli su içmek vücudun detoksifiye olmasını sağlar ve PCOS ödemini inanılmaz hızlı atar. Hedefin en az 2 litre olmalı!",
  "Unutma 🌸: PCOS sadece kistlerle ilgili değildir; yönetilebilir bir hormon dengesizliğidir. Yalnız değilsin ve harika gidiyorsun.",
  "Egzersiz Sırrı 🧘‍♀️: Her gün ağır efor sarfetmek PCOS'ta kortizolü artırarak zarar verebilir. Bazen en iyi antrenman sadece hafif bir yürüyüştür.",
  "Uyku Gerçeği 🌙: Kaliteli 8 saatlik uyku, insülin direncinle savaşırken kullanabileceğin en ucuz ve en etkili ilaçtır.",
  "Beslenme Sırrı 🍳: Kahvaltıda karbonhidrat yerine protein ağırlıklı beslenmek, tüm gün yaşayacağın o ani tatlı krizlerini bloke eder.",
  "Stres Yönetimi 🌬️: Günde 5 dakikalık derin nefes egzersizi yapmak bile stres hormonlarını ciddi oranda düşürerek seni sakinleştirir."
];

const Home = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: 'Güzel İnsan', cyclePhase: 'Bilinmiyor' });
  const [motivation, setMotivation] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Tip Card
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isTipFading, setIsTipFading] = useState(false);

  const handleNextTip = () => {
    setIsTipFading(true);
    setTimeout(() => {
      setCurrentTipIndex(prev => (prev + 1) % pcosTips.length);
      setIsTipFading(false);
    }, 300);
  };

  const [isSendingMood, setIsSendingMood] = useState(false);
  const [moodSent, setMoodSent] = useState(false);

  // Trackers States
  const [cycleDay, setCycleDay] = useState(14);
  const [isEditingCycle, setIsEditingCycle] = useState(false);
  const [tempCycle, setTempCycle] = useState(14);
  
  const [waterCount, setWaterCount] = useState(2); 
  const [steps, setSteps] = useState(3450); 
  const [isEditingSteps, setIsEditingSteps] = useState(false);
  const [tempSteps, setTempSteps] = useState(3450);

  const getPhase = (day) => {
    if (day <= 5) return 'Menstrüasyon';
    if (day <= 13) return 'Foliküler';
    if (day <= 15) return 'Ovülasyon';
    return 'Luteal';
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Günaydın';
    if (hour >= 12 && hour < 18) return 'İyi günler';
    return 'İyi akşamlar';
  };

  const handleMoodQuickLog = async (mood) => {
    if (moodSent) return;
    setIsSendingMood(true);
    
    // YENİ: Save for the Journey Bridge Payload Injection
    localStorage.setItem('talya_selected_mood', mood);

    await sendSymptomsToN8n({ 
      timestamp: new Date().toISOString(), 
      moods: [mood], 
      cycleStatus: "Hızlı Ekran Bildirimi",
      nutrition: "Hızlı Mod Bildirimi",
      painLevel: 1 
    });
    setIsSendingMood(false);
    setMoodSent(true);
  };

  useEffect(() => {
    const data = localStorage.getItem('talya_user_data');
    if (data) {
      const parsed = JSON.parse(data);
      setUserData(parsed);
    }

    const getMotivation = async () => {
      try {
        const msg = await fetchMotivation();
        setMotivation(msg);
      } catch (e) {
        setMotivation("Kendine şefkat göstermeye hazır mısın? Bugün küçük adımlarla ilerliyoruz. 🌸");
      } finally {
        setIsLoading(false);
      }
    };

    getMotivation();
  }, []);

  return (
    <div className="p-6 pt-12 min-h-screen pb-40 fade-in relative transition-colors duration-500">
      {/* Header */}
      <header className="mb-8 text-center pt-2">
        <h1 className="text-[28px] font-bold text-[#4a3f5e] dark:text-purple-50 mb-2 transition-colors duration-500">{getTimeGreeting()}, {userData.name}!</h1>
        {userData.lifestyle && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/50 dark:border-white/10 shadow-inner max-w-full">
            <span className="text-[12px] font-bold text-[#8B5CF6] dark:text-[#a78bfa] whitespace-nowrap">Yaşam tarzın</span>
            <span className="text-[12px] font-bold text-[#4a3f5e] dark:text-purple-50 break-words">
              {userData.lifestyle}
            </span>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 text-[#4a3f5e]/60 dark:text-purple-200/60 font-medium h-6">
            <Loader2 size={16} className="animate-spin" />
            <span className="animate-pulse">Talya sana sesleniyor...</span>
          </div>
        ) : (
          <p className="text-[#4a3f5e]/70 dark:text-purple-100/80 font-medium leading-relaxed max-w-sm mx-auto text-[14px]">
            {motivation}
          </p>
        )}
      </header>

      {/* PCOS Tip of the Moment */}
      <section className="mb-6 cursor-pointer group" onClick={handleNextTip}>
        <div className="glass-card p-4 flex gap-4 items-center relative overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-purple-glow border border-[#D7B4F3]/30 dark:border-[#a78bfa]/20 shadow-sm">
          <div className="bg-[#EAE2F3] dark:bg-slate-800 p-3 rounded-full text-[#9B7EC9] dark:text-[#a78bfa] shadow-inner shrink-0 group-hover:rotate-12 transition-transform duration-500">
            <Lightbulb size={22} className={isTipFading ? 'scale-90 opacity-50' : 'scale-100 opacity-100 dark:drop-shadow-[0_0_8px_rgba(167,139,250,0.8)] transition-all'} />
          </div>
          <div className={`transition-opacity duration-300 text-left ${isTipFading ? 'opacity-0' : 'opacity-100'}`}>
            <h3 className="text-[11px] font-bold text-[#8B5CF6] dark:text-[#a78bfa] uppercase tracking-wider mb-1">Günün İpucu</h3>
            <p className="text-[13px] text-[#4a3f5e] dark:text-purple-50 font-medium leading-relaxed pr-2">
              {pcosTips[currentTipIndex]}
            </p>
          </div>
        </div>
      </section>
      
      {/* Mood Check-In */}
      <section className="mb-5">
        <div className="glass-card p-6 min-h-[140px] flex flex-col justify-center">
          <h3 className="font-bold text-[#4a3f5e] dark:text-slate-100 text-[15px] text-center mb-5">
            {moodSent ? "Teşekkürler! 💜" : "Bugün nasılsın? 🤔"}
          </h3>

          {isSendingMood ? (
             <div className="flex items-center justify-center py-2 fade-in">
                <Loader2 size={28} className="animate-spin text-[#9B7EC9] dark:text-[#a78bfa]" />
             </div>
          ) : moodSent ? (
             <div className="text-center text-[13px] font-medium text-[#4a3f5e]/70 dark:text-purple-200/70 fade-in">
                Ruh halin günlük takibine işlendi.<br/>
                <span 
                  onClick={() => navigate('/journey')} 
                  className="text-[#8B5CF6] font-bold cursor-pointer underline underline-offset-2 mt-2 inline-block"
                >
                  Detaylı Takip Formu
                </span>
             </div>
          ) : (
            <div className="flex justify-between px-1 fade-in">
              <button 
                onClick={() => handleMoodQuickLog('Zorlanıyorum')} 
                disabled={isSendingMood}
                className="flex flex-col items-center gap-2.5 group"
              >
                <div className="bg-[#FFF3CD] dark:bg-[#4b4324] w-14 h-14 rounded-[1.2rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform cursor-pointer border border-white dark:border-white/10">
                  <span className="text-2xl drop-shadow-sm">😞</span>
                </div>
                <span className="text-[11px] font-bold text-[#4a3f5e]/50 dark:text-purple-200/60">Zorlanıyorum</span>
              </button>
              <button 
                onClick={() => handleMoodQuickLog('Düşük')} 
                disabled={isSendingMood}
                className="flex flex-col items-center gap-2.5 group"
              >
                <div className="bg-[#FFE2E2] dark:bg-[#422626] w-14 h-14 rounded-[1.2rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform cursor-pointer border border-white dark:border-white/10">
                  <span className="text-2xl drop-shadow-sm">😕</span>
                </div>
                <span className="text-[11px] font-bold text-[#4a3f5e]/50 dark:text-purple-200/60">Düşük</span>
              </button>
              <button 
                onClick={() => handleMoodQuickLog('İyi')} 
                disabled={isSendingMood}
                className="flex flex-col items-center gap-2.5 group"
              >
                <div className="bg-[#E2F0CB] dark:bg-[#2e4027] w-14 h-14 rounded-[1.2rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform cursor-pointer border border-white dark:border-white/10">
                  <span className="text-2xl drop-shadow-sm">😌</span>
                </div>
                <span className="text-[11px] font-bold text-[#4a3f5e]/50 dark:text-purple-200/60">İyi</span>
              </button>
              <button 
                onClick={() => handleMoodQuickLog('Harika')} 
                disabled={isSendingMood}
                className="flex flex-col items-center gap-2.5 group"
              >
                <div className="bg-[#FFEDD8] dark:bg-[#47301c] w-14 h-14 rounded-[1.2rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform cursor-pointer border border-white dark:border-white/10">
                  <span className="text-2xl drop-shadow-sm">😊</span>
                </div>
                <span className="text-[11px] font-bold text-[#4a3f5e]/50 dark:text-purple-200/60">Harika</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Grid Trackers: Cycle, Water, Steps */}
      <section className="grid grid-cols-2 gap-4 mb-5">
        <div className="glass-card p-5 flex flex-col items-center text-center justify-center hover:scale-[1.02] transition-all select-none">
          <div className="relative w-[70px] h-[70px] mb-4 cursor-pointer" onClick={() => {setIsEditingCycle(true); setTempCycle(cycleDay)}}>
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-[#f4f1f8] dark:text-slate-800" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-[#F4C1C1] dark:text-[#ff9292] transition-all duration-1000" strokeWidth="3" strokeDasharray={`${Math.min((cycleDay/28)*100, 100)}, 100`} stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {isEditingCycle ? (
                <input 
                  type="number" 
                  autoFocus 
                  value={tempCycle} 
                  onChange={e => setTempCycle(e.target.value)}
                  onBlur={() => { setCycleDay(Number(tempCycle) || 1); setIsEditingCycle(false); }}
                  onKeyDown={e => { if(e.key === 'Enter') { setCycleDay(Number(tempCycle) || 1); setIsEditingCycle(false); }}}
                  className="w-10 text-center bg-white/50 dark:bg-slate-800/50 outline-none rounded font-bold text-[#4a3f5e] dark:text-slate-100 z-20 shadow-inner"
                />
              ) : (
                <span className="text-xl font-bold text-[#4a3f5e] dark:text-slate-100 leading-none mb-0.5">{cycleDay}</span>
              )}
              {!isEditingCycle && <span className="text-[9px] font-bold text-[#4a3f5e]/40 dark:text-purple-200/50 uppercase tracking-wide">Gün</span>}
            </div>
          </div>
          <h3 className="font-bold text-[14px] text-[#4a3f5e] dark:text-slate-100 mb-1">Döngü Takibi 🌸</h3>
          <p className="text-[11px] text-[#4a3f5e]/60 dark:text-purple-200/70 font-medium">{getPhase(cycleDay)} evresi</p>
        </div>

        <div onClick={() => setWaterCount(w => w < 4 ? w + 1 : 0)} className="glass-card p-5 flex flex-col items-center text-center justify-center cursor-pointer hover:scale-[1.02] active:scale-95 transition-all select-none">
          <div className="bg-[#EAE2F3] dark:bg-slate-800 w-14 h-14 flex items-center justify-center rounded-[1.2rem] text-[#9B7EC9] dark:text-cyan-400 mb-4 shadow-inner border border-white dark:border-white/5 transition-colors">
            <Droplets size={26} fill="currentColor" className="dark:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          </div>
          <h3 className="font-bold text-[14px] text-[#4a3f5e] dark:text-slate-100 mb-1">Su İçmeyi Unutma 💧</h3>
          <p className="text-[11px] text-[#4a3f5e]/60 dark:text-purple-200/70 font-medium">Bugün 2 L Hedefin 🎯</p>
          <div className="flex gap-1.5 mt-3">
             {[0,1,2,3].map((drop) => (
                <div key={drop} className={`transition-all duration-300 ${drop < waterCount ? 'text-[#9B7EC9] dark:text-cyan-400 dark:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] drop-shadow-sm scale-110' : 'text-[#9B7EC9]/20 dark:text-slate-700'}`}>
                  <Droplets size={14} fill="currentColor" />
                </div>
             ))}
          </div>
        </div>

        <div className="glass-card col-span-2 p-5 flex items-center justify-between hover:scale-[1.02] transition-all select-none group">
           <div className="flex items-center gap-3">
             <div className="bg-[#EAE2F3] dark:bg-slate-800 w-12 h-12 flex items-center justify-center rounded-[1.2rem] text-[#9B7EC9] dark:text-[#a78bfa] shadow-inner border border-white dark:border-white/5 cursor-pointer active:scale-95 transition-transform" onClick={() => setSteps(s => s + 520)}>
                <Footprints size={22} fill="currentColor" className="dark:drop-shadow-[0_0_8px_rgba(167,139,250,0.8)]" />
             </div>
             <div className="text-left">
               <h3 className="font-bold text-[14px] text-[#4a3f5e] dark:text-slate-100 mb-0.5">Adım Sayar 👟</h3>
               <p className="text-[11px] text-[#4a3f5e]/60 dark:text-purple-200/70 font-medium">Hedef: 8.000 Adım</p>
             </div>
           </div>
           <div className="text-right flex items-center gap-2" onClick={() => {if(!isEditingSteps) {setIsEditingSteps(true); setTempSteps(steps)}}}>
             {isEditingSteps ? (
                <input 
                  type="number" 
                  autoFocus 
                  value={tempSteps} 
                  onChange={e => setTempSteps(e.target.value)}
                  onBlur={() => { setSteps(Number(tempSteps) || 0); setIsEditingSteps(false); }}
                  onKeyDown={e => { if(e.key === 'Enter') { setSteps(Number(tempSteps) || 0); setIsEditingSteps(false); }}}
                  className="w-24 text-right bg-white/50 dark:bg-slate-800/50 outline-none rounded font-bold text-[22px] text-[#4a3f5e] dark:text-slate-100 px-1 shadow-inner"
                />
             ) : (
                <span className="text-[22px] cursor-pointer font-bold text-[#4a3f5e] dark:text-slate-100 hover:text-[#9B7EC9] transition-colors">{steps.toLocaleString('tr-TR')}</span>
             )}
           </div>
        </div>
      </section>

      {/* Action Plans */}
      <section className="space-y-4 mb-5">
        <div onClick={() => navigate('/lifestyle')} className="glass-card p-5 flex items-center gap-4 hover:scale-[1.02] transition-transform cursor-pointer">
          <div className="bg-[#EAE2F3] dark:bg-slate-800 p-4 rounded-full text-[#9B7EC9] dark:text-[#a78bfa] shadow-sm">
            <Coffee size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-[16px] text-[#4a3f5e] dark:text-slate-100">Beslenme</h3>
            <p className="text-[12px] text-[#4a3f5e]/60 dark:text-purple-200/70 mt-0.5 font-medium leading-relaxed">Kan şekerini dengeleyecek tarifler.</p>
          </div>
        </div>

        <div onClick={() => navigate('/lifestyle')} className="glass-card p-5 flex items-center gap-4 hover:scale-[1.02] transition-transform cursor-pointer">
          <div className="bg-[#E0F2F1] dark:bg-teal-950/40 p-4 rounded-full text-[#26A69A] dark:text-teal-400 shadow-sm">
            <Activity size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-[16px] text-[#4a3f5e] dark:text-slate-100">Hareket</h3>
            <p className="text-[12px] text-[#4a3f5e]/60 dark:text-purple-200/70 mt-0.5 font-medium leading-relaxed">Enerjine uygun nazik egzersiz rutinin.</p>
          </div>
        </div>
      </section>



      {/* Floating Ask Talya Button - Neon Lilac in dark mode */}
      <button 
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-[110px] right-6 bg-gradient-to-r from-[#D7B4F3] to-[#A38EE1] dark:from-[#A78BFA] dark:to-[#8B5CF6] text-white rounded-full flex items-center gap-2 px-6 py-3.5 shadow-purple-glow dark:shadow-[0_0_20px_rgba(139,92,246,0.6)] hover:scale-105 transition-all z-40 active:scale-95 border border-white/50 dark:border-white/20"
      >
        <Sparkles size={20} className="animate-pulse" />
        <span className="font-bold text-[15px] tracking-wide drop-shadow-sm">Ask Talya</span>
      </button>

      {/* General Assist Chat Modal */}
      <ChatModal 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)}
        title="Talya"
        subtitle="Sana nasıl yardımcı olabilirim?"
        onSendMessage={sendGeneralMessage}
        initialMessage={`${getTimeGreeting()} güzel insan! 💕 Sana bugün nasıl destek olabilirim?`}
        isCrisis={false}
      />
    </div>
  );
};

export default Home;
