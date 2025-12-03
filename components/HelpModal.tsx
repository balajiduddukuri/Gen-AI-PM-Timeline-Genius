import React, { useEffect, useRef } from 'react';

interface HelpModalProps {
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Focus trap and escape key listener
    if (closeBtnRef.current) {
        closeBtnRef.current.focus();
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-title"
    >
      <div 
        ref={modalRef}
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 animate-fade-in-up"
      >
        <header className="bg-brand-600 dark:bg-brand-800 p-4 flex justify-between items-center text-white">
          <h2 id="help-title" className="text-xl font-bold flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            How to Use Timeline Genius
          </h2>
          <button 
            ref={closeBtnRef}
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close Help"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>
        
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh] text-slate-700 dark:text-slate-300 leading-relaxed">
          
          <section>
            <h3 className="font-bold text-lg text-brand-600 dark:text-brand-400 mb-2">1. Define Your Context</h3>
            <p>Start by entering your <strong>Product Name</strong>, <strong>Description</strong>, and <strong>Goals</strong> in the top form. This context is injected into every AI prompt to make it specific to your product.</p>
            <div className="mt-2 text-sm bg-slate-100 dark:bg-slate-800 p-2 rounded border-l-4 border-brand-500">
               <strong>Tip:</strong> You can paste a YouTube URL of a tech talk to automatically extract product context!
            </div>
          </section>

          <section>
            <h3 className="font-bold text-lg text-brand-600 dark:text-brand-400 mb-2">2. Generate Your Roadmap</h3>
            <p>You can use the default timeline or click <strong>"Generate AI Roadmap"</strong> to have Gemini build a custom 4-stage project plan tailored specifically to your product goals.</p>
          </section>

          <section>
            <h3 className="font-bold text-lg text-brand-600 dark:text-brand-400 mb-2">3. Explore Mega Prompts</h3>
            <p>Hover over or click any activity in the timeline (e.g., "Problem Definition"). The <strong>Mega Prompt Viewer</strong> on the right will show you a sophisticated prompt template, pre-filled with your product details.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
               <li><strong>Copy:</strong> Copy the prompt to use in ChatGPT or Gemini Advanced.</li>
               <li><strong>Run:</strong> Click "Run with Gemini" to execute it immediately and see the results.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-lg text-brand-600 dark:text-brand-400 mb-2">4. Generate OKRs</h3>
            <p>Clicking an activity card also automatically generates <strong>Objectives and Key Results (OKRs)</strong> for that specific task. These appear at the bottom of the screen.</p>
          </section>

        </div>

        <footer className="bg-slate-50 dark:bg-slate-800 p-4 border-t border-slate-200 dark:border-slate-700 text-center">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-brand-600 text-white font-medium rounded-md shadow hover:bg-brand-700 transition-colors"
          >
            Got it, let's build!
          </button>
        </footer>
      </div>
    </div>
  );
};

export default HelpModal;
