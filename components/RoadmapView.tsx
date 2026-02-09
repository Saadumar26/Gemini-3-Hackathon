
import React, { useEffect } from 'react';
import { Loader2, RefreshCw, BookOpen, ExternalLink, ArrowDown, AlertCircle } from 'lucide-react';
import { RoadmapResponse } from '../types';

interface RoadmapViewProps {
  data: RoadmapResponse | null;
  isLoading: boolean;
  error?: string;
  onGenerate: () => void;
  title: string;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ data, isLoading, error, onGenerate, title }) => {
  
  useEffect(() => {
    if (!data && !isLoading && !error) {
      onGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading && !data) {
     return (
       <div className="flex flex-col items-center justify-center h-full bg-slate-950 text-slate-400">
         <Loader2 size={48} className="animate-spin text-sky-500 mb-4" />
         <p className="text-lg font-medium animate-pulse">Constructing knowledge graph...</p>
         <p className="text-sm opacity-60">Mapping prerequisite concepts and papers</p>
       </div>
     );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-950 p-8">
        <div className="bg-red-950/30 border border-red-900/50 p-6 rounded-2xl max-w-md text-center">
          <AlertCircle size={32} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-400 mb-2">Generation Failed</h3>
          <p className="text-slate-400 mb-6">{error}</p>
          <button 
            onClick={onGenerate}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Handle API error field returned in JSON
  if (data?.error) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-slate-950 p-8">
            <div className="text-center max-w-lg">
                <AlertCircle size={48} className="text-amber-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Unable to Generate Roadmap</h3>
                <p className="text-slate-400">{data.error}</p>
                 <button 
                    onClick={onGenerate}
                    className="mt-6 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                    Retry
                </button>
            </div>
        </div>
      );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-950">
      <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur z-10">
        <div>
           <h2 className="text-xl font-semibold text-white tracking-tight">Learning Roadmap</h2>
           <p className="text-xs text-slate-500 mt-1">
               Prerequisites for: <span className="text-sky-400">{data?.target_paper?.title || title}</span>
           </p>
        </div>
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          title="Regenerate"
        >
          <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-5">
        <div className="max-w-4xl mx-auto space-y-8 relative">
          {/* Vertical Line */}
          <div className="absolute left-[27px] top-8 bottom-8 w-0.5 bg-slate-800" />

          {data?.roadmap?.map((step, index) => (
            <div key={index} className="relative pl-16 animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
              {/* Step Number Bubble */}
              <div className="absolute left-0 top-0 w-14 h-14 rounded-full bg-slate-900 border-4 border-slate-950 shadow-xl flex items-center justify-center z-10 ring-1 ring-slate-800">
                 <span className="text-xl font-bold text-sky-500">{step.step}</span>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg backdrop-blur-sm hover:border-sky-500/30 transition-colors">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-white mb-2">{step.concept.name}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.concept.definition}</p>
                </div>

                <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/50">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <BookOpen size={14} /> Recommended Reading
                  </h4>
                  <div className="space-y-3">
                    {step.recommended_papers.map((paper, pIndex) => (
                      <div key={pIndex} className="group">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <a 
                                    href={paper.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-sky-400 font-medium hover:underline decoration-sky-400/30 text-sm flex items-center gap-1"
                                >
                                    {paper.title}
                                    <ExternalLink size={12} className="opacity-50 group-hover:opacity-100" />
                                </a>
                                <p className="text-xs text-slate-500 mt-1">{paper.reason}</p>
                            </div>
                            <span className="shrink-0 text-[10px] font-mono text-slate-600 bg-slate-900 px-2 py-1 rounded">
                                {paper.arxiv_id}
                            </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Connector arrow for all but last item */}
              {index < (data.roadmap.length - 1) && (
                 <div className="absolute left-[19px] -bottom-6 text-slate-700">
                    <ArrowDown size={16} />
                 </div>
              )}
            </div>
          ))}

          {/* Final Target Paper Node */}
          <div className="relative pl-16 pt-4 animate-in slide-in-from-bottom-4 duration-700 delay-300">
             <div className="absolute left-0 top-4 w-14 h-14 rounded-full bg-emerald-950/30 border-4 border-slate-950 flex items-center justify-center z-10 ring-1 ring-emerald-500/50">
                 <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
             </div>
             <div className="bg-emerald-950/10 border border-emerald-500/20 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
                <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-widest mb-2">Target Goal</h3>
                <h2 className="text-xl font-bold text-white mb-2">{data?.target_paper?.title}</h2>
                <a 
                    href={data?.target_paper?.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                    View on arXiv <ExternalLink size={14} />
                </a>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};
