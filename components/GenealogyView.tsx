
import React, { useEffect, useRef, useState } from 'react';
import { Loader2, RefreshCw, ZoomIn, ZoomOut, Info, AlertTriangle } from 'lucide-react';
import { GenealogyResponse, GenealogyNode } from '../types';

interface GenealogyViewProps {
  title: string;
  data: GenealogyResponse | null;
  isLoading: boolean;
  error?: string;
  onGenerate: () => void;
}

export const GenealogyView: React.FC<GenealogyViewProps> = ({ title, data, isLoading, error, onGenerate }) => {
  const [selectedNode, setSelectedNode] = useState<GenealogyNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data && !isLoading && !error) {
      onGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const width = 800;
  const height = 600;
  
  // Coordinate Mapping
  // X: -1.0 (Left/Parents) to 1.0 (Right/Children)
  // Y: -1.0 (Older) to 1.0 (Newer)
  const mapX = (x: number) => (x + 1) * (width / 2);
  
  // Custom Y mapping based on the prompt's unusual coordinate system
  // The prompt says: "Older papers: higher y" (which typically means visually top, so smaller coordinate in SVG)
  // Let's assume input y is roughly -1 (old) to 1 (new)
  const mapY = (y: number) => {
      // Map -1.0 (top) to 1.0 (bottom) relative to center
      // If y=0 is root (center)
      return (y + 1) * (height / 2);
  };

  if (isLoading && !data) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-950 text-slate-400">
        <Loader2 size={48} className="animate-spin text-sky-500 mb-4" />
        <p className="text-lg font-medium animate-pulse">Tracing intellectual lineage...</p>
        <p className="text-sm opacity-60">Identifying ancestors and descendants</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-950 p-8">
        <div className="bg-red-950/30 border border-red-900/50 p-6 rounded-2xl max-w-md text-center">
          <AlertTriangle size={32} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-400 mb-2">Genealogy Failed</h3>
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

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur z-10">
        <div>
          <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
            Research DNA: {data?.topic || title}
          </h2>
          <p className="text-xs text-slate-500">
             Foundational • Bridging • Root • Current
          </p>
        </div>
        <div className="flex items-center gap-2">
           <div className="flex bg-slate-800 rounded-lg p-1 mr-4">
             <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-2 hover:text-white text-slate-400"><ZoomOut size={16} /></button>
             <button onClick={() => setZoom(1)} className="p-2 hover:text-white text-slate-400 text-xs font-mono w-12">{Math.round(zoom * 100)}%</button>
             <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="p-2 hover:text-white text-slate-400"><ZoomIn size={16} /></button>
           </div>
          <button
            onClick={onGenerate}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Regenerate Tree"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Main Graph Area */}
        <div 
            className="flex-1 overflow-auto bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-10"
            ref={containerRef}
        >
          <div className="min-w-[800px] min-h-[600px] flex items-center justify-center p-12 transition-transform duration-300 origin-center" style={{ transform: `scale(${zoom})` }}>
            <svg 
                width={width} 
                height={height} 
                viewBox={`0 0 ${width} ${height}`} 
                className="overflow-visible"
            >
                {/* Defs for gradients/markers */}
                <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="22" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
                    </marker>
                </defs>

                {/* Grid Lines (Time) */}
                <line x1={0} y1={height/2} x2={width} y2={height/2} stroke="#334155" strokeDasharray="4" strokeWidth="1" opacity="0.5" />
                <text x={10} y={height/2 - 10} fill="#64748b" fontSize="12">Root Era</text>
                
                <text x={10} y={50} fill="#64748b" fontSize="12">Past (Foundations)</text>
                <text x={10} y={height - 20} fill="#64748b" fontSize="12">Present (Impact)</text>

                {/* Edges */}
                {data?.nodes?.map(node => (
                    <g key={`edges-${node.id}`}>
                        {node.connections?.cites?.map(targetId => {
                            const target = data.nodes.find(n => n.id === targetId);
                            if (!target) return null;
                            return (
                                <line 
                                    key={`${node.id}-${targetId}`}
                                    x1={mapX(node.x)} 
                                    y1={mapY(node.y)} 
                                    x2={mapX(target.x)} 
                                    y2={mapY(target.y)} 
                                    stroke="#475569" 
                                    strokeWidth="1.5"
                                    opacity="0.4"
                                />
                            );
                        })}
                         {node.connections?.cited_by?.map(sourceId => {
                            const source = data.nodes.find(n => n.id === sourceId);
                            if (!source) return null;
                            // Source cites Node (Source -> Node)
                            return (
                                <line 
                                    key={`${sourceId}-${node.id}`}
                                    x1={mapX(source.x)} 
                                    y1={mapY(source.y)} 
                                    x2={mapX(node.x)} 
                                    y2={mapY(node.y)} 
                                    stroke="#475569" 
                                    strokeWidth="1.5"
                                    markerEnd="url(#arrowhead)"
                                    opacity="0.4"
                                />
                            );
                        })}
                    </g>
                ))}

                {/* Nodes */}
                {data?.nodes?.map(node => (
                    <g 
                        key={node.id} 
                        onClick={() => setSelectedNode(node)}
                        className="cursor-pointer transition-all hover:opacity-80"
                    >
                        {/* Shadow/Glow */}
                        <circle 
                            cx={mapX(node.x)} 
                            cy={mapY(node.y)} 
                            r={node.type === 'root' ? 25 : 15} 
                            fill={node.color} 
                            opacity="0.2"
                            className="animate-pulse"
                        />
                        {/* Main Circle */}
                        <circle 
                            cx={mapX(node.x)} 
                            cy={mapY(node.y)} 
                            r={node.type === 'root' ? 12 : 8} 
                            fill={node.color} 
                            stroke="#0f172a"
                            strokeWidth="2"
                        />
                        {/* Label */}
                        <text 
                            x={mapX(node.x)} 
                            y={mapY(node.y) + (node.type === 'root' ? 35 : 25)} 
                            textAnchor="middle" 
                            fill="#cbd5e1" 
                            fontSize={node.type === 'root' ? "14" : "11"}
                            fontWeight={node.type === 'root' ? "bold" : "normal"}
                            className="pointer-events-none select-none"
                        >
                            {node.title.length > 20 ? node.title.substring(0, 18) + '...' : node.title}
                        </text>
                        <text 
                            x={mapX(node.x)} 
                            y={mapY(node.y) + (node.type === 'root' ? 50 : 38)} 
                            textAnchor="middle" 
                            fill="#64748b" 
                            fontSize="10"
                            className="pointer-events-none select-none"
                        >
                            {node.year}
                        </text>
                    </g>
                ))}
            </svg>
          </div>
        </div>

        {/* Sidebar Info Panel */}
        <div className="w-80 border-l border-slate-800 bg-slate-900 overflow-y-auto p-6 space-y-8 shrink-0">
           {selectedNode ? (
             <div className="animate-in slide-in-from-right duration-300">
                <div className="flex items-center gap-2 mb-4">
                    <span 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: selectedNode.color }} 
                    />
                    <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                        {selectedNode.type}
                    </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                    {selectedNode.title}
                </h3>
                <p className="text-sm text-slate-400 mb-4 font-mono">
                    {selectedNode.authors?.join(', ')} • {selectedNode.year}
                </p>
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 mb-6">
                    <p className="text-sm leading-relaxed text-slate-300">
                        {selectedNode.summary}
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800 p-3 rounded-lg text-center">
                        <div className="text-xs text-slate-500 uppercase">Citations</div>
                        <div className="text-lg font-bold text-white">{selectedNode.citations?.toLocaleString() ?? 0}</div>
                    </div>
                     <div className="bg-slate-800 p-3 rounded-lg text-center">
                        <div className="text-xs text-slate-500 uppercase">Impact Score</div>
                        <div className="text-lg font-bold text-white">{selectedNode.impact_score?.toFixed(1) ?? '0.0'}</div>
                    </div>
                </div>
             </div>
           ) : (
             <div className="text-center text-slate-500 mt-10">
                 <Info size={32} className="mx-auto mb-4 opacity-50" />
                 <p>Select a node to view paper details</p>
             </div>
           )}

           {data && data.gaps && data.gaps.length > 0 && (
               <div className="pt-6 border-t border-slate-800">
                   <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                       <AlertTriangle size={14} className="text-amber-500" />
                       Research Gaps
                   </h4>
                   <ul className="space-y-3">
                       {data.gaps.map((gap, i) => (
                           <li key={i} className="text-sm text-slate-400 pl-3 border-l-2 border-slate-700 hover:border-amber-500 transition-colors">
                               {gap}
                           </li>
                       ))}
                   </ul>
               </div>
           )}

            {data && data.milestones && data.milestones.length > 0 && (
               <div className="pt-6 border-t border-slate-800">
                   <h4 className="text-sm font-bold text-white mb-4">Milestones</h4>
                   <div className="space-y-4">
                       {data.milestones.map((m, i) => (
                           <div key={i} className="relative pl-4 pb-4 border-l border-slate-700 last:border-0 last:pb-0">
                               <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-sky-600 border-2 border-slate-900" />
                               <span className="text-xs font-mono text-sky-400 block mb-1">{m.year}</span>
                               <p className="text-sm text-slate-300">{m.event}</p>
                           </div>
                       ))}
                   </div>
               </div>
           )}
        </div>
      </div>
    </div>
  );
};
