import { useEffect, useRef, useState } from 'react';
import { Brain, Bot, Send, Sparkles, Sun, User, Zap } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://energy-platform-api.onrender.com';

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
  priority: string;
  category: string;
}

const welcomeMessage: Message = {
  id: 1,
  sender: 'ai',
  text: 'Hazıram. Enerji, cihaz, işıq və ya qrafik barədə sual ver.',
  timestamp: new Date(),
};

const CHAT_STORAGE_KEY = 'ecoai-ai-chat-v1';

type StoredMessage = Omit<Message, 'timestamp'> & { timestamp: string };

const serializeMessages = (items: Message[]): StoredMessage[] =>
  items.map((item) => ({
    ...item,
    timestamp: item.timestamp.toISOString(),
  }));

const deserializeMessages = (items: StoredMessage[]): Message[] =>
  items.map((item) => ({
    ...item,
    timestamp: new Date(item.timestamp),
  }));

const loadStoredMessages = (): Message[] => {
  if (typeof window === 'undefined') return [welcomeMessage];

  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) return [welcomeMessage];

    const parsed = JSON.parse(raw) as StoredMessage[];
    if (!Array.isArray(parsed) || parsed.length === 0) return [welcomeMessage];

    return deserializeMessages(parsed);
  } catch {
    return [welcomeMessage];
  }
};

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

function getRecommendationIcon(category: string) {
  const value = category.toLowerCase();
  if (value.includes('işıq') || value.includes('soyutma') || value.includes('isit')) return Sun;
  if (value.includes('cihaz')) return Bot;
  return Zap;
}

function getRecommendationTone(priority: string) {
  if (priority === 'Yüksək') {
    return {
      color: '#00e699',
      bg: 'rgba(0, 230, 153, 0.08)',
      border: 'rgba(0, 230, 153, 0.18)',
    };
  }

  if (priority === 'Orta') {
    return {
      color: '#64ffda',
      bg: 'rgba(100, 255, 218, 0.08)',
      border: 'rgba(100, 255, 218, 0.16)',
    };
  }

  return {
    color: '#94d2bd',
    bg: 'rgba(148, 210, 189, 0.08)',
    border: 'rgba(148, 210, 189, 0.14)',
  };
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>(loadStoredMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(fallbackRecommendations);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(serializeMessages(messages)));
    } catch {
      // Storage dolu və ya bağlanıbsa, söhbət yenə işləsin
    }
  }, [messages]);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/ai/recommendations`);
        if (!response.ok) return;
        const data = await response.json();
        if (Array.isArray(data.recommendations) && data.recommendations.length) {
          setRecommendations(data.recommendations);
        }
      } catch {
        setRecommendations(fallbackRecommendations);
      }
    };

    loadRecommendations();
  }, []);

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
      const response = await fetch(`${API_BASE}/api/ai/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) throw new Error('AI backend error');

      const data = await response.json();
      const answer = data.answer || 'Cavab alınmadı.';

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: answer,
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: 'Bu anda cavab gəlmədi. Bir az sonra yenidən cəhd edin.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([welcomeMessage]);
    try {
      localStorage.removeItem(CHAT_STORAGE_KEY);
    } catch {
      // Ignore storage failures
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
        <div>
          <h3 className="text-[16px] font-medium text-white">AI Optimizer</h3>
          <p className="text-[10px] uppercase tracking-[0.24em]" style={{ color: 'rgba(148,210,189,0.7)' }}>
            Real-time təhlil
          </p>
        </div>
        <button
          type="button"
          onClick={handleClearChat}
          className="ml-auto text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded-md transition-colors"
          style={{ color: 'rgba(148,210,189,0.75)', background: 'rgba(255,255,255,0.04)' }}
        >
          Təmizlə
        </button>
      </div>

      <div
        className="flex-1 overflow-y-auto mb-3 space-y-3 pr-1"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
            {msg.sender === 'ai' ? (
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: '#0a9396' }}>
                <Bot className="w-3 h-3 text-white" />
              </div>
            ) : (
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
              <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.88)' }}>
                {msg.text}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-2">
            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: '#0a9396' }}>
              <Bot className="w-3 h-3 text-white" />
            </div>
            <div className="px-4 py-2.5" style={{ background: 'rgba(10, 147, 150, 0.1)', borderRadius: '12px 12px 12px 2px' }}>
              <div className="flex gap-1">
                {[0, 0.15, 0.3].map((delay, i) => (
                  <span
                    key={i}
                    className="text-[18px] leading-none animate-pulse"
                    style={{ color: 'rgba(255,255,255,0.5)', animationDelay: `${delay}s` }}
                  >
                    &bull;
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2 pt-2">
          {recommendations.map((rec) => {
            const Icon = getRecommendationIcon(rec.category);
            const tone = getRecommendationTone(rec.priority);

            return (
              <div
                key={rec.id}
                className="flex items-start gap-2 p-2.5"
                style={{ background: tone.bg, border: `1px solid ${tone.border}`, borderRadius: 8 }}
              >
                <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: tone.color }} />
                <div className="space-y-0.5">
                  <p className="text-[12px] leading-relaxed font-medium" style={{ color: 'rgba(255,255,255,0.92)' }}>
                    {rec.title}
                  </p>
                  <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.74)' }}>
                    {rec.description}
                  </p>
                  <p className="text-[11px] leading-none" style={{ color: tone.color }}>
                    {rec.saving} · {rec.priority}
                  </p>
                </div>
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
          placeholder="AI-a sual ver (məs: kondisioner, işıq, enerji)..."
          className="flex-1 bg-transparent text-[13px] outline-none"
          style={{ color: 'rgba(255,255,255,0.9)' }}
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
