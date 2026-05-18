import { useState, useRef, useEffect } from 'react';
import { Brain, TrendingDown, Sun, Bot, User, Send } from 'lucide-react';

interface Message {
  id: number;
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: 1,
    sender: 'ai',
    text: 'Salam! Enerji sisteminizdəki məlumatları analiz etdim. Hazırda 450 kWh istehlak var, bu keçən aydan 8.2% azdır.',
    timestamp: new Date(),
  },
  {
    id: 2,
    sender: 'ai',
    text: 'Kondisioner rejimini 26°C əvəzinə 28°C-yə qoyun — aylıq ~$18 qənaət edə bilərsiniz.',
    timestamp: new Date(),
  },
];

const recommendations = [
  {
    id: 1,
    icon: TrendingDown,
    color: '#2a9d8f',
    bg: 'rgba(42, 157, 143, 0.1)',
    border: 'rgba(42, 157, 143, 0.15)',
    text: 'Pik saatlarda (17:00-21:00) batareya rejimi aktivdir',
  },
  {
    id: 2,
    icon: Sun,
    color: '#e9d8a6',
    bg: 'rgba(233, 216, 166, 0.1)',
    border: 'rgba(233, 216, 166, 0.15)',
    text: 'Günəş saatlarında (10:00-15:00) ağır cihazları işlədin',
  },
];

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

 try {
      const response = await fetch(
        `https://energy-platform-api.onrender.com/api/ai/ask?question=${encodeURIComponent(question)}`,
        { method: 'POST' }
      );
      const data = await response.json();
      const answer = data.answer || 'Cavab alınmadı.';

      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: answer,
        timestamp: new Date(),
      }]);
    } catch {
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'Xəta baş verdi. Yenidən cəhd edin.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="liquid-glass col-span-5 flex flex-col" style={{ padding: 16, height: 360 }}>
      <div className="flex items-center gap-2 mb-3">
        <Brain className="w-4 h-4" style={{ color: '#94d2bd' }} />
        <h3 className="text-[16px] font-medium text-white">AI Optimizer</h3>
      </div>

      <div
        className="flex-1 overflow-y-auto mb-3 space-y-3 pr-1"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
            {msg.sender === 'ai' && (
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: '#0a9396' }}>
                <Bot className="w-3 h-3 text-white" />
              </div>
            )}
            {msg.sender === 'user' && (
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <User className="w-3 h-3 text-white" />
              </div>
            )}
            <div
              className="px-3 py-2 max-w-[85%]"
              style={{
                background: msg.sender === 'ai' ? 'rgba(10, 147, 150, 0.15)' : 'rgba(255,255,255,0.08)',
                border: msg.sender === 'ai' ? '1px solid rgba(10, 147, 150, 0.2)' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: msg.sender === 'ai' ? '12px 12px 12px 2px' : '12px 12px 2px 12px',
              }}
            >
              <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
                {msg.text}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-2">
            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#0a9396' }}>
              <Bot className="w-3 h-3 text-white" />
            </div>
            <div className="px-4 py-2.5" style={{ background: 'rgba(10, 147, 150, 0.1)', borderRadius: '12px 12px 12px 2px' }}>
              <div className="flex gap-1">
                {[0, 0.15, 0.3].map((delay, i) => (
                  <span key={i} className="text-[18px] leading-none animate-pulse" style={{ color: 'rgba(255,255,255,0.5)', animationDelay: `${delay}s` }}>
                    &bull;
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2 pt-2">
          {recommendations.map((rec) => {
            const Icon = rec.icon;
            return (
              <div
                key={rec.id}
                className="flex items-start gap-2 p-2.5"
                style={{ background: rec.bg, border: `1px solid ${rec.border}`, borderRadius: 8 }}
              >
                <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: rec.color }} />
                <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  {rec.text}
                </p>
              </div>
            );
          })}
        </div>

        <div ref={messagesEndRef} />
      </div>

      <div
        className="flex items-center gap-2 px-3 py-2"
        style={{ background: 'rgba(0, 42, 53, 0.5)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8 }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="AI-a sual ver..."
          className="flex-1 bg-transparent text-[13px] outline-none"
          style={{ color: 'rgba(255,255,255,0.85)' }}
        />
        <button
          onClick={handleSend}
          className="w-7 h-7 flex items-center justify-center transition-colors"
          style={{ borderRadius: 6, background: input.trim() ? 'rgba(10, 147, 150, 0.3)' : 'transparent' }}
        >
          <Send className="w-4 h-4" style={{ color: input.trim() ? '#94d2bd' : 'rgba(255,255,255,0.35)' }} />
        </button>
      </div>
    </div>
  );
}