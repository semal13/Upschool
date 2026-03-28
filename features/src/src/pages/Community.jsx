import React, { useState } from 'react';
import { Send, HeartHandshake } from 'lucide-react';

const Community = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Bugün tatlı krizine yenik düştüm ama kendime kızmıyorum. Yarın yeni bir gün.", time: "2 saat önce", likes: 12 },
    { id: 2, text: "Polikistik over sendromu beni çok yoruyor, ama buradaki paylaşımları görmek yalnız olmadığımı hissettiriyor. Sizi seviyorum kızlar.", time: "4 saat önce", likes: 34 }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages([
      { id: Date.now(), text: input, time: "Şimdi", likes: 0 },
      ...messages
    ]);
    setInput('');
  };

  return (
    <div className="p-6 pt-16 min-h-screen pb-32 fade-in flex flex-col">
      <header className="mb-8 pl-2">
        <h1 className="text-3xl font-semibold text-talya-purple mb-2">İçini Dök</h1>
        <p className="text-talya-text/80 font-medium">Duygularını anonim olarak paylaş, destek bul.</p>
      </header>

      <form onSubmit={handleSend} className="mb-8">
        <div className="relative glass-card p-1">
          <textarea 
            className="w-full bg-transparent border-none rounded-2xl p-5 pr-14 focus:outline-none resize-none h-32 text-talya-text placeholder-talya-text/50 font-medium"
            placeholder="Şu an ne hissediyorsun? İçini dökebilirsin, seni kimse yargılamayacak..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          ></textarea>
          <button 
            type="submit"
            className="absolute bottom-4 right-4 bg-talya-purple text-white p-3 rounded-full hover:bg-talya-purpleDark transition-all shadow-purple-glow active:scale-90"
          >
            <Send size={18} strokeWidth={2.5} />
          </button>
        </div>
      </form>

      <div className="flex-1 space-y-5">
        {messages.map(msg => (
          <div key={msg.id} className="glass-card p-6">
            <p className="text-talya-text leading-relaxed text-[15px] font-medium">{msg.text}</p>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-talya-purple/10">
              <span className="text-xs text-talya-text/50 font-semibold">{msg.time}</span>
              <button className="flex items-center gap-1.5 text-talya-purple/80 hover:text-talya-purple transition-colors text-sm font-semibold bg-white/50 px-3 py-1.5 rounded-full border border-white/60">
                <HeartHandshake size={16} />
                <span>{msg.likes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
