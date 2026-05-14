import { useState } from 'react';
import { MessageSquare, X, Send, User, Bot } from 'lucide-react';

export default function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! I am your FinSight AI. Ask me about companies, risk scores, or ratios.' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async (messageText) => {
    const textToSend = typeof messageText === 'string' ? messageText : input;
    if (!textToSend.trim()) return;
    
    const newMessages = [...messages, { role: 'user', text: textToSend }];
    setMessages(newMessages);
    setInput('');
    
    try {
      // Import api at the top if not imported
      const { default: api } = await import('../services/api.js');
      
      const payloadMessages = newMessages.map(m => ({ role: m.role, content: m.text }));
      const res = await api.post('/ai/chat', { messages: payloadMessages });
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: res.data.response 
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: 'Sorry, I am having trouble connecting to the server.' 
      }]);
    }
  };

  const suggestions = [
    "What is the highest risk company?",
    "Explain the fraud score",
    "What does the Z-Score mean?",
    "Which ratios need attention?"
  ];

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-gold text-navy rounded-full shadow-2xl hover:bg-[#d8a124] transition-all transform hover:scale-105 z-50 flex items-center justify-center"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-[#112240] border border-white/20 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="p-4 bg-navy border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                <Bot size={18} className="text-gold" />
              </div>
              <h3 className="text-white font-bold">FinSight AI</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-gold text-navy rounded-tr-none' : 'bg-white/10 text-white rounded-tl-none'}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {suggestions.map((s, i) => (
                <button 
                  key={i} 
                  onClick={() => handleSend(s)}
                  className="text-xs bg-white/5 border border-white/10 text-gray-300 rounded-full px-3 py-1 hover:bg-white/10 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-white/10 bg-navy">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask something..."
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-gold"
              />
              <button 
                onClick={handleSend}
                className="absolute right-2 p-1.5 bg-gold text-navy rounded-full hover:bg-[#d8a124] transition-colors"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
