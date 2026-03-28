import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import ChatModal from '../components/ChatModal';
import { sendCrisisMessage } from '../services/groqService';

const Calm = () => {
  const [phase, setPhase] = useState('Başlamak için Dokun');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isBreathing, setIsBreathing] = useState(false);

  const affirmations = [
    "Ben değerliyim ve sevilmeyi hak ediyorum. 🌸",
    "Bedenim benim düşmanım değil, yoldaşım. 💜",
    "Bugün elimden gelenin en iyisi yeterli. ✨",
    "Zor duygularımla kalabilme gücüne sahibim. 🌿",
    "Hata yapmaya ve öğrenmeye iznim var. 🕊️",
    "Kendime karşı şefkatli olmayı seçiyorum. 💕",
    "Bu sadece bir an, geçip gidecek. 🌊"
  ];
  const [affIndex, setAffIndex] = useState(-1);

  const handleAffirmationClick = () => {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * affirmations.length);
    } while (nextIndex === Math.max(0, affIndex));
    setAffIndex(nextIndex);
  };

  useEffect(() => {
    let interval;
    if (isBreathing) {
      const sequence = () => {
        setPhase('Nefes Al');
        setTimeout(() => {
          setPhase('Tut');
          setTimeout(() => {
            setPhase('Nefes Ver');
          }, 2000); 
        }, 4000); 
      };

      sequence();
      interval = setInterval(sequence, 10000); 
    } else {
      setPhase('Dokun ve Başla');
    }

    return () => clearInterval(interval);
  }, [isBreathing]);

  return (
    <div className="p-6 pt-16 min-h-screen flex flex-col items-center pb-32 fade-in relative transition-colors duration-500">
      <div className="text-center mb-10 w-full relative z-10 transition-colors duration-500">
        <h1 className="text-[28px] font-bold text-[#4a3f5e] dark:text-purple-50 mb-2 transition-colors duration-500">Güvenli Alanın</h1>
        <p className="text-[#4a3f5e]/70 dark:text-purple-200/70 font-medium transition-colors duration-500">Derin bir nefes al ve kendine alan tanı</p>
      </div>

      <div className="relative flex flex-col items-center justify-center w-full mb-16 z-0" onClick={() => setIsBreathing(true)}>
        <div className="relative flex items-center justify-center w-64 h-64 mb-6 cursor-pointer">
          <div className={`absolute w-56 h-56 bg-gradient-to-br from-[#D7B4F3] to-[#80ded5] dark:from-indigo-600 dark:to-cyan-500 rounded-full blur-2xl opacity-60 dark:opacity-40 ${isBreathing ? 'animate-breathe' : ''} transition-all duration-1000`}></div>
          <div className={`absolute w-44 h-44 bg-gradient-to-br from-[#D7B4F3] to-[#a2e8e1] dark:from-indigo-500 dark:to-cyan-400 rounded-full blur-md opacity-80 dark:opacity-60 ${isBreathing ? 'animate-breathe' : ''} transition-all duration-1000`}></div>
          <div className="absolute w-36 h-36 bg-white/90 dark:bg-slate-900/80 backdrop-blur-3xl flex items-center justify-center z-10 rounded-full shadow-clay dark:shadow-[0_0_30px_rgba(34,211,238,0.2)] border border-white dark:border-white/10 transition-colors duration-500">
            <span className="font-bold text-[#4a3f5e] dark:text-purple-100 text-[15px] tracking-wide text-center px-4 leading-tight transition-colors duration-500">{phase}</span>
          </div>
        </div>
        
        {!isBreathing && (
          <button 
            className="bg-[#BFA8E2] dark:bg-indigo-500 text-white font-bold py-3.5 px-8 rounded-full shadow-purple-glow hover:bg-[#a188cd] dark:hover:bg-indigo-400 transition-all active:scale-95 text-[15px]"
            onClick={(e) => { e.stopPropagation(); setIsBreathing(true); }}
          >
            Nefes Terapisine Başla
          </button>
        )}
      </div>

      <div className="w-full max-w-sm space-y-5 relative z-10">
        <button 
          onClick={() => setIsChatOpen(true)}
          className="w-full bg-gradient-to-r from-pink-300 to-[#FFC6C6] dark:from-pink-600 dark:to-rose-400 text-[#4a3f5e] dark:text-white font-bold py-4 rounded-full shadow-purple-glow dark:shadow-[0_0_20px_rgba(244,114,182,0.4)] hover:opacity-90 transition-all active:scale-95 text-[17px] flex items-center justify-center gap-3 border border-white/50 dark:border-white/10"
        >
          <span>Talya ile Konuş</span> <span className="text-[22px] drop-shadow-sm">🫂</span>
        </button>

        <button 
          onClick={handleAffirmationClick}
          className="w-full glass-card p-5 flex items-center gap-5 hover:scale-[1.02] transition-transform active:scale-95 text-left border border-white/80 dark:border-white/10"
        >
          <div className="bg-[#FFC6C6] dark:bg-[#502828] p-4 rounded-[1.2rem] text-[#FF6B6B] dark:text-rose-400 shadow-sm transition-colors duration-500 shrink-0">
            <Heart size={24} fill="currentColor" className={affIndex !== -1 ? 'animate-pulse' : ''} />
          </div>
          <div>
            <h3 className="font-bold text-[16px] text-[#4a3f5e] dark:text-slate-100 transition-colors duration-500">Hızlı Olumlamalar</h3>
            <p className="text-[13px] text-[#4a3f5e]/80 dark:text-purple-200/90 mt-1 font-semibold leading-relaxed transition-colors duration-500">
               {affIndex === -1 ? "Kendin için pozitif hatırlatmalar (Tıkla)" : affirmations[affIndex]}
            </p>
          </div>
        </button>
      </div>

      <ChatModal 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)}
        title="Güvenli Alan"
        subtitle="Seni anlıyorum ve buradayım..."
        onSendMessage={sendCrisisMessage}
        initialMessage="Ben buradayım ve seni dinliyorum. Şu an neler hissettiğini, kalbinden geçenleri bana anlatabilirsin. Birlikte yavaşlayalım, olur mu? 💜"
        isCrisis={true}
      />
    </div>
  );
};

export default Calm;
