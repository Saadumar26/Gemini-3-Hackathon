
export enum AnalysisMode {
  CHAT = 'CHAT',
  SUMMARY = 'SUMMARY',
  GAPS = 'GAPS',
  PREDICTIONS = 'PREDICTIONS',
  READER = 'READER',
  ROADMAP = 'ROADMAP'
}

export interface PaperData {
  title: string;
  authors?: string[];
  content: string; // The full text or abstract
  source: 'upload' | 'search' | 'demo';
  arxivId?: string;
}

export interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface AnalysisResult {
  markdown: string;
  loading: boolean;
  error?: string;
}

export interface ProcessingState {
  isSearching: boolean;
  isAnalyzing: boolean;
  currentTask: string;
}

export interface RoadmapConcept {
  name: string;
  definition: string;
}

export interface RoadmapPaper {
  title: string;
  arxiv_id: string;
  link: string;
  reason: string;
}

export interface RoadmapStep {
  step: number;
  concept: RoadmapConcept;
  recommended_papers: RoadmapPaper[];
}

export interface RoadmapResponse {
  target_paper: {
    title: string;
    arxiv_id: string;
    link: string;
  };
  roadmap: RoadmapStep[];
  error?: string;
}

export interface GenealogyNode {
  id: string;
  title: string;
  year: number;
  authors?: string[];
  summary?: string;
  citations?: number;
  impact_score?: number;
  x: number;
  y: number;
  type: string;
  color: string;
  connections?: {
    cites?: string[];
    cited_by?: string[];
  };
}

export interface GenealogyResponse {
  topic: string;
  nodes: GenealogyNode[];
  gaps?: string[];
  milestones?: { year: number; event: string }[];
  error?: string;
}
