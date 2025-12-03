import React, { useState } from 'react';
import { Activity, ProductContext } from '../types';
import { triggerHaptic } from '../services/utils';

interface MegaPromptViewerProps {
  activity: Activity | null;
  productContext: ProductContext;
  onRun: (prompt: string) => void;
}

type TabType = 'MEGA' | 'OKR';

const MegaPromptViewer: React.FC<MegaPromptViewerProps> = ({ activity, productContext, onRun }) => {
  const [activeTab, setActiveTab] = useState<TabType>('MEGA');

  if (!activity) {
    return (
      <section aria-label="Mega Prompt Viewer" className="h-full flex items-center justify-center text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 p-8 glass-panel">
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          <p>Hover over or select a timeline activity to see its Mega Prompt</p>
        </div>
      </section>
    );
  }

  // Determine which template to use based on active tab
  const rawTemplate = activeTab === 'MEGA' 
    ? activity.megaPromptTemplate 
    : (activity.okrPromptTemplate || "No OKR prompt defined for this activity.");

  // Replace placeholders in template
  const compiledPrompt = rawTemplate
    .replace(/\${productName}/g, productContext.name || '[Product Name]')
    .replace(/\${productDescription}/g, productContext.description || '[Product Description]')
    .replace(/\${productGoals}/g, productContext.goals || '[Goals]');

  const handleRun = () => {
    triggerHaptic();
    onRun(compiledPrompt);
  };

  return (
    <section aria-label="Prompt Details" className="glass-panel bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-brand-200 dark:border-slate-700 overflow-hidden h-full flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-brand-600 to-brand-500 dark:from-brand-800 dark:to-brand-700 pt-4 px-4 pb-0 text-white shadow-sm flex flex-col">
        <div className="mb-3">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            {activity.title}
          </h3>
          <p className="text-brand-100 text-sm mt-1 opacity-90 line-clamp-1">{activity.description}</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mt-1" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'MEGA'}
            onClick={() => { triggerHaptic(); setActiveTab('MEGA'); }}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-600 ${
              activeTab === 'MEGA' 
                ? 'bg-slate-50 dark:bg-slate-800 text-brand-700 dark:text-brand-300 shadow-sm' 
                : 'text-brand-100 hover:bg-brand-500/50 hover:text-white'
            }`}
          >
            Mega Prompt
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'OKR'}
            onClick={() => { triggerHaptic(); setActiveTab('OKR'); }}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-600 ${
              activeTab === 'OKR' 
                ? 'bg-slate-50 dark:bg-slate-800 text-brand-700 dark:text-brand-300 shadow-sm' 
                : 'text-brand-100 hover:bg-brand-500/50 hover:text-white'
            }`}
          >
            OKR Prompt
          </button>
        </div>
      </header>
      
      {/* Content */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900 flex-grow overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              {activeTab === 'MEGA' ? 'Instructions for LLM' : 'OKR Generation Logic'}
            </span>
            {activeTab === 'OKR' && (
              <span className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                Focus: Objectives & Key Results
              </span>
            )}
        </div>
        
        <div 
          className="bg-slate-800 text-slate-200 p-4 rounded-md font-mono text-sm leading-relaxed shadow-inner border border-slate-700 whitespace-pre-wrap flex-grow overflow-auto"
          role="region"
          aria-label="Prompt Content"
          tabIndex={0}
        >
            {compiledPrompt}
        </div>
        
        <div className="mt-4 flex gap-2 justify-between items-center">
           <div className="flex gap-2">
             <button 
               className="text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 px-3 py-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1 focus:ring-2 focus:ring-brand-500"
               onClick={() => { triggerHaptic(); navigator.clipboard.writeText(compiledPrompt); }}
               aria-label="Copy prompt to clipboard"
             >
               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
               Copy
             </button>
           </div>
           
           <button 
             className="px-4 py-1.5 bg-brand-600 text-white text-xs font-bold rounded shadow-sm flex items-center gap-2 transition-all hover:bg-brand-700 focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
             onClick={handleRun}
           >
             <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
             Run with Gemini
           </button>
        </div>
      </div>
    </section>
  );
};

export default MegaPromptViewer;