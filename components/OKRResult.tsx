import React from 'react';
import { OKR, Activity } from '../types';

interface OKRResultProps {
  okrs: OKR[];
  isLoading: boolean;
  targetActivity: Activity | null;
}

const OKRResult: React.FC<OKRResultProps> = ({ okrs, isLoading, targetActivity }) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border border-slate-200 dark:border-slate-700 animate-pulse">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-20 bg-slate-100 dark:bg-slate-700/50 rounded"></div>
          <div className="h-20 bg-slate-100 dark:bg-slate-700/50 rounded"></div>
          <div className="h-20 bg-slate-100 dark:bg-slate-700/50 rounded"></div>
        </div>
      </div>
    );
  }

  if (!targetActivity || okrs.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="okr-heading" className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden mt-6">
      <div className="bg-slate-800 dark:bg-slate-950 p-4 border-b border-slate-700 flex justify-between items-center">
        <h3 id="okr-heading" className="font-bold text-white text-lg">Generated OKRs: {targetActivity.title}</h3>
        <span className="text-xs text-emerald-400 font-mono px-2 py-1 bg-emerald-900/30 rounded border border-emerald-900">AI Generated</span>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {okrs.map((okr, index) => (
          <article key={index} className="bg-slate-50 dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
            <header className="flex items-center gap-2 mb-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-300 flex items-center justify-center text-xs font-bold" aria-hidden="true">
                O{index + 1}
              </span>
              <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{okr.objective}</h4>
            </header>
            <ul className="space-y-2 pl-2">
              {okr.keyResults.map((kr, kIndex) => (
                <li key={kIndex} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                   <span className="text-brand-400 dark:text-brand-600 mt-1.5" aria-hidden="true">•</span>
                   <span>{kr}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
};

export default OKRResult;