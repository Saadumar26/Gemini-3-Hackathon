
import React from 'react';
import { MessageSquare, FileText, AlertTriangle, TrendingUp, ChevronLeft, BookOpen, Map } from 'lucide-react';
import { AnalysisMode } from '../types';

interface SidebarProps {
  currentMode: AnalysisMode;
  onModeChange: (mode: AnalysisMode) => void;
  paperTitle: string | null;
  onReset: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentMode, onModeChange, paperTitle, onReset }) => {
  const navItems = [
    { mode: AnalysisMode.SUMMARY, icon: FileText, label: 'Summary' },
    { mode: AnalysisMode.READER, icon: BookOpen, label: 'Read & Explain' },
    { mode: AnalysisMode.ROADMAP, icon: Map, label: 'Learning Roadmap' },
    { mode: AnalysisMode.CHAT, icon: MessageSquare, label: 'Chat with Paper' },
    { mode: AnalysisMode.GAPS, icon: AlertTriangle, label: 'Gap Analysis' },
    { mode: AnalysisMode.PREDICTIONS, icon: TrendingUp, label: 'Predictions' },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full shrink-0">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-sky-500 font-bold mb-6">
          <div className="w-6 h-6 rounded bg-sky-500 flex items-center justify-center text-slate-900 text-xs">S</div>
          ScholarAI
        </div>
        <div>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Current Context</h2>
          <p className="text-sm text-slate-200 font-medium line-clamp-2 leading-relaxed" title={paperTitle || "No paper loaded"}>
            {paperTitle || "No paper loaded"}
          </p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.mode}
            onClick={() => onModeChange(item.mode)}
            disabled={!paperTitle}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              currentMode === item.mode
                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={onReset}
          className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-slate-500 hover:text-red-400 hover:bg-red-950/30 transition-colors"
        >
          <ChevronLeft size={16} />
          Back to Home
        </button>
      </div>
    </div>
  );
};
