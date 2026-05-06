import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Sparkles, Activity, Heart, Coffee, Droplets, CalendarClock, Mic, MicOff, X, Bookmark } from 'lucide-react';
import { sendSymptomsToN8n, getCommunityMessages, postCommunityMessage } from '../services/n8nService';

const Journey = () => {
  const [painLevel, setPainLevel] = useState(2);
  const [selectedMoods, setSelectedMoods] = useState(() => {
    const cachedMood = localStorage.getItem('talya_selected_mood');
    return cachedMood ? [cachedMood] : [];
  });
  const [nutrition, setNutrition] = useState('');
  const [formError, setFormError] = useState('');
  const [cycleStatus, setCycleStatus] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [n8nResult, setN8nResult] = useState(null);
  const [historyLog, setHistoryLog] = useState(() => JSON.parse(localStorage.getItem('talya_history') || '[]'));

  // Yeni: Modal ve Seçili Öğe State'leri
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSavingToSheets, setIsSavingToSheets] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const openModal = (item) => {
    setSelectedItem(item);
    setIsSaved(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedItem(null), 300); // animasyon için gecikme
  };

  const handleSaveToSheets = async () => {
    if (!selectedItem) return;
    setIsSavingToSheets(true);

    try {
      const webhookUrl = import.meta.env.VITE_N8N_SHEETS_WEBHOOK_URL || 'https://semal13.app.n8n.cloud/webhook/Talya-journey';

      const payload = {
        userId: JSON.parse(localStorage.getItem('talya:user-profile') || '{}').name || 'Anonim',
        tarif_adi: selectedItem.title,
        malzemeler: selectedItem.ingredients && selectedItem.ingredients.length > 0 ? selectedItem.ingredients.join(', ') : '-',
        hazirlanis: selectedItem.steps && selectedItem.steps.length > 0 ? selectedItem.steps.join(' | ') : '-',
        neden_uygun: n8nResult?.analysis || '-'
      };

      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      setIsSaved(true);
    } catch (error) {
      console.error("Sheets kaydetme hatası:", error);
    } finally {
      setIsSavingToSheets(false);
    }
  };

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const toggleVoiceInput = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      return; // onend will handle the state false
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Tarayıcınız sesli girişi tam desteklemiyor. Lütfen Chrome, Edge veya Safari güncel sürümü kullanın.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'tr-TR';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        }
      }
      if (finalTranscript.trim()) {
        const appendedText = finalTranscript.trim();
        setNutrition(prev => prev ? `${prev} ${appendedText}` : appendedText);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const [communityMessages, setCommunityMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      const msgs = await getCommunityMessages();
      setCommunityMessages(msgs);
    };
    fetchMessages();
  }, []);

  const handlePostMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isPosting) return;

    setIsPosting(true);

    // Optimistic Update
    const optimisticMsg = {
      id: Date.now(),
      text: newMessage,
      author: "Sen",
      time: "Şimdi"
    };

    setCommunityMessages(prev => [optimisticMsg, ...prev]);
    const inputState = newMessage;
    setNewMessage('');

    await postCommunityMessage(inputState);
    setIsPosting(false);
  };


  const moodOptions = ['Mutlu', 'Yorgun', 'Sinirli', 'Hassas', 'Şişkin', 'Sakin', 'Ağrılı', 'Odaklanmış'];
  const cycleOptions = ['Tam Beklenen Tarihte', 'Gecikti / Henüz Olmadım', 'Erken Oldum', 'Sadece Lekelenme'];

  const handleMoodToggle = (m) => {
    setSelectedMoods(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (selectedMoods.length === 0) {
      setFormError('Lütfen en az bir duygu durumu seç.');
      return;
    }
    if (!cycleStatus) {
      setFormError('Lütfen döngü durumunu belirt.');
      return;
    }
    if (!nutrition.trim()) {
      setFormError('Lütfen bugün ne yediğini kısaca not et.');
      return;
    }

    setIsLoading(true);
    setN8nResult(null);

    const userData = JSON.parse(localStorage.getItem('talya:user-profile') || '{}');
    const cycleData = JSON.parse(localStorage.getItem('talya_cycle_sync') || '{}');

    const injectionPrompt = `User feels: ${selectedMoods.join(', ')}. Please adjust the 'analysis' part of your response to be empathetic to this specific mood. Also note their lifestyle is ${userData.lifestyle || 'unknown'} and budget is ${userData.budget || 'unknown'}.`;

    const payload = {
      timestamp: new Date().toISOString(),
      painLevel: painLevel,
      moods: selectedMoods,
      cycleStatus: cycleStatus,
      nutrition: nutrition,
      promptInjection: injectionPrompt,
      // FULL PROFILE INJECTION FOR N8N GEMINI
      userProfile: {
        userName: userData.name || 'Misafir',
        lifestyle: userData.lifestyle || 'Belirtilmemiş',
        budget: userData.budget || 'Belirtilmemiş',
        kitchen: userData.kitchen || 'Belirtilmemiş',
        allergens: userData.allergens || [],
        cycleDayTracker: cycleData.cycleDay || 'Bilinmiyor',
        cyclePhaseTracker: cycleData.cyclePhase || 'Bilinmiyor',
        dietaryRestrictions: userData.dietaryRestrictions || [],
        goal: userData.goal || 'Belirtilmemiş',
        cyclePhase: userData.cyclePhase || 'Belirtilmemiş'
      }
    };

    const result = await sendSymptomsToN8n(payload);
    setN8nResult(result);

    // YENİ: Başarılı AI sonuçlarını Lifestyle'a aktarmak için Cache'le!
    if (result && result.recipe && result.workout) {
      const workoutNorm =
        typeof result.workout === "string"
          ? {
            title: result.workout,
            desc: result.workout,
            id: "journey-daily-workout",
            time: "—",
            intensity: "Hafif",
            type: "Düşük Efor",
            movements: [],
            equipmentNote: "Journey’den önerilen rutin.",
          }
          : {
            ...result.workout,
            desc:
              result.workout.desc ||
              result.workout.title ||
              "",
            movements: Array.isArray(result.workout.movements)
              ? result.workout.movements
              : [],
          };
      const recipeNorm = {
        ...result.recipe,
        desc:
          result.recipe.desc ||
          (Array.isArray(result.recipe.steps) && result.recipe.steps[0]) ||
          "",
      };
      localStorage.setItem('talya_daily_plan', JSON.stringify({
        recipe: recipeNorm,
        workout: workoutNorm,
        date: new Date().toISOString()
      }));

      const history = JSON.parse(localStorage.getItem('talya_history') || '[]');
      history.unshift({
        timestamp: new Date().toISOString(),
        analysis: result.analysis || 'Genel Tavsiye',
        recipeTitle: result.recipe.title || 'PCOS Dostu Tarif',
        mood: selectedMoods.join(', '),
        ingredients: result.recipe.ingredients || [],
        steps: result.recipe.steps || []
      });
      const trimmedHistory = history.slice(0, 10);
      localStorage.setItem('talya_history', JSON.stringify(trimmedHistory));
      setHistoryLog(trimmedHistory);
    }

    setIsLoading(false);
  };

  return (
    <div className="p-6 pt-14 min-h-screen pb-40 fade-in relative">
      <header className="mb-8 text-center relative z-10">
        <h1 className="text-[28px] font-bold text-[#4a3f5e] dark:text-purple-50 mb-1 transition-colors">Günlük Takip</h1>
        <p className="text-[#4a3f5e]/60 dark:text-purple-200/70 font-medium text-[14px]">Semptomlarını kaydet, n8n analiz etsin.</p>
      </header>

      {/* Community Wall Section */}
      <section className="mb-10 w-full relative z-10 transition-all duration-700 fade-in">
        <div className="flex items-center justify-between mb-3 px-1.5">
          <h2 className="text-[17px] font-bold text-[#4a3f5e] dark:text-purple-50 flex items-center gap-2">
            <Heart size={16} className="text-[#8B5CF6]" /> Kız Kardeşlik Duvarı
          </h2>
          <span className="text-[11px] font-medium text-[#4a3f5e]/60 dark:text-purple-200/50 bg-white/40 dark:bg-slate-800/40 px-3 py-1 rounded-full shadow-sm border border-white/50 dark:border-white/5">Anonim Topluluk</span>
        </div>

        {/* Horizontal Scroll Area */}
        <div className="flex overflow-x-auto gap-3 pb-3 no-scrollbar snap-x">
          {communityMessages.map((msg, idx) => (
            <div key={idx} className="snap-start glass-card shrink-0 w-[240px] p-4 flex flex-col gap-2 border border-white/50 dark:border-white/10 relative overflow-hidden group hover:shadow-purple-glow transition-all">
              <div className="absolute right-0 top-0 w-24 h-24 bg-pink-200/20 dark:bg-pink-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <div className="flex items-center gap-2 mb-1 relative z-10">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#D7B4F3] to-[#8B5CF6] flex items-center justify-center text-white shadow-sm shrink-0">
                  <Heart size={10} fill="currentColor" />
                </div>
                <span className="text-[12px] font-bold text-[#4a3f5e] dark:text-purple-200 truncate">{msg.author || "Anonim"}</span>
                <span className="text-[10px] text-[#4a3f5e]/50 dark:text-purple-200/50 ml-auto flex-shrink-0">{msg.time || "Yakın zamanda"}</span>
              </div>
              <p className="text-[13px] text-[#4a3f5e]/80 dark:text-purple-50 font-medium leading-relaxed italic relative z-10">"{msg.text}"</p>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <form onSubmit={handlePostMessage} className="mt-2 flex gap-2">
          <input
            type="text"
            placeholder="Kız kardeşlerine dayanışma notu bırak... 💜"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            className="flex-1 bg-white/60 dark:bg-slate-800/60 border border-white/50 dark:border-white/10 rounded-full px-4 py-2.5 text-[13px] text-[#4a3f5e] dark:text-purple-50 placeholder-[#4a3f5e]/40 dark:placeholder-purple-200/40 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 shadow-inner"
            maxLength={120}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isPosting}
            className="bg-gradient-to-br from-[#D7B4F3] to-[#8B5CF6] hover:to-[#7c3aed] text-white w-10 h-10 rounded-full shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center shrink-0"
          >
            {isPosting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} className="translate-x-0.5" />}
          </button>
        </form>
      </section>

      {!n8nResult ? (
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">

          {/* CYCLE STATUS (PCOS SPECIFIC) */}
          <div className="glass-card p-6 border border-white/60 dark:border-white/10 transition-colors">
            <h3 className="font-bold text-[#4a3f5e] dark:text-purple-50 text-[15px] mb-4 flex items-center gap-2">
              <CalendarClock size={18} className="text-[#3b82f6]" /> Regl / Döngü Durumu
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {cycleOptions.map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setCycleStatus(option)}
                  className={`px-3 py-3 rounded-[1rem] font-bold text-[12px] transition-all duration-300 ${cycleStatus === option ? 'bg-[#3b82f6] text-white shadow-[#3b82f6]/30 shadow-md scale-[1.02]' : 'bg-white/50 dark:bg-slate-800/50 text-[#4a3f5e]/70 dark:text-purple-200/70 border border-white/40 dark:border-white/5 hover:bg-white dark:hover:bg-slate-700'}`}
                >
                  {option}
                </button>
              ))}
            </div>
            <p className="mt-4 text-[#4a3f5e]/50 dark:text-purple-200/50 text-[11px] font-medium leading-relaxed italic">
              PCOS'lu kadınlar için döngülerde kaymalar, gecikmeler veya lekelenmeler oldukça yaygındır ve utanılacak bir şey değildir. 💜
            </p>
          </div>

          {/* PAIN LEVEL */}
          <div className="glass-card p-6 border border-white/60 dark:border-white/10 transition-colors">
            <h3 className="font-bold text-[#4a3f5e] dark:text-purple-50 text-[15px] mb-4 flex items-center gap-2">
              <Activity size={18} className="text-[#FF6B6B]" /> Ağrı & Kramplar
            </h3>
            <div className="flex justify-between gap-2">
              {[1, 2, 3, 4, 5].map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setPainLevel(level)}
                  className={`w-12 h-12 rounded-[1rem] font-bold text-[16px] transition-all duration-300 ${painLevel === level ? 'bg-[#FF6B6B] text-white shadow-[#FF6B6B]/30 shadow-lg scale-110' : 'bg-white/50 dark:bg-slate-800/50 text-[#4a3f5e]/60 dark:text-purple-200/60 border border-white/40 dark:border-white/5 hover:bg-white dark:hover:bg-slate-700'}`}
                >
                  {level}
                </button>
              ))}
            </div>
            <div className="flex justify-between mt-2 px-1 text-[11px] font-bold text-[#4a3f5e]/40 dark:text-purple-200/40 uppercase tracking-wider">
              <span>Hafif</span>
              <span>Şiddetli</span>
            </div>
          </div>

          {/* MULTI-MOOD */}
          <div className="glass-card p-6 border border-white/60 dark:border-white/10 transition-colors">
            <h3 className="font-bold text-[#4a3f5e] dark:text-purple-50 text-[15px] mb-4 flex items-center gap-2">
              <Heart size={18} className="text-[#8B5CF6] dark:text-[#a78bfa]" /> Ruh Hali <span className="text-[11px] text-purple-400 font-normal lowercase tracking-wide">(Birden fazla seçebilirsin)</span>
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {moodOptions.map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleMoodToggle(m)}
                  className={`px-4 py-2.5 rounded-full font-bold text-[13px] transition-all duration-300 ${selectedMoods.includes(m) ? 'bg-[#8B5CF6] text-white shadow-purple-glow' : 'bg-white/50 dark:bg-slate-800/50 text-[#4a3f5e]/70 dark:text-purple-200/70 border border-white/40 dark:border-white/5 hover:bg-white dark:hover:bg-slate-700'}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* NUTRITION & WATER */}
          <div className="glass-card p-6 border border-white/60 dark:border-white/10 transition-colors">
            <h3 className="font-bold text-[#4a3f5e] dark:text-purple-50 text-[15px] mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2"><Coffee size={18} className="text-[#D7B4F3]" /> Günlük Notlar & Beslenme</span>
            </h3>
            <div className="relative">
              <textarea
                value={nutrition}
                onChange={(e) => setNutrition(e.target.value)}
                placeholder="Bugün nasılsın, neler yedin veya ne hissediyorsun? Sesinle de anlatabilirsin..."
                className={`w-full bg-white/40 dark:bg-slate-800/40 border ${isListening ? 'border-[#8B5CF6] dark:border-[#a78bfa] shadow-purple-glow' : 'border-white/50 dark:border-white/5'} rounded-[1rem] p-4 pb-12 text-[14px] text-[#4a3f5e] dark:text-purple-50 placeholder-[#4a3f5e]/40 dark:placeholder-purple-200/30 focus:outline-none focus:ring-2 focus:ring-[#D7B4F3] min-h-[120px] font-medium resize-none transition-all duration-300`}
              />

              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`absolute bottom-3 right-3 p-2.5 rounded-full transition-all duration-300 backdrop-blur-md ${isListening ? 'bg-rose-500 text-white shadow-rose-500/30 animate-pulse' : 'bg-white/60 dark:bg-slate-700/60 text-[#8B5CF6] dark:text-[#a78bfa] hover:bg-white dark:hover:bg-slate-600 border border-white/50 dark:border-white/10 shadow-sm hover:scale-105 active:scale-95'}`}
                title="Sesle Yaz"
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>

              {isListening && (
                <div className="absolute -top-3 left-4 bg-white/90 dark:bg-slate-900/90 border border-rose-200 dark:border-rose-900/50 px-3 py-1.5 rounded-full font-bold text-rose-500 text-[11px] shadow-sm flex items-center gap-2 fade-in">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></div> Seni Dinleyen Talya...
                </div>
              )}
            </div>

            {/* Risk Disclaimer Alert Logic */}
            {['şiddetli kanama', 'bayılma', 'dayanılmaz ağrı', 'aşırı kan', 'acil', 'çok kötüyüm'].some(word => nutrition.toLowerCase().includes(word) || selectedMoods.some(m => m.toLowerCase().includes(word))) && (
              <div className="mt-4 p-3.5 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50 rounded-[1rem] flex gap-3 items-start fade-in">
                <span className="text-rose-500 mt-0.5 animate-pulse">♥️</span>
                <p className="text-[12px] font-bold text-rose-700 dark:text-rose-300 leading-relaxed shadow-sm">
                  Talya: Bedeninin zorlandığını duyuyorum. Bu tür semptomlar dikkate alınmalıdır; lütfen vakit kaybetmeden bir sağlık kuruluşuna danışmayı ihmal etme. Şefkatle...
                </p>
              </div>
            )}
          </div>

          {/* SUBMIT */}
          {formError && (
            <div className="text-rose-500 text-[13px] font-bold text-center mt-2 bg-rose-50 dark:bg-rose-950/40 py-3 rounded-xl border border-rose-100 dark:border-rose-900/50 shadow-sm transition-all fade-in">
              ⚠️ {formError}
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#D7B4F3] to-[#A38EE1] dark:from-[#8B5CF6] dark:to-[#6366f1] text-white font-bold py-4 rounded-full shadow-purple-glow hover:scale-[1.02] active:scale-95 transition-all text-[16px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none mt-4"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <><Sparkles size={20} /> Analiz Et</>}
          </button>

          {isLoading && (
            <div className="absolute inset-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-[2rem] flex flex-col items-center justify-center fade-in border border-white/50 dark:border-white/10">
              <Loader2 size={40} className="animate-spin text-[#8B5CF6] mb-5 dark:text-[#a78bfa] drop-shadow-sm" />
              <p className="text-[#8B5CF6] dark:text-[#a78bfa] font-bold text-[14px] animate-pulse text-center px-6 leading-relaxed">
                Talya senin için interneti tarıyor ve en uygun tarifi hazırlıyor...
              </p>
            </div>
          )}

          {!isLoading && historyLog.length > 0 && (
            <section className="mt-12 fade-in">
              <h3 className="text-[16px] font-bold text-[#4a3f5e] dark:text-purple-50 mb-4 px-1 flex items-center gap-2">
                <CalendarClock size={16} className="text-[#8B5CF6]" /> Geçmiş Önerilerim
              </h3>
              <div className="space-y-3">
                {historyLog.map((log, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => openModal({
                      title: log.recipeTitle,
                      analysis: log.analysis,
                      ingredients: log.ingredients || ["(Eski kayıtlarda malzeme detayı bulunmuyor)"],
                      steps: log.steps || ["(Eski kayıtlarda yapılış detayı bulunmuyor)"]
                    })}
                    className="glass-card p-4 flex flex-col gap-1.5 border border-[#D7B4F3]/30 dark:border-[#8B5CF6]/20 transition-all hover:scale-[1.01] cursor-pointer"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-bold text-[#8B5CF6] dark:text-[#a78bfa]">{new Date(log.timestamp).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="text-[10px] font-bold bg-[#EAE2F3] dark:bg-slate-700 text-[#8B5CF6] dark:text-[#a78bfa] px-2.5 py-0.5 rounded-full">{log.mood}</span>
                    </div>
                    <p className="text-[13px] font-bold text-[#4a3f5e] dark:text-purple-50 truncate">{log.recipeTitle}</p>
                    <p className="text-[12px] text-[#4a3f5e]/70 dark:text-purple-100/70 line-clamp-2 leading-relaxed">{log.analysis}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </form>
      ) : (
        <div className="space-y-6 slide-up relative z-10 transition-colors">
          {n8nResult.success === false && (
            <div className="glass-card p-4 border border-rose-200 dark:border-rose-900/50 bg-rose-50/90 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100 text-[13px] font-medium leading-relaxed">
              Bu analiz tamamlanamadı (strict mod veya n8n hatası). Metin aşağıda; webhook URL ve workflow çıktısını kontrol et.
            </div>
          )}
          <div className="glass-card p-6 border border-[#D7B4F3]/50 dark:border-[#8B5CF6]/30 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-pink-300/10 dark:bg-fuchsia-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>

            <div className="flex flex-col items-center text-center mb-6 relative z-10">
              <div className="flex gap-2 flex-wrap justify-center mb-4">
                {(() => {
                  const txt = (n8nResult.analysis || '').toLowerCase();
                  const tags = [];
                  if (txt.includes('yurt') || txt.includes('kettle') || txt.includes('pratik') || txt.includes('pişirme')) tags.push("❄️ Yurt Modu Aktif");
                  if (txt.includes('öğrenci') || txt.includes('bütçe') || txt.includes('ucuz')) tags.push("🎓 Bütçe Dostu Seçim");
                  if (txt.includes('hızlı') || txt.includes('dakika') || txt.includes('mesai')) tags.push("⚡ 10 Dk Hızlı");
                  if (tags.length === 0) tags.push("🌸 PCOS'a Özel");

                  return tags.map((t, idx) => (
                    <span key={idx} className="text-[11px] font-bold px-3 py-1.5 bg-gradient-to-r from-[#D7B4F3] to-[#8B5CF6] text-white rounded-full shadow-sm">{t}</span>
                  ));
                })()}
              </div>

              <h2 className="text-[20px] font-bold text-[#4a3f5e] dark:text-purple-50 mb-3 px-2">
                Talya'nın Sana Özel Algoritması
              </h2>

              <p className="text-[14px] text-[#4a3f5e]/90 dark:text-purple-100/90 leading-relaxed font-medium mt-2 px-1 text-left">
                {n8nResult.analysis}
              </p>
            </div>

            {/* RECIPE AREA (Stepper & Chips) */}
            {n8nResult.recipe && (
              <div
                onClick={() => openModal({
                  title: n8nResult.recipe.title,
                  ingredients: n8nResult.recipe.ingredients || [],
                  steps: n8nResult.recipe.steps || []
                })}
                className="bg-white/60 dark:bg-slate-800/60 p-5 rounded-[1.5rem] shadow-sm border border-white/60 dark:border-white/10 mb-6 relative z-10 cursor-pointer hover:border-[#D7B4F3]/80 hover:shadow-purple-glow transition-all group"
              >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Bookmark size={18} className="text-[#8B5CF6]" />
                </div>
                <h3 className="text-[16px] font-bold text-[#8B5CF6] dark:text-[#a78bfa] mb-4 flex items-center gap-2 leading-tight">
                  🥗 <span className="flex-1">{n8nResult.recipe.title}</span>
                </h3>

                {/* INGREDIENTS CHIPS */}
                <div className="mb-5">
                  <span className="text-[11px] font-bold text-[#4a3f5e]/80 dark:text-purple-200/80 uppercase tracking-widest pl-1 mb-2.5 block">Malzemeler</span>
                  <div className="flex flex-wrap gap-2">
                    {(n8nResult.recipe.ingredients || []).map((ing, idx) => (
                      <div key={idx} className="bg-[#f8f5fb] dark:bg-slate-700/60 border border-[#D7B4F3]/30 dark:border-[#a78bfa]/20 text-[#4a3f5e] dark:text-slate-200 px-3 py-1.5 rounded-[0.8rem] text-[12px] font-bold shadow-sm transition-transform hover:scale-105">
                        {ing}
                      </div>
                    ))}
                  </div>
                </div>

                {/* STEPPER */}
                <div>
                  <span className="text-[11px] font-bold text-[#4a3f5e]/80 dark:text-purple-200/80 uppercase tracking-widest pl-1 mb-3.5 block">Hazırlanışı</span>
                  <div className="space-y-4">
                    {(n8nResult.recipe.steps || []).map((step, idx) => (
                      <div key={idx} className="flex gap-4 group">
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full bg-[#EAE2F3] dark:bg-slate-700 text-[#8B5CF6] dark:text-[#a78bfa] group-hover:bg-[#8B5CF6] group-hover:text-white dark:group-hover:bg-[#a78bfa] transition-colors flex items-center justify-center text-[12px] font-bold shrink-0 shadow-sm border border-white/50 dark:border-white/5">{idx + 1}</div>
                          {idx !== ((n8nResult.recipe.steps || []).length - 1) && <div className="w-0.5 h-full bg-[#8B5CF6]/20 dark:bg-slate-600 mt-2 rounded-full"></div>}
                        </div>
                        <p className="text-[13px] text-[#4a3f5e]/90 dark:text-purple-100/90 font-medium pt-0.5 pb-2 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TEA & WORKOUT GRID */}
            <div className="grid grid-cols-2 gap-3 mb-6 relative z-10 mt-2">
              <div
                onClick={() => openModal({
                  title: n8nResult.tea || n8nResult.workout?.tea || 'Papatya & Zencefil Çayı',
                  ingredients: [n8nResult.tea || n8nResult.workout?.tea || 'Papatya & Zencefil Çayı', "Sıcak Su"],
                  steps: ["1. Suyu kaynatın.", "2. Bitkiyi ekleyip 5-7 dk demlenmeye bırakın.", "3. Ilık olarak tüketin."],
                })}
                className="cursor-pointer bg-amber-50/80 dark:bg-amber-900/20 p-4 rounded-[1.2rem] border border-amber-200/50 dark:border-amber-800/30 flex flex-col items-center text-center shadow-sm hover:scale-[1.02] hover:border-amber-300 transition-transform group relative"
              >
                <Bookmark size={14} className="absolute top-3 right-3 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="bg-amber-100 dark:bg-amber-800/50 w-[42px] h-[42px] rounded-full flex items-center justify-center text-[20px] mb-2 shadow-inner border border-white/50 dark:border-white/5">🍵</div>
                <h4 className="text-[10px] font-bold uppercase text-amber-600/70 dark:text-amber-400/70 mb-1 tracking-wider">Destek Çayı</h4>
                <p className="text-[12.5px] font-bold text-amber-800 dark:text-amber-200 leading-tight">{n8nResult.tea || n8nResult.workout?.tea || 'Papatya & Zencefil Çayı'}</p>
              </div>

              <div
                onClick={() => openModal({
                  title: n8nResult.workout?.title || n8nResult.workout || 'Hafif Egzersiz',
                  ingredients: [],
                  steps: Array.isArray(n8nResult.workout?.movements) && n8nResult.workout.movements.length > 0 ? n8nResult.workout.movements : [n8nResult.workout?.desc || n8nResult.workout || 'Bedeninizi zorlamadan egzersizi dikkatlice uygulayın.'],
                })}
                className="cursor-pointer bg-blue-50/80 dark:bg-blue-900/20 p-4 rounded-[1.2rem] border border-blue-200/50 dark:border-blue-800/30 flex flex-col items-center text-center shadow-sm hover:scale-[1.02] hover:border-blue-300 transition-transform group relative"
              >
                <Bookmark size={14} className="absolute top-3 right-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="bg-blue-100 dark:bg-blue-800/50 w-[42px] h-[42px] rounded-full flex items-center justify-center text-[20px] mb-2 shadow-inner border border-white/50 dark:border-white/5">🏃‍♀️</div>
                <h4 className="text-[10px] font-bold uppercase text-blue-600/70 dark:text-blue-400/70 mb-1 tracking-wider">Ritüel</h4>
                <p className="text-[12.5px] font-bold text-blue-800 dark:text-blue-200 leading-tight">{n8nResult.workout?.title || n8nResult.workout || 'Hafif Egzersiz'}</p>
              </div>
            </div>

            <button
              onClick={() => {
                setN8nResult(null);
                setSelectedMoods([]);
                setNutrition('');
                setPainLevel(2);
                setCycleStatus('');
              }}
              className="mt-6 w-full bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-700 text-[#8B5CF6] font-bold py-3.5 rounded-full transition-colors text-[14px] shadow-sm border border-white/50 dark:border-white/5"
            >
              Yeni Form Gönder
            </button>

            <div className="mt-5 border-t border-white/40 dark:border-white/5 pt-4">
              <p className="text-[10px] text-[#4a3f5e]/40 dark:text-purple-200/40 text-center font-medium leading-relaxed">
                <strong className="block text-[#4a3f5e]/50 dark:text-purple-200/50 mb-0.5">Tıbbi Uyarı (Responsible AI)</strong>
                Talya bir yapay zeka yoldaşıdır ve bu analizler tıbbi teşhis veya tedavi yerine geçemez. Şiddetli veya beklenmeyen medikal semptomlar yaşadığınızda lütfen her zaman uzman hekiminize (Jinekolog, Endokrinolog) danışınız.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-md transition-opacity fade-in" onClick={closeModal}></div>
          <div className="relative bg-[#FCFBF8]/95 dark:bg-slate-900/90 backdrop-blur-xl border border-[#D7B4F3]/50 dark:border-[#8B5CF6]/30 rounded-[2rem] p-6 max-w-sm w-full shadow-2xl animate-scale-up overflow-hidden max-h-[85vh] overflow-y-auto no-scrollbar">
            {/* Background Glow (Lavender & Cream) */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D7B4F3]/20 dark:bg-[#8B5CF6]/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#FFF9E6]/30 dark:bg-amber-500/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

            <button onClick={closeModal} className="absolute top-4 right-4 p-2 bg-white/60 dark:bg-slate-800/60 rounded-full text-[#4a3f5e]/60 dark:text-purple-200/60 hover:bg-white dark:hover:bg-slate-700 hover:text-[#8B5CF6] transition-colors z-20 shadow-sm border border-white/50 dark:border-white/5">
              <X size={18} />
            </button>

            <div className="relative z-10 pt-2">
              <h2 className="text-[20px] font-bold text-[#8B5CF6] dark:text-[#a78bfa] mb-5 leading-tight pr-8">
                {selectedItem.title}
              </h2>

              {selectedItem.ingredients && selectedItem.ingredients.length > 0 && (
                <div className="mb-5 bg-white/50 dark:bg-slate-800/50 p-4 rounded-[1.2rem] border border-white/60 dark:border-white/5 shadow-sm">
                  <h3 className="text-[11px] font-bold text-[#4a3f5e]/80 dark:text-purple-200/80 uppercase tracking-widest mb-2.5">Malzemeler</h3>
                  <ul className="list-disc list-inside space-y-1.5 text-[13px] text-[#4a3f5e]/90 dark:text-purple-100/90 font-medium pl-1">
                    {selectedItem.ingredients.map((ing, idx) => (
                      <li key={idx} className="leading-relaxed">{ing}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedItem.steps && selectedItem.steps.length > 0 && (
                <div className="mb-5 bg-white/50 dark:bg-slate-800/50 p-4 rounded-[1.2rem] border border-white/60 dark:border-white/5 shadow-sm">
                  <h3 className="text-[11px] font-bold text-[#4a3f5e]/80 dark:text-purple-200/80 uppercase tracking-widest mb-3">Hazırlanış / Uygulama Adımları</h3>
                  <div className="space-y-3.5">
                    {selectedItem.steps.map((step, idx) => (
                      <div key={idx} className="flex gap-3 items-start">
                        <div className="w-5 h-5 rounded-full bg-[#EAE2F3] dark:bg-slate-700 text-[#8B5CF6] dark:text-[#a78bfa] flex items-center justify-center text-[11px] font-bold shrink-0 shadow-sm border border-[#D7B4F3]/30 dark:border-white/5 mt-0.5">{idx + 1}</div>
                        <p className="text-[13px] text-[#4a3f5e]/90 dark:text-purple-100/90 font-medium leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6 p-4 bg-gradient-to-br from-purple-50/80 to-pink-50/50 dark:from-purple-900/20 dark:to-fuchsia-900/10 border border-[#D7B4F3]/40 dark:border-purple-800/30 rounded-[1.2rem] shadow-sm">
                <h3 className="text-[11px] font-bold text-[#8B5CF6] dark:text-[#a78bfa] uppercase tracking-widest mb-2.5 flex items-center gap-1.5"><Sparkles size={14} /> Neden Sana Uygun?</h3>
                <p className="text-[13px] text-[#4a3f5e]/90 dark:text-purple-100/90 font-medium leading-relaxed italic">
                  {selectedItem.analysis || n8nResult?.analysis || 'Talya senin güncel durumunu ve girdilerini analiz ederek bu öneriyi senin için özel olarak hazırladı.'}
                </p>
              </div>

              <button
                onClick={handleSaveToSheets}
                disabled={isSavingToSheets || isSaved}
                className={`w-full py-4 rounded-[1.2rem] font-bold text-[14px] flex items-center justify-center gap-2 transition-all duration-300 shadow-md ${isSaved ? 'bg-emerald-500 text-white shadow-emerald-500/30 scale-[0.98]' : 'bg-gradient-to-r from-[#D7B4F3] to-[#8B5CF6] hover:to-[#7c3aed] text-white shadow-purple-glow hover:scale-[1.02] active:scale-95'}`}
              >
                {isSavingToSheets ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : isSaved ? (
                  <>Kaydedildi 💜</>
                ) : (
                  <><Bookmark size={18} /> Favorilere Ekle</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Journey;
