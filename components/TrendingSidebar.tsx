import React, { useEffect, useState } from 'react';
import { generateTrendingProjects } from '../services/geminiService';
import { TrendingProject } from '../types';
import { triggerHaptic } from '../services/utils';

interface TrendingSidebarProps {
  onSelectProject: (project: TrendingProject) => void;
}

const TrendingSidebar: React.FC<TrendingSidebarProps> = ({ onSelectProject }) => {
  const [projects, setProjects] = useState<TrendingProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch once on mount
    const fetchTrends = async () => {
      try {
        const data = await generateTrendingProjects();
        setProjects(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, []);

  return (
    <aside aria-label="Trending IT Projects" className="glass-panel bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700 p-4 h-full flex flex-col">
      <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
        Trending IT Projects
      </h3>
      
      {loading ? (
        <div className="space-y-4" aria-busy="true" aria-label="Loading projects">
          {[1,2,3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-100 dark:bg-slate-700/50 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : (
        <ul className="space-y-4 overflow-y-auto pr-1 list-none m-0 p-0">
          {projects.map((project, idx) => (
            <li key={idx}>
              <button 
                className="w-full text-left group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 p-2 rounded -mx-2 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500"
                onClick={() => { triggerHaptic(); onSelectProject(project); }}
                title="Click to use this project as context"
              >
                <h4 className="font-semibold text-sm text-brand-600 dark:text-brand-400 group-hover:underline flex items-center justify-between">
                  {project.title}
                  <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">{project.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {project.techStack.slice(0, 3).map((tech, tIdx) => (
                    <span key={tIdx} className="text-[10px] bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      {tech}
                    </span>
                  ))}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};

export default TrendingSidebar;