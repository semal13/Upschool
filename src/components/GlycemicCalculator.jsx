import React, { useState, useMemo } from 'react';
import { giData } from '../lib/giData';
import { Calculator, Apple, Info, ArrowRight, Heart } from 'lucide-react';

const GlycemicCalculator = () => {
  const [selectedFoodId, setSelectedFoodId] = useState('');
  const [grams, setGrams] = useState(100);

  const selectedFood = useMemo(() => {
    return giData.find(f => f.id === selectedFoodId) || null;
  }, [selectedFoodId]);

  const result = useMemo(() => {
    if (!selectedFood || grams <= 0) return null;
    
    // Net karbonhidrat hesaplama (girilen gramaja göre)
    const netCarbs = (grams / 100) * selectedFood.carbsPer100g;
    
    // Glisemik Yük (GY) = (Gİ / 100) * Net Karbonhidrat
    const gl = (selectedFood.gi / 100) * netCarbs;
    
    return {
      netCarbs: netCarbs.toFixed(1),
      gl: gl.toFixed(1),
      glValue: gl
    };
  }, [selectedFood, grams]);

  const getFeedback = (glValue) => {
    if (glValue < 10) {
      return {
        level: 'Düşük',
        color: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-900/30',
        border: 'border-emerald-200 dark:border-emerald-800/50',
        message: 'Harika bir seçim! Düşük GY ile kan şekerin dengede kalacak ve insülin dalgalanmaları önlenecek 🌸',
        icon: '✨'
      };
    } else if (glValue >= 10 && glValue <= 19) {
      return {
        level: 'Orta',
        color: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-50 dark:bg-amber-900/30',
        border: 'border-amber-200 dark:border-amber-800/50',
        message: 'Güzel, ancak porsiyon kontrolüne dikkat etmekte fayda var. Dengeli tüketebilirsin 👍',
        icon: '⚖️'
      };
    } else {
      return {
        level: 'Yüksek',
        color: 'text-rose-600 dark:text-rose-400',
        bg: 'bg-rose-50 dark:bg-rose-900/30',
        border: 'border-rose-200 dark:border-rose-800/50',
        message: 'Kan şekerini hızlı yükseltebilir. Etkisini kırmak için yanına protein veya sağlıklı yağ (badem, ceviz, yoğurt) ekleyerek dengeleyebilirsin 💪',
        icon: '💡'
      };
    }
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Intro Card */}
      <div className="glass-card p-6 border border-[#8B5CF6]/20 bg-gradient-to-br from-white/60 to-[#EAE2F3]/40 dark:from-slate-800/60 dark:to-[#34264f]/40 relative overflow-hidden group shadow-sm transition-all hover:scale-[1.01]">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#D7B4F3] opacity-20 dark:opacity-10 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="flex items-start gap-4 relative z-10">
          <div className="bg-white/80 dark:bg-slate-800 p-3 rounded-2xl text-[#8B5CF6] dark:text-[#a78bfa] shadow-sm flex-shrink-0 group-hover:rotate-6 transition-transform duration-500">
            <Apple size={24} />
          </div>
          <div>
             <h3 className="text-[16px] font-bold text-[#4a3f5e] dark:text-purple-50 mb-1">Besinlerin Etkisini Keşfet</h3>
             <p className="text-[13px] text-[#4a3f5e]/80 dark:text-purple-100/80 font-medium leading-relaxed">
               Tükettiğin gıdaların kan şekerine olan etkisini (Glisemik Yük) ölçerek PCOS dostu kararlar alabilirsin.
             </p>
          </div>
        </div>
      </div>

      {/* Calculator Form */}
      <div className="glass-card p-6 border border-white/50 dark:border-white/10 shadow-sm space-y-5">
        <div>
          <label className="block text-[13px] font-bold text-[#4a3f5e] dark:text-purple-100 mb-2 pl-1">
            Ne yiyorsun?
          </label>
          <div className="relative">
            <select
              value={selectedFoodId}
              onChange={(e) => setSelectedFoodId(e.target.value)}
              className="w-full appearance-none bg-white/60 dark:bg-slate-800/60 border border-purple-200 dark:border-slate-700 text-[#4a3f5e] dark:text-purple-50 text-[14px] font-medium rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 shadow-inner transition-all cursor-pointer"
            >
              <option value="" disabled>Gıda seçin...</option>
              {giData.map((food) => (
                <option key={food.id} value={food.id}>
                  {food.name} (Gİ: {food.gi})
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[#9B7EC9]">
               <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-bold text-[#4a3f5e] dark:text-purple-100 mb-2 pl-1">
            Ne kadar yiyorsun? (Gram)
          </label>
          <div className="relative">
            <input
              type="number"
              min="1"
              value={grams}
              onChange={(e) => setGrams(Number(e.target.value))}
              className="w-full bg-white/60 dark:bg-slate-800/60 border border-purple-200 dark:border-slate-700 text-[#4a3f5e] dark:text-purple-50 text-[15px] font-bold rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 shadow-inner transition-all pr-12"
              placeholder="100"
            />
            <div className="absolute inset-y-0 right-4 flex items-center text-[#4a3f5e]/40 dark:text-purple-200/40 text-[13px] font-bold">
               gr
            </div>
          </div>
        </div>
      </div>

      {/* Result Section */}
      {result && (
        <div className="fade-in space-y-4">
          <h4 className="text-[15px] font-bold text-[#4a3f5e] dark:text-purple-50 flex items-center gap-2 px-2">
            <Calculator size={18} className="text-[#8B5CF6]" />
            Sonuç Analizi
          </h4>
          
          <div className="flex gap-4">
            <div className="flex-1 bg-white/60 dark:bg-slate-800/60 border border-white/50 dark:border-white/5 p-4 rounded-3xl text-center shadow-sm">
               <p className="text-[11px] font-bold text-[#4a3f5e]/60 dark:text-purple-200/60 uppercase tracking-wide mb-1">Karbonhidrat</p>
               <p className="text-[20px] font-extrabold text-[#4a3f5e] dark:text-purple-50">{result.netCarbs} <span className="text-[12px] font-medium text-[#4a3f5e]/60">g</span></p>
            </div>
            <div className="flex-1 bg-white/60 dark:bg-slate-800/60 border border-white/50 dark:border-white/5 p-4 rounded-3xl text-center shadow-sm relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#D7B4F3]/10 dark:to-[#8B5CF6]/10"></div>
               <p className="text-[11px] font-bold text-[#4a3f5e]/60 dark:text-purple-200/60 uppercase tracking-wide mb-1 relative z-10">Glisemik Yük</p>
               <p className="text-[22px] font-extrabold text-[#8B5CF6] dark:text-[#a78bfa] relative z-10">{result.gl}</p>
            </div>
          </div>

          <div className={`p-5 rounded-3xl border shadow-sm flex items-start gap-3 transition-colors duration-500 ${getFeedback(result.glValue).bg} ${getFeedback(result.glValue).border}`}>
            <div className="text-xl mt-0.5">{getFeedback(result.glValue).icon}</div>
            <div>
               <h5 className={`font-bold text-[14px] mb-1 ${getFeedback(result.glValue).color}`}>
                  Glisemik Yük: {getFeedback(result.glValue).level}
               </h5>
               <p className="text-[13px] font-medium text-[#4a3f5e]/80 dark:text-purple-100/90 leading-relaxed">
                 {getFeedback(result.glValue).message}
               </p>
            </div>
          </div>
        </div>
      )}

      {/* Info Notice */}
      <div className="flex items-start gap-2.5 px-3 opacity-70">
         <Info size={16} className="text-[#4a3f5e] dark:text-purple-200 mt-0.5 flex-shrink-0" />
         <p className="text-[11px] font-medium text-[#4a3f5e] dark:text-purple-200 leading-relaxed">
           Değerler ortalamadır. Yemeğin pişirme şekli, yanında yenen diğer gıdalar (lif, yağ, protein) kan şekerine olan etkiyi değiştirebilir.
         </p>
      </div>
      
    </div>
  );
};

export default GlycemicCalculator;
