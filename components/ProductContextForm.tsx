import React, { useState, useEffect } from 'react';
import { ProductContext } from '../types';
import { analyzeVideoContext } from '../services/geminiService';
import { triggerHaptic } from '../services/utils';

interface ProductContextFormProps {
  onChange: (context: ProductContext) => void;
  onGenerateRoadmap: () => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
  currentContext: ProductContext;
  isGeneratingRoadmap: boolean;
}

const ProductContextForm: React.FC<ProductContextFormProps> = ({ 
  onChange, 
  onGenerateRoadmap, 
  isCollapsed, 
  toggleCollapse, 
  currentContext, 
  isGeneratingRoadmap 
}) => {
  const [formData, setFormData] = useState<ProductContext>(currentContext);
  const [videoUrl, setVideoUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    setFormData(currentContext);
  }, [currentContext]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newData = { ...formData, [e.target.name]: e.target.value };
    setFormData(newData);
    onChange(newData);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value);
  };

  const handleAnalyzeVideo = async () => {
    if (!videoUrl) return;
    triggerHaptic();
    setIsAnalyzing(true);
    try {
      const context = await analyzeVideoContext(videoUrl);
      setFormData(context);
      onChange(context);
    } catch (error) {
      console.error("Failed to analyze video", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section 
      aria-label="Product Context Configuration"
      className="glass-panel bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden mb-6 transition-all duration-300"
    >
      <button 
        type="button"
        className="w-full bg-brand-50 dark:bg-slate-700/50 p-4 flex justify-between items-center cursor-pointer border-b border-brand-100 dark:border-slate-600 focus:outline-none focus:bg-brand-100 dark:focus:bg-slate-700"
        onClick={() => { triggerHaptic(); toggleCollapse(); }}
        aria-expanded={!isCollapsed}
        aria-controls="context-form-content"
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h2 className="font-semibold text-brand-900 dark:text-white">Product Definition & Context</h2>
        </div>
        <span className="text-brand-500 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300">
          {isCollapsed ? (
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Expand"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Collapse"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
          )}
        </span>
      </button>

      {!isCollapsed && (
        <div id="context-form-content" className="p-6 space-y-4">
          
          {/* Video Input Section */}
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 mb-4">
             <label htmlFor="video-url" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Import Context from Tech/Product Video
             </label>
             <div className="flex flex-col sm:flex-row gap-2">
                <input
                  id="video-url"
                  type="text"
                  value={videoUrl}
                  onChange={handleUrlChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="flex-grow px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-md focus:ring-2 focus:ring-brand-500 outline-none text-sm placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={handleAnalyzeVideo}
                  disabled={isAnalyzing || !videoUrl}
                  className={`px-4 py-2 rounded-md font-medium text-white text-sm flex items-center justify-center gap-2 transition-colors ${
                    isAnalyzing || !videoUrl 
                      ? 'bg-slate-400 dark:bg-slate-600 cursor-not-allowed' 
                      : 'bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900'
                  }`}
                >
                  {isAnalyzing ? "Analyzing..." : "Fetch Context"}
                </button>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="product-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Product Name</label>
              <input
                id="product-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Smart Gardening Bot"
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-md focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="product-desc" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Product Description</label>
            <textarea
              id="product-desc"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="What does your product do? Who is it for?"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-md focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div>
            <label htmlFor="product-goals" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Key Business Goals</label>
            <input
              id="product-goals"
              type="text"
              name="goals"
              value={formData.goals}
              onChange={handleChange}
              placeholder="e.g. Acquire 1000 users, Reduce operational costs by 20%"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-md focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => { triggerHaptic(); toggleCollapse(); }}
              className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400"
            >
              Hide Form
            </button>
            
            <button
              type="button"
              onClick={onGenerateRoadmap}
              disabled={isGeneratingRoadmap}
              className={`px-6 py-2 text-white font-medium rounded-md shadow-sm flex items-center gap-2 transition-all ${
                 isGeneratingRoadmap 
                 ? 'bg-slate-400 cursor-wait' 
                 : 'bg-brand-600 hover:bg-brand-700 focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900'
              }`}
            >
              {isGeneratingRoadmap ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Generating Plan...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                  Generate AI Roadmap
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductContextForm;