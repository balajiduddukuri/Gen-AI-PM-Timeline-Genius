export enum StageId {
  DISCOVERY = 'DISCOVERY',
  DEFINITION = 'DEFINITION',
  DEVELOPMENT = 'DEVELOPMENT',
  LAUNCH = 'LAUNCH'
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  megaPromptTemplate: string; // Template string where we inject product details
  okrPromptTemplate?: string; // Optional specific prompt for generating OKRs
}

export interface Stage {
  id: StageId;
  label: string;
  timeLabel: string; // e.g., "Month 1", "Ongoing"
  activities: {
    selfService?: Activity[]; // Kept for backward compatibility in structure
    service?: Activity[];
  };
}

export interface ProductContext {
  name: string;
  description: string;
  goals: string;
}

export interface OKR {
  objective: string;
  keyResults: string[];
}

export interface TrendingProject {
  title: string;
  description: string;
  techStack: string[];
}