import React, { useState, useEffect, useRef } from 'react';
import { triggerHaptic } from '../services/utils';

interface PromptResultProps {
  output: string;
  isLoading: boolean;
  onClose: () => void;
}

const PromptResult: React.FC<PromptResultProps> = ({ output, isLoading, onClose }) => {
  const [isCopied, setIsCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!output && !isLoading) return null;

  const handleCopy = async () => {
    if (!output) return;
    triggerHaptic();
    try {
      await navigator.clipboard.writeText(output);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const renderMarkdown = (text: string) => {
    if (!text) return null;
    
    // Split by lines to process block elements
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    
    let currentList: React.ReactNode[] = [];
    let inList = false;

    const flushList = () => {
      if (inList && currentList.length > 0) {
        elements.push(<ul key={`ul-${elements.length}`} className="list-disc pl-5 mb-4 space-y-1">{[...currentList]}</ul>);
        currentList = [];
        inList = false;
      }
    };

    const processInline = (line: string) => {
      // Bold: **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={index} className="font-bold text-slate-900 dark:text-slate-100">{part.slice(2, -2)}</strong>;
        }
        return <span key={index}>{part}</span>;
      });
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Headers
      if (trimmed.startsWith('### ')) {
        flushList();
        elements.push(<h4 key={index} className="text-lg font-bold text-brand-700 dark:text-brand-400 mt-6 mb-2">{trimmed.replace('### ', '')}</h4>);
        return;
      }
      if (trimmed.startsWith('## ')) {
        flushList();
        elements.push(<h3 key={index} className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-3 border-b border-slate-200 dark:border-slate-700 pb-1">{trimmed.replace('## ', '')}</h3>);
        return;
      }

      // Lists
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
        inList = true;
        const content = trimmed.replace(/^[-*•]\s+/, '');
        currentList.push(<li key={`${index}-li`} className="text-slate-700 dark:text-slate-300">{processInline(content)}</li>);
        return;
      }

      // Plain Text / Paragraph
      if (trimmed.length > 0) {
        flushList();
        elements.push(<p key={index} className="mb-3 text-slate-700 dark:text-slate-300 leading-relaxed">{processInline(line)}</p>);
      }
    });

    flushList(); // Flush any remaining list items
    return elements;
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        tabIndex={-1}
        className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[80vh] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up border border-slate-200 dark:border-slate-700 outline-none"
      >
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-brand-50 dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} aria-hidden="true"></div>
            <h3 id="modal-title" className="font-bold text-slate-800 dark:text-white text-lg">AI Response</h3>
          </div>
          <button 
            ref={closeButtonRef}
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full p-1 transition-colors focus:ring-2 focus:ring-brand-500"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-8 bg-white dark:bg-slate-900 markdown-body">
          {isLoading ? (
             <div className="space-y-4 animate-pulse max-w-2xl mx-auto" aria-busy="true" aria-label="Generating response">
               <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
               <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
               <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
               <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-lg mt-6"></div>
               <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
             </div>
          ) : (
            <div className="max-w-none text-slate-700 dark:text-slate-300">
               {renderMarkdown(output)}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 flex justify-between items-center">
          <div>
            {!isLoading && (
              <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 focus:ring-2 focus:ring-brand-500 ${
                  isCopied 
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' 
                    : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-400'
                }`}
              >
                {isCopied ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                    Copy Text
                  </>
                )}
              </button>
            )}
          </div>
          
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 font-medium text-sm shadow-sm transition-colors focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptResult;