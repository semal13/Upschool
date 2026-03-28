import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, Sparkles, AlertCircle } from 'lucide-react';

const ChatModal = ({ isOpen, onClose, title, subtitle, onSendMessage, initialMessage, isCrisis = false }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ text: initialMessage, isUser: false }]);
    }
  }, [isOpen, initialMessage, messages.length]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { text: userMsg, isUser: true }]);
    setInput('');
    setIsTyping(true);

    try {
      const reply = await onSendMessage(messages, userMsg);
      setMessages(prev => [...prev, { text: reply || "Şu an yanıt oluşturamadım, tekrar deneyelim mi? 💜", isUser: false }]);
    } catch (err) {
      console.error("Chat hatası:", err);
      setMessages(prev => [...prev, { text: "Bir anlığına bağlantım koptu ama seninleyim. Tekrar yazar mısın? 💜", isUser: false }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-5 bg-[#4a3f5e]/30 dark:bg-slate-900/80 backdrop-blur-xl fade-in transition-colors duration-500" onClick={onClose}>
      <div 
        className="w-full sm:max-w-md h-[85vh] sm:h-[600px] flex flex-col bg-white dark:bg-slate-900 shadow-purple-glow dark:shadow-[0_0_40px_rgba(0,0,0,0.5)] rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden border border-white dark:border-white/10 transition-colors duration-500"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-6 pb-4 border-b border-white/20 dark:border-white/5 flex justify-between items-center ${isCrisis ? 'bg-[#FFEDEE] dark:bg-[#422626]' : 'bg-[#f8f5fb] dark:bg-slate-800'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isCrisis ? 'bg-[#FFC6C6] dark:bg-rose-500/20 text-[#FF6B6B] dark:text-rose-400' : 'bg-[#EAE2F3] dark:bg-[#a78bfa]/20 text-[#9B7EC9] dark:text-[#a78bfa]'}`}>
              {isCrisis ? <AlertCircle size={20} /> : <Sparkles size={20} />}
            </div>
            <div>
              <h3 className="font-bold text-[17px] text-[#4a3f5e] dark:text-slate-100">{title}</h3>
              <p className="text-[12px] text-[#4a3f5e]/70 dark:text-purple-200/70 font-medium">{subtitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-white/50 dark:bg-slate-700/50 rounded-full text-[#4a3f5e]/50 dark:text-slate-300 hover:scale-105 active:scale-95 transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-white/40 dark:bg-transparent no-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} fade-in`}>
              <div 
                className={`max-w-[80%] p-4 text-[14px] font-medium leading-relaxed shadow-sm ${
                  msg.isUser 
                    ? 'bg-gradient-to-r from-[#D7B4F3] to-[#A38EE1] dark:from-[#8B5CF6] dark:to-[#6366f1] text-white rounded-2xl rounded-tr-sm' 
                    : 'bg-[#f8f5fb] dark:bg-slate-800 text-[#4a3f5e] dark:text-slate-200 rounded-2xl rounded-tl-sm border border-[#4a3f5e]/5 dark:border-white/5'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start fade-in">
              <div className="bg-[#f8f5fb] dark:bg-slate-800 py-3 px-5 rounded-2xl rounded-tl-sm border border-[#4a3f5e]/5 dark:border-white/5 flex flex-col gap-1 items-start">
                <span className="text-[11px] font-bold text-[#9B7EC9] dark:text-[#a78bfa] mb-0.5">Talya düşünüyor</span>
                <div className="flex space-x-1.5 items-center h-3">
                   <div className="w-1.5 h-1.5 bg-[#D7B4F3] dark:bg-[#8B5CF6] rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                   <div className="w-1.5 h-1.5 bg-[#D7B4F3] dark:bg-[#8B5CF6] rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                   <div className="w-1.5 h-1.5 bg-[#D7B4F3] dark:bg-[#8B5CF6] rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-5 bg-white dark:bg-slate-900 border-t border-[#4a3f5e]/5 dark:border-white/5 pb-8 sm:pb-5 transition-colors duration-500">
          <div className="relative flex items-center">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Talya'ya bir şey yaz..."
              className="w-full bg-[#f8f5fb] dark:bg-slate-800 border border-transparent focus:border-[#D7B4F3] dark:focus:border-[#8B5CF6] text-[#4a3f5e] dark:text-slate-100 placeholder-[#4a3f5e]/40 dark:placeholder-slate-400 rounded-full pl-5 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#D7B4F3]/20 dark:focus:ring-[#8B5CF6]/20 transition-all text-[15px] font-medium"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="absolute right-2 p-2 bg-gradient-to-r from-[#D7B4F3] to-[#A38EE1] dark:from-[#8B5CF6] dark:to-[#6366f1] text-white rounded-full disabled:opacity-50 hover:scale-105 active:scale-95 transition-all shadow-sm"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
