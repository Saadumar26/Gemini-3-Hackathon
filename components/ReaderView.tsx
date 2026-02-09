
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Sparkles, X, Loader2 } from 'lucide-react';

interface ReaderViewProps {
  content: string;
  onExplain: (selection: string) => Promise<string>;
}

export const ReaderView: React.FC<ReaderViewProps> = ({ content, onExplain }) => {
  const [selection, setSelection] = useState<string>('');
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number } | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseUp = () => {
    const sel = window.getSelection();
    const selectedText = sel?.toString().trim();
    
    if (selectedText && selectedText.length > 2) {
      const range = sel?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();
      
      if (rect) {
        setSelection(selectedText);
        setTooltipPos({
          top: rect.top + window.scrollY - 40,
          left: rect.left + window.scrollX + rect.width / 2,
        });
      }
    } else {
      if (!explanation) {
        setSelection('');
        setTooltipPos(null);
      }
    }
  };

  const startExplanation = async () => {
    if (!selection) return;
    setIsExplaining(true);
    setExplanation(null);
    try {
      const result = await onExplain(selection);
      setExplanation(result);
    } catch (err) {
      console.error(err);
      setExplanation("Failed to generate explanation. Please try again.");
    } finally {
      setIsExplaining(false);
    }
  };

  const closeExplanation = () => {
    setExplanation(null);
    setSelection('');
    setTooltipPos(null);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden relative">
      <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur shrink-0">
        <h2 className="text-xl font-semibold text-white tracking-tight">Paper Reader</h2>
        <div className="text-xs text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
          Tip: Highlight an equation or text to explain it
        </div>
      </div>

      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto p-12 selection:bg-sky-500/30 selection:text-sky-200"
        onMouseUp={handleMouseUp}
      >
        <div className="max-w-3xl mx-auto markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
      </div>

      {/* Floating Action Button for selection */}
      {tooltipPos && !explanation && !isExplaining && (
        <button
          onClick={startExplanation}
          style={{ top: tooltipPos.top, left: tooltipPos.left }}
          className="fixed z-50 transform -translate-x-1/2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl flex items-center gap-2 animate-in zoom-in duration-200"
        >
          <Sparkles size={14} /> Explain Selection
        </button>
      )}

      {/* Explanation Side Panel / Overlay */}
      {(isExplaining || explanation) && (
        <div className="absolute inset-0 z-50 flex items-center justify-end p-6 pointer-events-none">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-full pointer-events-auto animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sky-400 font-semibold text-sm">
                <Sparkles size={16} /> Equation Explainer
              </div>
              <button onClick={closeExplanation} className="text-slate-500 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="mb-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Selection</p>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-sm text-sky-300">
                  {selection}
                </div>
              </div>

              {isExplaining ? (
                <div className="py-8 flex flex-col items-center justify-center gap-4 text-slate-400">
                  <Loader2 className="animate-spin text-sky-500" size={32} />
                  <p className="text-sm animate-pulse">Deconstructing selection...</p>
                </div>
              ) : (
                <div className="markdown-body text-sm">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {explanation || ""}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
