import React, { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { Message } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (msg: string) => Promise<void>;
  isLoading: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const msg = input;
    setInput('');
    await onSendMessage(msg);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50">
      <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-60">
            <Bot size={48} className="mb-4" />
            <p>Ask a question about the paper...</p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-slate-700 text-slate-300' : 'bg-sky-600 text-white'
            }`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-6 py-4 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-slate-800 text-slate-100 rounded-tr-none' 
                : 'bg-slate-800/50 border border-slate-700/50 text-slate-200 rounded-tl-none'
            }`}>
              <div className="markdown-body text-sm">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl rounded-tl-none px-6 py-4 flex items-center gap-2 text-slate-400">
               <Loader2 size={16} className="animate-spin" />
               <span className="text-sm">Reasoning from paper context...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-900">
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask specific questions (e.g., 'What are the limitations mentioned in Section 4?')"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-5 pr-14 py-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all shadow-inner"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 p-2 bg-sky-600 text-white rounded-lg hover:bg-sky-500 disabled:opacity-50 disabled:hover:bg-sky-600 transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};