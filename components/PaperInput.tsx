import React, { useState } from 'react';
import { Search, FileText, Upload, Sparkles } from 'lucide-react';
import { DEMO_PAPER_TEXT } from '../constants';

interface PaperInputProps {
  onPaperLoaded: (title: string, content: string, source: 'search' | 'upload' | 'demo') => void;
  isLoading: boolean;
  onSearch: (query: string) => Promise<string>;
}

export const PaperInput: React.FC<PaperInputProps> = ({ onPaperLoaded, isLoading, onSearch }) => {
  const [activeTab, setActiveTab] = useState<'search' | 'paste'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [pastedText, setPastedText] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    const result = await onSearch(searchQuery);
    // Heuristic to extract a title from the result or just use query
    onPaperLoaded(searchQuery, result, 'search');
  };

  const handlePaste = () => {
    if (!pastedText.trim()) return;
    const title = pastedText.split('\n')[0].substring(0, 50) + "...";
    onPaperLoaded(title, pastedText, 'upload');
  };

  const loadDemo = () => {
    onPaperLoaded("Attention Is All You Need", DEMO_PAPER_TEXT, 'demo');
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-20 p-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">ScholarAI</h1>
        <p className="text-slate-400 text-lg">Your intelligent assistant for academic research analysis.</p>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex border-b border-slate-700">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'search' ? 'bg-slate-700/50 text-sky-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Search size={18} />
            Find Paper
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`flex-1 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'paste' ? 'bg-slate-700/50 text-sky-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <FileText size={18} />
            Paste Text
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'search' ? (
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Topic or Title
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. 'FlashAttention mechanism' or 'arXiv:1706.03762'"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 pl-10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all"
                  />
                  <Search className="absolute left-3 top-3.5 text-slate-500" size={18} />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-sky-600 hover:bg-sky-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-sky-900/20 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="animate-pulse">Searching...</span>
                ) : (
                  <>
                    <Sparkles size={18} /> Analyze
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
               <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Paste Paper Content
                </label>
                <textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste the abstract or full text of the paper here..."
                  className="w-full h-48 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all resize-none"
                />
              </div>
              <button
                onClick={handlePaste}
                disabled={!pastedText.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
              >
                <Upload size={18} /> Load Content
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <button 
          onClick={loadDemo}
          className="text-xs text-slate-500 hover:text-sky-400 underline decoration-slate-700 hover:decoration-sky-400 underline-offset-4 transition-all"
        >
          Try Demo: "Attention Is All You Need"
        </button>
      </div>
    </div>
  );
};