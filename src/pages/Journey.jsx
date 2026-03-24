import React from 'react';
import { Map, Flag } from 'lucide-react';

const Journey = () => {
  return (
    <div className="p-6 pt-16 min-h-screen pb-32 fade-in">
      <header className="mb-10 pl-2">
        <h1 className="text-3xl font-semibold text-talya-purple mb-2">Yolculuğun</h1>
        <p className="text-talya-text/80 font-medium">Küçük adımlar, büyük değişimler getirir</p>
      </header>

      <div className="relative border-l-2 border-talya-purple/30 ml-5 pl-8 space-y-10 mt-12">
        <div className="relative">
          <div className="absolute -left-[45px] bg-talya-purple rounded-full p-2.5 text-white ring-4 ring-talya-paleYellow shadow-sm">
            <Flag size={18} strokeWidth={2.5} />
          </div>
          <div className="glass-card p-5">
            <h3 className="font-semibold text-talya-text text-lg">Bugün</h3>
            <p className="text-sm text-talya-text/70 mt-1.5 leading-relaxed font-medium">Harika bir başlangıç yaptın. Kendine şefkat göstermeyi ihmal etme.</p>
          </div>
        </div>

        <div className="relative opacity-70">
          <div className="absolute -left-[45px] bg-gray-300 rounded-full p-2.5 text-white ring-4 ring-talya-paleYellow">
            <Map size={18} strokeWidth={2.5} />
          </div>
          <div className="glass-card p-5 border-dashed">
            <h3 className="font-semibold text-talya-text text-lg">1. Hafta Sonu</h3>
            <p className="text-sm text-talya-text/70 mt-1.5 font-medium">Kilometre taşın yaklaşmakta.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journey;
