import React, { useState, useEffect } from 'react';
import Timeline from './components/Timeline';
import ProductContextForm from './components/ProductContextForm';
import MegaPromptViewer from './components/MegaPromptViewer';
import OKRResult from './components/OKRResult';
import TrendingSidebar from './components/TrendingSidebar';
import PromptResult from './components/PromptResult';
import Motivator from './components/Motivator';
import HelpModal from './components/HelpModal';
import { Activity, ProductContext, OKR, TrendingProject, Stage } from './types';
import { generateOKRs, runGenericPrompt, generateCustomTimeline } from './services/geminiService';
import { triggerHaptic } from './services/utils';
import { TIMELINE_DATA } from './constants';

type Theme = 'light' | 'dark' | 'high-contrast' | 'art';

const App: React.FC = () => {
  const [productContext, setProductContext] = useState<ProductContext>({
    name: 'New AI Product',
    description: 'A revolutionary tool that uses LLMs to automate mundane tasks.',
    goals: 'Launch MVP in 3 months and get 500 active users.'
  });
  
  // Dynamic Timeline Data State
  const [timelineData, setTimelineData] = useState<Stage[]>(TIMELINE_DATA);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);

  const [hoveredActivity, setHoveredActivity] = useState<Activity | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [okrs, setOkrs] = useState<OKR[]>([]);
  const [isGeneratingOKRs, setIsGeneratingOKRs] = useState(false);
  const [isFormCollapsed, setIsFormCollapsed] = useState(false);
  const [promptOutput, setPromptOutput] = useState<string>('');
  const [isRunningPrompt, setIsRunningPrompt] = useState(false);
  const [showPromptResult, setShowPromptResult] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  // Theme & UI State
  const [theme, setTheme] = useState<Theme>('light');
  const [searchTerm, setSearchTerm] = useState('');

  // Apply theme class to body/html
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'high-contrast', 'theme-art');
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'high-contrast') {
      root.classList.add('high-contrast');
    } else if (theme === 'art') {
      root.classList.add('dark', 'theme-art'); // Art mode builds on dark mode
    }
  }, [theme]);

  const toggleTheme = () => {
    triggerHaptic();
    setTheme(prev => {
       if (prev === 'light') return 'dark';
       if (prev === 'dark') return 'art';
       if (prev === 'art') return 'high-contrast';
       return 'light';
    });
  };

  const handleTrendingProjectSelect = (project: TrendingProject) => {
    setProductContext({
      name: project.title,
      description: project.description,
      goals: `Build MVP using ${project.techStack.join(', ')}.`
    });
    setIsFormCollapsed(false);
  };

  const handleGenerateRoadmap = async () => {
    triggerHaptic();
    setIsGeneratingRoadmap(true);
    try {
      const customStages = await generateCustomTimeline(productContext);
      if (customStages.length > 0) {
        setTimelineData(customStages);
        setIsFormCollapsed(true); // Auto collapse form on success to show timeline
      }
    } catch (e) {
      console.error("Failed to generate custom roadmap", e);
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  const handleActivityClick = async (activity: Activity) => {
    setSelectedActivity(activity);
    setIsGeneratingOKRs(true);
    setTimeout(() => {
        const element = document.getElementById('okr-section');
        if (element) {
           element.scrollIntoView({ behavior: 'smooth' });
        }
    }, 100);

    try {
      const results = await generateOKRs(activity, productContext);
      setOkrs(results);
    } catch (error) {
      console.error("Error generating OKRs", error);
    } finally {
      setIsGeneratingOKRs(false);
    }
  };

  const handleRunPrompt = async (prompt: string) => {
    setPromptOutput('');
    setShowPromptResult(true);
    setIsRunningPrompt(true);

    try {
      const result = await runGenericPrompt(prompt);
      setPromptOutput(result);
    } catch (error) {
      setPromptOutput("An error occurred while running the prompt.");
    } finally {
      setIsRunningPrompt(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans text-slate-800 dark:text-slate-100 transition-colors duration-300 ${theme === 'art' ? 'theme-art' : ''}`}>
      
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 bg-brand-600 text-white px-4 py-2 rounded shadow-lg">
        Skip to main content
      </a>

      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm sticky top-0 z-50 glass-panel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-500/30">
               G
             </div>
             <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight hidden sm:block">Gen AI PM Timeline Genius</h1>
             <span className="sm:hidden text-lg font-bold">Gen AI PM</span>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Author Credit */}
             <span className="text-xs text-slate-400 dark:text-slate-500 hidden md:inline-block">
               Author: BalajiDuddukuri
             </span>

             {/* Search Bar */}
             <div className="relative hidden sm:block">
               <input 
                 type="text" 
                 placeholder="Search timeline..." 
                 className="pl-8 pr-4 py-1.5 text-sm rounded-full bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-brand-500 w-48 transition-all focus:w-64"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 aria-label="Filter timeline activities"
               />
               <svg className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             </div>

             {/* Help Button */}
             <button
               onClick={() => setShowHelp(true)}
               className="w-8 h-8 flex items-center justify-center rounded-full text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/50 transition-colors focus:ring-2 focus:ring-brand-500"
               title="Help & Documentation"
               aria-label="Open Help"
             >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </button>

             {/* Theme Toggle */}
             <button 
               onClick={toggleTheme}
               className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 focus:ring-2 focus:ring-brand-500"
               aria-label={`Current theme: ${theme}. Click to switch theme.`}
               title="Toggle Theme"
             >
               {theme === 'light' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
               {theme === 'dark' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
               {theme === 'high-contrast' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
               {theme === 'art' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>}
             </button>
          </div>
        </div>
      </header>

      <main id="main-content" className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full outline-none" tabIndex={-1}>
        
        {/* Motivator Banner */}
        <Motivator />

        {/* Top Section: Form + Mega Prompt */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 flex flex-col">
            <ProductContextForm 
              onChange={setProductContext} 
              onGenerateRoadmap={handleGenerateRoadmap}
              isCollapsed={isFormCollapsed}
              toggleCollapse={() => setIsFormCollapsed(!isFormCollapsed)}
              currentContext={productContext}
              isGeneratingRoadmap={isGeneratingRoadmap}
            />
            
            <section className="glass-panel bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-1 flex-grow">
               <header className="p-4 border-b border-slate-100 dark:border-slate-700 mb-2 flex justify-between items-center">
                 <div>
                   <h2 className="text-xl font-bold text-slate-800 dark:text-white">Product Roadmap & Prompts</h2>
                   <p className="text-sm text-slate-500 dark:text-slate-400">Select a lifecycle stage to generate AI prompts.</p>
                 </div>
                 {timelineData !== TIMELINE_DATA && (
                    <span className="text-xs bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 px-2 py-1 rounded-full font-bold">
                       Custom Generated
                    </span>
                 )}
               </header>
               <Timeline 
                  stages={timelineData}
                  onActivityHover={setHoveredActivity}
                  onActivityClick={handleActivityClick}
                  selectedActivity={selectedActivity}
                  searchTerm={searchTerm}
               />
            </section>
          </div>

          <aside className="lg:col-span-1 h-full flex flex-col gap-6">
             {/* Mega Prompt Viewer (Sticky) */}
             <div className="flex-grow min-h-[300px]">
               <MegaPromptViewer 
                 activity={hoveredActivity || selectedActivity} 
                 productContext={productContext}
                 onRun={handleRunPrompt}
               />
             </div>
             {/* Trending Projects */}
             <div className="h-1/3 min-h-[250px]">
               <TrendingSidebar onSelectProject={handleTrendingProjectSelect} />
             </div>
          </aside>
        </div>

        {/* Bottom Section: OKR Results */}
        <div id="okr-section" className="mb-12">
          {selectedActivity && (
             <OKRResult 
               okrs={okrs} 
               isLoading={isGeneratingOKRs} 
               targetActivity={selectedActivity}
             />
          )}
        </div>

      </main>

      <footer className="bg-slate-900 dark:bg-black text-slate-400 py-8 mt-auto border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© 2025 Gen AI PM Inc. | Author: BalajiDuddukuri</p>
        </div>
      </footer>

      {/* Prompt Result Modal Overlay */}
      {showPromptResult && (
        <PromptResult 
          output={promptOutput}
          isLoading={isRunningPrompt}
          onClose={() => setShowPromptResult(false)}
        />
      )}

      {/* Help Modal */}
      {showHelp && (
        <HelpModal onClose={() => setShowHelp(false)} />
      )}
    </div>
  );
};

export default App;