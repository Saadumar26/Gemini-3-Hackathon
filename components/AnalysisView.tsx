import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Loader2, RefreshCw } from 'lucide-react';

interface AnalysisViewProps {
  content: string | null;
  isLoading: boolean;
  error?: string;
  onGenerate: () => void;
  title: string;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ content, isLoading, error, onGenerate, title }) => {
  // Auto-generate if empty on mount
  useEffect(() => {
    if (!content && !isLoading && !error) {
      onGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-950">
      <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <h2 className="text-xl font-semibold text-white tracking-tight">{title}</h2>
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          title="Regenerate"
        >
          <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        {isLoading && !content && (
           <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
             <Loader2 size={40} className="animate-spin text-sky-500" />
             <p className="animate-pulse font-medium">Analyzing paper content...</p>
           </div>
        )}

        {error && (
          <div className="p-4 bg-red-950/30 border border-red-900/50 text-red-400 rounded-xl">
            <p className="font-semibold">Error</p>
            <p className="text-sm opacity-80">{error}</p>
          </div>
        )}

        {content && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="markdown-body">
               <ReactMarkdown remarkPlugins={[remarkGfm]}>
                 {content}
               </ReactMarkdown>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};