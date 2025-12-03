import React, { useState, useEffect } from 'react';
import { MOTIVATORS } from '../constants';
import { triggerHaptic } from '../services/utils';

const Motivator: React.FC = () => {
  const [quote, setQuote] = useState('');

  const pickRandom = () => {
    const random = MOTIVATORS[Math.floor(Math.random() * MOTIVATORS.length)];
    setQuote(random);
  };

  useEffect(() => {
    pickRandom();
  }, []);

  const handleClick = () => {
    triggerHaptic();
    pickRandom();
  };

  return (
    <div 
      role="note" 
      aria-label="Daily Motivation"
      onClick={handleClick}
      className="mb-6 bg-gradient-to-r from-brand-600 to-brand-800 dark:from-brand-800 dark:to-brand-950 text-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all flex items-center gap-4 animate-fade-in-up border border-brand-500/30"
    >
      <div className="bg-white/20 p-2.5 rounded-full shrink-0">
        <svg className="w-6 h-6 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <div>
        <p className="font-medium text-lg italic leading-tight">"{quote}"</p>
        <p className="text-[10px] text-brand-100 mt-1.5 uppercase tracking-wider font-bold opacity-80">Gen AI PM Insight • Click for new tip</p>
      </div>
    </div>
  );
};

export default Motivator;