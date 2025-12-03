import React from 'react';
import { Activity, Stage } from '../types';
import { triggerHaptic } from '../services/utils';

interface TimelineProps {
  stages: Stage[];
  onActivityHover: (activity: Activity | null) => void;
  onActivityClick: (activity: Activity) => void;
  selectedActivity: Activity | null;
  searchTerm: string;
}

const Timeline: React.FC<TimelineProps> = ({ stages, onActivityHover, onActivityClick, selectedActivity, searchTerm }) => {
  
  const doesActivityMatch = (activity: Activity) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      activity.title.toLowerCase().includes(term) ||
      activity.description.toLowerCase().includes(term)
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent, activity: Activity) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerHaptic();
      onActivityClick(activity);
    }
  };

  const handleClick = (activity: Activity) => {
    triggerHaptic();
    onActivityClick(activity);
  };

  return (
    <section 
      aria-label="Product Roadmap Timeline" 
      className="relative w-full pb-12 pt-4 md:pt-8 px-2 md:px-0"
    >
      {/* Desktop Connector Line (Horizontal) */}
      <div className="hidden md:block absolute top-16 left-0 w-full h-1 bg-gradient-to-r from-slate-200 via-brand-500 to-slate-200 dark:from-slate-700 dark:via-brand-400 dark:to-slate-700 z-0"></div>

      {/* Mobile Connector Line (Vertical) */}
      <div className="md:hidden absolute top-4 bottom-4 left-6 w-1 bg-gradient-to-b from-slate-200 via-brand-500 to-slate-200 dark:from-slate-700 dark:via-brand-400 dark:to-slate-700 z-0"></div>

      <div className="flex flex-col md:flex-row md:min-w-0 md:justify-between px-0 md:px-8 relative z-10 gap-8 md:gap-0">
        {stages.map((stage) => {
          // Flatten all activities for unified rendering
          const allActivities = [
            ...(stage.activities.selfService || []),
            ...(stage.activities.service || [])
          ];
          
          const visibleActivities = allActivities.filter(doesActivityMatch);
          const hasVisibleActivities = visibleActivities.length > 0;
          const opacityClass = (searchTerm && !hasVisibleActivities) ? 'opacity-30 grayscale' : 'opacity-100';

          return (
            <article 
              key={stage.id} 
              className={`flex flex-row md:flex-col w-full md:w-1/4 transition-opacity duration-300 ${opacityClass}`}
            >
              
              {/* Marker Section */}
              <div className="flex flex-col items-center mr-4 md:mr-0 md:mb-8 relative min-w-[3rem] md:min-w-0" aria-hidden="true">
                {/* Mobile: Time Label next to dot */}
                <div className="md:hidden absolute -left-2 top-0 text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 px-1 z-20">
                    {stage.timeLabel}
                </div>

                {/* Desktop: Time Label above dot */}
                <span className="hidden md:block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-900 px-2 mb-2 relative z-20">
                  {stage.timeLabel}
                </span>

                {/* The Dot */}
                <div className="w-4 h-4 rounded-full bg-brand-500 dark:bg-brand-400 border-4 border-white dark:border-slate-800 shadow-sm relative z-20 mt-4 md:mt-0"></div>
                
                {/* Desktop: Vertical Drop Line */}
                <div className="hidden md:block absolute top-6 bottom-[-20px] w-px bg-slate-200 dark:bg-slate-700 -z-10 h-full"></div>
              </div>

              {/* Content Section */}
              <div className="flex-grow pt-2 md:pt-0">
                <header className="md:text-center mb-4 border-b-2 border-brand-100 dark:border-slate-700 pb-2">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{stage.label}</h3>
                </header>

                <div className="space-y-3" role="group" aria-label={`Activities for ${stage.label}`}>
                  {visibleActivities.map((activity) => {
                    const isSelected = selectedActivity?.id === activity.id;
                    return (
                      <button
                        key={activity.id}
                        role="button"
                        aria-pressed={isSelected}
                        className={`w-full text-left group relative p-3 rounded shadow-sm border cursor-pointer transition-all duration-200 transform hover:-translate-y-1 focus:translate-y-0
                          ${isSelected 
                            ? 'bg-brand-50 dark:bg-brand-900/30 border-brand-600 dark:border-brand-500 ring-2 ring-brand-200 dark:ring-brand-700' 
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-brand-400 hover:shadow-md dark:hover:border-brand-500'
                          }`}
                        onMouseEnter={() => onActivityHover(activity)}
                        onMouseLeave={() => onActivityHover(null)}
                        onClick={() => handleClick(activity)}
                        onKeyDown={(e) => handleKeyDown(e, activity)}
                      >
                        <div className={`text-sm font-medium mb-1 ${isSelected ? 'text-brand-700 dark:text-brand-300' : 'text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400'}`}>
                          {activity.title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                          {activity.description}
                        </div>
                        {isSelected && (
                          <div className="absolute -right-1 -top-1 w-2 h-2 bg-brand-600 dark:bg-brand-400 rounded-full shadow-sm"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Timeline;