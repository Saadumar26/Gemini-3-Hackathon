
import React, { useState } from 'react';
import { PaperInput } from './components/PaperInput';
import { Sidebar } from './components/Sidebar';
import { ChatInterface } from './components/ChatInterface';
import { AnalysisView } from './components/AnalysisView';
import { ReaderView } from './components/ReaderView';
import { RoadmapView } from './components/RoadmapView';
import { AnalysisMode, PaperData, Message, RoadmapResponse } from './types';
import { analyzePaper, chatWithPaper, searchForPaper, explainSelection, generateLearningRoadmap } from './services/gemini';

export default function App() {
  const [paper, setPaper] = useState<PaperData | null>(null);
  const [mode, setMode] = useState<AnalysisMode>(AnalysisMode.SUMMARY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  
  // State for different analysis results
  const [summary, setSummary] = useState<string | null>(null);
  const [gaps, setGaps] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<string | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
  
  // Chat State
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  const handlePaperLoaded = (title: string, content: string, source: 'search' | 'upload' | 'demo') => {
    setPaper({ title, content, source });
    // Reset all states
    setSummary(null);
    setGaps(null);
    setPredictions(null);
    setRoadmap(null);
    setChatHistory([]);
    setMode(AnalysisMode.SUMMARY);
    setError(undefined);
  };

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(undefined);
    try {
      return await searchForPaper(query);
    } catch (e: any) {
      setError(e.message || "Search failed.");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const runAnalysis = async (type: 'SUMMARY' | 'GAPS' | 'PREDICTIONS') => {
    if (!paper) return;
    setLoading(true);
    setError(undefined);
    try {
      const result = await analyzePaper(paper.content, type);
      if (type === 'SUMMARY') setSummary(result);
      if (type === 'GAPS') setGaps(result);
      if (type === 'PREDICTIONS') setPredictions(result);
    } catch (e: any) {
      console.error(e);
      setError(e.message || `Failed to generate ${type.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRoadmap = async () => {
    if (!paper) return;
    setLoading(true);
    setError(undefined);
    try {
        const result = await generateLearningRoadmap(paper.title, paper.content, paper.arxivId);
        setRoadmap(result);
    } catch (e: any) {
        console.error(e);
        setError(e.message || "Failed to generate roadmap.");
    } finally {
        setLoading(false);
    }
  };

  const handleExplainSelection = async (selection: string) => {
    if (!paper) return "";
    return await explainSelection(paper.content, selection);
  };

  const handleSendMessage = async (msg: string) => {
    if (!paper) return;
    const newMessage: Message = { role: 'user', content: msg, timestamp: Date.now() };
    setChatHistory(prev => [...prev, newMessage]);
    setChatLoading(true);

    try {
      const response = await chatWithPaper(paper.content, chatHistory, msg);
      const botMessage: Message = { role: 'model', content: response, timestamp: Date.now() };
      setChatHistory(prev => [...prev, botMessage]);
    } catch (e: any) {
      console.error(e);
      const errorMessage: Message = { 
        role: 'model', 
        content: `⚠️ **Error**: ${e.message || "An unexpected error occurred."}`, 
        timestamp: Date.now() 
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setChatLoading(false);
    }
  };

  const changeMode = (newMode: AnalysisMode) => {
    setMode(newMode);
    setError(undefined);
  };

  if (!paper) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-900/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/10 rounded-full blur-[100px]" />
        </div>
        
        <PaperInput 
          onPaperLoaded={handlePaperLoaded} 
          isLoading={loading} 
          onSearch={handleSearch} 
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      <Sidebar 
        currentMode={mode} 
        onModeChange={changeMode} 
        paperTitle={paper.title}
        onReset={() => setPaper(null)}
      />
      
      <main className="flex-1 flex flex-col h-full relative">
        {mode === AnalysisMode.SUMMARY && (
          <AnalysisView
            title="Structured Summary"
            content={summary}
            isLoading={loading}
            error={error}
            onGenerate={() => runAnalysis('SUMMARY')}
          />
        )}
        
        {mode === AnalysisMode.GAPS && (
          <AnalysisView
            title="Research Gap Analysis"
            content={gaps}
            isLoading={loading}
            error={error}
            onGenerate={() => runAnalysis('GAPS')}
          />
        )}
        
        {mode === AnalysisMode.PREDICTIONS && (
          <AnalysisView
            title="Future Trajectory & Predictions"
            content={predictions}
            isLoading={loading}
            error={error}
            onGenerate={() => runAnalysis('PREDICTIONS')}
          />
        )}

        {mode === AnalysisMode.READER && (
          <ReaderView 
            content={paper.content} 
            onExplain={handleExplainSelection}
          />
        )}

        {mode === AnalysisMode.ROADMAP && (
            <RoadmapView
                data={roadmap}
                isLoading={loading}
                error={error}
                onGenerate={handleGenerateRoadmap}
                title={paper.title}
            />
        )}

        {mode === AnalysisMode.CHAT && (
          <ChatInterface 
            messages={chatHistory} 
            onSendMessage={handleSendMessage}
            isLoading={chatLoading}
          />
        )}
      </main>
    </div>
  );
}
