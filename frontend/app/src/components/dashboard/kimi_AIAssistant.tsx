import { useState, useRef, useEffect } from 'react';
import { Brain, TrendingDown, Sun, Bot, User, Send, Sparkles, Flame, Zap } from 'lucide-react';

interface Message {
  id: number;
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  saving: string;
  priority: 'Yüksək' | 'Orta' | 'Aşağı' | string;
  category: string;
}

const initialMessages: Message[] = [
  {
    id: 1,
    sender: 'ai',
    text: 'Salam! Sistem məlumatlarınızı analiz etdim. Hazırda 450 kWh istehlak var, bu keçən aydan 8.2% azdır.',
    timestamp: new Date(),
  },
  {
    id: 2,
    sender: 'ai',
    text: 'Kondisioner rejimini 26°C əvəzinə 28°C-yə qoyun — aylıq ~$18 qənaət edə bilərsiniz.',
    timestamp: new Date(),
  },
];

const fallbackRecommendations: Recommendation[] = [
  {
    id: 'ac',
    title: 'Kondisioner rejimini optimallaşdırın',
    description: '26°C əvəzinə 28°C seçin, bu aylıq enerji xərclərini hiss ediləcək qədər azalda bilər.',
    saving: '~$18/ay',
    priority: 'Yüksək',
    category: 'İstilik/Soyutma',
  },
  {
    id: 'night',
    title: 'Gecə gözləmə rejimini söndürün',
    description: 'Gözləmə rejimində qalan cihazlar da boş yerə enerji sərf edir.',
    saving: '~$12/ay',
    priority: 'Orta',
    category: 'Cihaz',
  },
];

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(fallbackRecommendations);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const question = input.trim();
    const userMsg: Message = {
      id: Date.now(),
      sender: 'user',
      text: question,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // AI Mock Logic (Frontend only)
    setTimeout(() => {
      let answer = "Sizin sorğunuzu Ağıllı Şəbəkə vasitəsilə analiz edirəm. Enerji istehlakınızı optimallaşdırmaq üçün yeni ssenarilər hazırlanıb tətbiq ediləcək.";
      
      const qLower = question.toLowerCase();
      if (qLower.includes('kondisioner')) {
        answer = "Kondisionerləri 28°C dərəcəyə təyin etmək enerji sərfiyyatını 15% azalda bilər. Həmçinin, otaqda olmadığınız zaman onları tamamilə söndürməyi unutmayın.";
      } else if (qLower.includes('işıq') || qLower.includes('isiq')) {
        answer = "Günəş işığından maksimum istifadə edin. Gündüz vaxtı lampaları söndürmək və koridor işıqlarını sensorlu rejimə keçirmək sizə ayda 5-7% qənaət edəcək.";
      } else if (qLower.includes('enerji') || qLower.includes('qənaət') || qLower.includes('qenaet')) {
        answer = "Sizin ümumi enerji sərfiyyatınız bu ay ötən ayla müqayisədə 8% daha azdır. Qənaət rejimini belə davam etdirin! Əlavə olaraq batareyalardan pik saatlarda (19:00-22:00) istifadə etməyi məsləhət görürəm.";
      } else if (qLower.includes('cihaz') || qLower.includes('kabel')) {
        answer = "Bəzi cihazlar gözləmə rejimində olanda belə enerji (vampir enerji) çəkir. İstifadədə olmayan cihazların naqillərini cərəyandan ayırın.";
      } else if (qLower.includes('salam')) {
        answer = "Salam! Mən sizin şəxsi EcoAI assistanınızam. Sisteminizin məlumatlarını davamlı izləyirəm. Sizə necə kömək edə bilərəm?";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: answer,
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 1500); // 1.5 seconds mock delay
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative group col-span-1 md:col-span-5 flex flex-col p-6 rounded-2xl bg-[#030d0a]/60 border border-white/5 backdrop-blur-xl shadow-lg transition-all duration-300 hover:border-[#64ffda]/30 h-[420px] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-[#00e699]/10 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-4 relative z-10 pb-4 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00e699]/20 to-[#64ffda]/5 border border-[#00e699]/30 flex items-center justify-center">
          <Brain className="w-4 h-4 text-[#00e699] drop-shadow-[0_0_8px_rgba(0,230,153,0.8)]" />
        </div>
        <div>
          <h3 className="text-[15px] font-bold text-white tracking-wide">AI Optimizer</h3>
          <p className="text-[10px] text-[#64ffda]/70 uppercase tracking-widest font-mono">Real-time təhlil</p>
        </div>
      </div>

      {/* Chat Area */}
      <div
        className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 relative z-10"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,230,153,0.2) transparent' }}
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
            {msg.sender === 'ai' && (
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 bg-gradient-to-br from-[#00e699]/20 to-[#64ffda]/5 border border-[#00e699]/30 shadow-[0_0_10px_rgba(0,230,153,0.1)]">
                <Bot className="w-3.5 h-3.5 text-[#00e699]" />
              </div>
            )}
            {msg.sender === 'user' && (
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 bg-white/5 border border-white/10">
                <User className="w-3.5 h-3.5 text-gray-400" />
              </div>
            )}
            <div
              className={`px-4 py-2.5 max-w-[85%] text-[13px] leading-relaxed shadow-md backdrop-blur-sm ${
                msg.sender === 'ai' 
                  ? 'bg-gradient-to-br from-[#00e699]/10 to-[#64ffda]/5 border border-[#00e699]/20 text-[#e0f2fe] rounded-2xl rounded-tl-sm' 
                  : 'bg-white/5 border border-white/10 text-gray-300 rounded-2xl rounded-tr-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 bg-gradient-to-br from-[#00e699]/20 to-[#64ffda]/5 border border-[#00e699]/30 shadow-[0_0_10px_rgba(0,230,153,0.1)]">
              <Bot className="w-3.5 h-3.5 text-[#00e699]" />
            </div>
            <div className="px-4 py-3 bg-gradient-to-br from-[#00e699]/5 to-transparent border border-[#00e699]/10 rounded-2xl rounded-tl-sm backdrop-blur-sm flex items-center gap-1.5">
              {[0, 0.15, 0.3].map((delay, i) => (
                <div 
                  key={i} 
                  className="w-1.5 h-1.5 rounded-full bg-[#00e699] animate-bounce" 
                  style={{ animationDelay: `${delay}s` }} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Recommendations Section inline */}
        {messages.length < 3 && !isTyping && recommendations.length > 0 && (
          <div className="space-y-2 mt-4 pt-4 border-t border-white/5">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest pl-1 mb-2">Aktiv Tövsiyələr</p>
            {recommendations.map((rec) => {
              const isHigh = rec.priority === 'Yüksək';
              return (
                <div
                  key={rec.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border backdrop-blur-sm ${
                    isHigh 
                      ? 'bg-emerald-500/10 border-emerald-500/20 shadow-[inset_0_0_15px_rgba(16,185,129,0.05)]' 
                      : 'bg-yellow-500/10 border-yellow-500/20 shadow-[inset_0_0_15px_rgba(234,179,8,0.05)]'
                  }`}
                >
                  <Zap className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isHigh ? 'text-emerald-400' : 'text-yellow-400'}`} />
                  <div className="space-y-1">
                    <p className={`text-[12px] font-bold ${isHigh ? 'text-emerald-300' : 'text-yellow-300'}`}>
                      {rec.title}
                    </p>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      {rec.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div ref={messagesEndRef} className="h-2" />
      </div>

      {/* Input Area */}
      <div className="relative z-10 mt-auto pt-2">
        <div className="flex items-center gap-2 p-1 pl-4 rounded-xl bg-black/40 border border-white/10 focus-within:border-[#64ffda]/40 focus-within:shadow-[0_0_15px_rgba(100,255,218,0.1)] transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="AI-a sual ver (məs: kondisioner, işıq, enerji)..."
            className="flex-1 bg-transparent text-[13px] text-white placeholder-gray-500 outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
              input.trim() 
                ? 'bg-gradient-to-br from-[#00e699] to-[#64ffda] text-[#030d0a] shadow-[0_0_10px_rgba(0,230,153,0.3)] hover:opacity-90' 
                : 'bg-white/5 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-3.5 h-3.5" style={{ marginLeft: input.trim() ? '-2px' : '0' }} />
          </button>
        </div>
      </div>
    </div>
  );
}
