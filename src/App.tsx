import React, { useState, useMemo, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";
import { 
  Settings, 
  Moon, 
  Sun, 
  Languages, 
  FileText, 
  Layout, 
  ClipboardList, 
  CheckCircle2, 
  MessageSquare, 
  ChevronRight, 
  ChevronLeft,
  Loader2,
  Edit3,
  Save,
  Palette,
  Sparkles
} from 'lucide-react';
import { PANTONE_STYLES, TRANSLATIONS } from './constants';
import { AppState, Language, Theme } from './types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function App() {
  const [state, setState] = useState<AppState>({
    language: 'en',
    theme: 'light',
    styleId: 'classic-blue',
    reviewNote: '',
    organizedDoc: '',
    instructions: '',
    sampleReport: '',
    finalReport: '',
    followUpQuestions: [],
    isGenerating: false,
    currentStep: 1,
  });

  const [isEditing, setIsEditing] = useState(false);
  const t = TRANSLATIONS[state.language];
  const currentStyle = useMemo(() => 
    PANTONE_STYLES.find(s => s.id === state.styleId) || PANTONE_STYLES[0]
  , [state.styleId]);

  // Apply theme and style to root
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', state.theme === 'dark');
    
    // Update CSS variables based on Pantone style
    root.style.setProperty('--primary', currentStyle.primary);
    root.style.setProperty('--secondary', currentStyle.secondary);
    
    if (state.theme === 'dark') {
      root.style.setProperty('--background', '#0A0A0A');
      root.style.setProperty('--card', '#141414');
      root.style.setProperty('--foreground', '#F9FAFB');
    } else {
      root.style.setProperty('--background', '#FFFFFF');
      root.style.setProperty('--card', '#FFFFFF');
      root.style.setProperty('--foreground', '#1A1A1A');
    }
  }, [state.theme, currentStyle]);

  const generateOrganizedDoc = async () => {
    if (!state.reviewNote) return;
    setState(prev => ({ ...prev, isGenerating: true }));
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `You are a Medical Device Regulatory Expert. 
        Transform the following 510(k) submission review notes into a highly organized, professional document in Markdown.
        Language: ${state.language === 'en' ? 'English' : 'Traditional Chinese (繁體中文)'}.
        Use clear headings, bullet points, and tables where appropriate. 
        Highlight critical regulatory terms in bold.
        
        Notes:
        ${state.reviewNote}`,
      });
      setState(prev => ({ 
        ...prev, 
        organizedDoc: response.text || '', 
        isGenerating: false,
        currentStep: 2
      }));
    } catch (error) {
      console.error(error);
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const generateFinalReport = async () => {
    setState(prev => ({ ...prev, isGenerating: true }));
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `You are a Medical Device Regulatory Expert. 
        Create a comprehensive 510(k) Review Report based on the organized notes and provided instructions/sample.
        Language: ${state.language === 'en' ? 'English' : 'Traditional Chinese (繁體中文)'}.
        
        Organized Notes:
        ${state.organizedDoc}
        
        Instructions/Sample:
        ${state.instructions}
        ${state.sampleReport}
        
        The report should be in Markdown format, professional, and ready for submission.`,
      });
      setState(prev => ({ 
        ...prev, 
        finalReport: response.text || '', 
        isGenerating: false,
        currentStep: 4
      }));
    } catch (error) {
      console.error(error);
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Simple toast-like feedback could be added here
  };

  const generateFollowUps = async () => {
    setState(prev => ({ ...prev, isGenerating: true }));
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `Based on the following 510(k) Review Report, generate exactly 20 comprehensive follow-up questions that a regulatory reviewer might ask to clarify or challenge the submission.
        Language: ${state.language === 'en' ? 'English' : 'Traditional Chinese (繁體中文)'}.
        Return the questions as a simple numbered list in Markdown.
        
        Report:
        ${state.finalReport}`,
      });
      
      const questions = (response.text || '')
        .split('\n')
        .filter(line => /^\d+\./.test(line.trim()))
        .map(line => line.replace(/^\d+\.\s*/, '').trim());

      setState(prev => ({ 
        ...prev, 
        followUpQuestions: questions, 
        isGenerating: false,
        currentStep: 5
      }));
    } catch (error) {
      console.error(error);
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const steps = [
    { id: 1, icon: FileText, label: t.step1 },
    { id: 2, icon: Layout, label: t.step2 },
    { id: 3, icon: ClipboardList, label: t.step3 },
    { id: 4, icon: CheckCircle2, label: t.step4 },
    { id: 5, icon: MessageSquare, label: t.step5 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: currentStyle.primary }}>
              <Sparkles size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none">{t.title}</h1>
              <p className="text-xs text-gray-500 mt-1">{t.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <button 
              onClick={() => setState(prev => ({ ...prev, language: prev.language === 'en' ? 'zh-TW' : 'en' }))}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <Languages size={18} />
              <span className="hidden sm:inline">{state.language === 'en' ? 'EN' : '繁中'}</span>
            </button>

            {/* Theme Toggle */}
            <button 
              onClick={() => setState(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }))}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {state.theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Style Selector */}
            <div className="relative group">
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm font-medium">
                <Palette size={18} />
                <span className="hidden sm:inline">{currentStyle.name}</span>
              </button>
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2 grid grid-cols-2 gap-1">
                {PANTONE_STYLES.map(style => (
                  <button
                    key={style.id}
                    onClick={() => setState(prev => ({ ...prev, styleId: style.id }))}
                    className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${state.styleId === style.id ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                  >
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: style.primary }} />
                    <span className="truncate">{style.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 flex flex-col gap-8">
        {/* Step Indicator */}
        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 p-2 rounded-2xl border border-gray-200 dark:border-gray-800">
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <button
                onClick={() => setState(prev => ({ ...prev, currentStep: step.id }))}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${state.currentStep === step.id ? 'bg-white dark:bg-gray-800 shadow-sm' : 'opacity-50 hover:opacity-100'}`}
              >
                <step.icon size={20} className={state.currentStep === step.id ? 'text-primary' : ''} style={{ color: state.currentStep === step.id ? currentStyle.primary : undefined }} />
                <span className="text-[10px] font-bold uppercase tracking-wider">{step.label}</span>
              </button>
              {idx < steps.length - 1 && <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800 mx-2 hidden sm:block" />}
            </React.Fragment>
          ))}
        </div>

        {/* Dynamic Step Content */}
        <div className="flex-1 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {state.currentStep === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col gap-4 h-full"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold tracking-tight">{t.noteInput}</h2>
                  <button 
                    onClick={generateOrganizedDoc}
                    disabled={!state.reviewNote || state.isGenerating}
                    className="px-6 py-2.5 rounded-xl font-bold text-white flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                    style={{ backgroundColor: currentStyle.primary }}
                  >
                    {state.isGenerating ? <Loader2 className="animate-spin" size={18} /> : <ChevronRight size={18} />}
                    {t.organizeBtn}
                  </button>
                </div>
                <textarea
                  value={state.reviewNote}
                  onChange={(e) => setState(prev => ({ ...prev, reviewNote: e.target.value }))}
                  placeholder={t.notePlaceholder}
                  className="flex-1 min-h-[400px] p-6 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-black focus:border-primary outline-none transition-all font-mono text-sm resize-none"
                  style={{ borderColor: state.reviewNote ? currentStyle.primary + '40' : undefined }}
                />
              </motion.div>
            )}

            {state.currentStep === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col gap-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold tracking-tight">{t.organizedTitle}</h2>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(state.organizedDoc);
                        alert('Copied to clipboard!');
                      }}
                      className="px-4 py-2 rounded-xl font-bold border border-gray-200 dark:border-gray-800 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                    >
                      Copy
                    </button>
                    <button 
                      onClick={() => setIsEditing(!isEditing)}
                      className="px-4 py-2 rounded-xl font-bold border border-gray-200 dark:border-gray-800 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                    >
                      {isEditing ? <Save size={18} /> : <Edit3 size={18} />}
                      {isEditing ? t.save : t.edit}
                    </button>
                    <button 
                      onClick={() => setState(prev => ({ ...prev, currentStep: 3 }))}
                      className="px-6 py-2 rounded-xl font-bold text-white flex items-center gap-2 transition-all hover:scale-105"
                      style={{ backgroundColor: currentStyle.primary }}
                    >
                      {t.next} <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
                <div className="p-8 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-xl">
                  {isEditing ? (
                    <textarea
                      value={state.organizedDoc}
                      onChange={(e) => setState(prev => ({ ...prev, organizedDoc: e.target.value }))}
                      className="w-full min-h-[500px] p-4 font-mono text-sm outline-none bg-transparent resize-none"
                    />
                  ) : (
                    <div className="markdown-body">
                      {state.organizedDoc.split('\n').map((line, i) => {
                        // Simple custom renderer for the "Organized Doc"
                        if (line.startsWith('# ')) return <h1 key={i}>{line.slice(2)}</h1>;
                        if (line.startsWith('## ')) return <h2 key={i}>{line.slice(3)}</h2>;
                        if (line.startsWith('### ')) return <h3 key={i}>{line.slice(4)}</h3>;
                        if (line.startsWith('- ')) return <li key={i}>{line.slice(2)}</li>;
                        return <p key={i}>{line}</p>;
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {state.currentStep === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col gap-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold tracking-tight">{t.instructionsTitle}</h2>
                  <button 
                    onClick={generateFinalReport}
                    disabled={state.isGenerating}
                    className="px-6 py-2.5 rounded-xl font-bold text-white flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
                    style={{ backgroundColor: currentStyle.primary }}
                  >
                    {state.isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                    {t.generateReportBtn}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase text-gray-500 tracking-widest">Instructions</label>
                    <textarea
                      value={state.instructions}
                      onChange={(e) => setState(prev => ({ ...prev, instructions: e.target.value }))}
                      placeholder="Enter specific report instructions..."
                      className="h-[300px] p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black outline-none focus:border-primary transition-all resize-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase text-gray-500 tracking-widest">Sample Report</label>
                    <textarea
                      value={state.sampleReport}
                      onChange={(e) => setState(prev => ({ ...prev, sampleReport: e.target.value }))}
                      placeholder="Paste a sample report for style matching..."
                      className="h-[300px] p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black outline-none focus:border-primary transition-all resize-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {state.currentStep === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col gap-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold tracking-tight">{t.reportTitle}</h2>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(state.finalReport);
                        alert('Copied to clipboard!');
                      }}
                      className="px-4 py-2 rounded-xl font-bold border border-gray-200 dark:border-gray-800 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                    >
                      Copy
                    </button>
                    <button 
                      onClick={() => setIsEditing(!isEditing)}
                      className="px-4 py-2 rounded-xl font-bold border border-gray-200 dark:border-gray-800 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                    >
                      {isEditing ? <Save size={18} /> : <Edit3 size={18} />}
                      {isEditing ? t.save : t.edit}
                    </button>
                    <button 
                      onClick={generateFollowUps}
                      disabled={state.isGenerating}
                      className="px-6 py-2 rounded-xl font-bold text-white flex items-center gap-2 transition-all hover:scale-105"
                      style={{ backgroundColor: currentStyle.primary }}
                    >
                      {t.next} <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
                <div className="p-10 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-2xl">
                  {isEditing ? (
                    <textarea
                      value={state.finalReport}
                      onChange={(e) => setState(prev => ({ ...prev, finalReport: e.target.value }))}
                      className="w-full min-h-[600px] p-4 font-mono text-sm outline-none bg-transparent resize-none"
                    />
                  ) : (
                    <div className="markdown-body">
                      {state.finalReport.split('\n').map((line, i) => {
                        if (line.startsWith('# ')) return <h1 key={i}>{line.slice(2)}</h1>;
                        if (line.startsWith('## ')) return <h2 key={i}>{line.slice(3)}</h2>;
                        if (line.startsWith('### ')) return <h3 key={i}>{line.slice(4)}</h3>;
                        if (line.startsWith('- ')) return <li key={i}>{line.slice(2)}</li>;
                        return <p key={i}>{line}</p>;
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {state.currentStep === 5 && (
              <motion.div 
                key="step5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col gap-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold tracking-tight">{t.followUpTitle}</h2>
                  <button 
                    onClick={() => setState(prev => ({ ...prev, currentStep: 1 }))}
                    className="px-6 py-2 rounded-xl font-bold border border-gray-200 dark:border-gray-800 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                  >
                    Start New Review
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {state.followUpQuestions.map((q, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 flex gap-4 items-start"
                    >
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold" style={{ color: currentStyle.primary }}>
                        {i + 1}
                      </span>
                      <p className="text-sm leading-relaxed">{q}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${state.isGenerating ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
              <span>{state.isGenerating ? t.generating : 'System Ready'}</span>
            </div>
            <div className="h-3 w-px bg-gray-200 dark:bg-gray-800" />
            <span>Style: {currentStyle.name}</span>
          </div>
          <div>
            © 2026 SmartMed Review 4.3 • Regulatory Intelligence
          </div>
        </div>
      </footer>

      {/* Loading Overlay */}
      {state.isGenerating && (
        <div className="fixed inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 border border-gray-200 dark:border-gray-800">
            <Loader2 className="animate-spin text-primary" size={48} style={{ color: currentStyle.primary }} />
            <p className="font-bold text-lg animate-pulse">{t.generating}</p>
          </div>
        </div>
      )}
    </div>
  );
}
