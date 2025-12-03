import { Stage, StageId } from './types';

// Default Generic AI Product Timeline
export const TIMELINE_DATA: Stage[] = [
  {
    id: StageId.DISCOVERY,
    label: 'Discovery & Feasibility',
    timeLabel: 'Month 1',
    activities: {
      selfService: [
        {
          id: 'problem-def',
          title: 'Problem Definition & User Needs',
          description: 'Identify the core user problem and assess if AI is the right solution.',
          megaPromptTemplate: "Act as a Lead Product Manager. I am building '${productName}'.\n\n1. Generate 5 distinct user personas based on: '${productDescription}'.\n2. For each persona, list 3 critical pain points that '${productGoals}' aims to solve.\n3. Create a 'Problem Statement' format: 'Users [who] need [what] because [why], but [barrier]'.",
          okrPromptTemplate: "Context: Discovery phase for '${productName}'. Task: Create 3 OKRs for 'Problem Validation'. Key Results should measure user interview counts, pain point validation rates, and market research depth."
        },
        {
          id: 'feasibility-check',
          title: 'AI Feasibility Assessment',
          description: 'Evaluate technical feasibility, data availability, and model capabilities.',
          megaPromptTemplate: "Act as an AI Architect. We want to build: '${productDescription}'.\n\n1. Assess the feasibility of using current LLMs (like Gemini 1.5) vs Custom Models for this.\n2. Identify data requirements: What specific datasets do we need?\n3. List potential technical risks (Latency, Hallucination, Cost) for achieving: '${productGoals}'.",
          okrPromptTemplate: "Context: Technical assessment for '${productName}'. Task: Create 3 OKRs for 'Feasibility Study'. Key Results should track prototype success rate, data availability checks, and cost modeling."
        }
      ]
    }
  },
  {
    id: StageId.DEFINITION,
    label: 'Definition & Strategy',
    timeLabel: 'Month 2',
    activities: {
      selfService: [
        {
          id: 'prfaq',
          title: 'PR/FAQ & Value Prop',
          description: 'Draft the Press Release and FAQ to work backwards from the customer.',
          megaPromptTemplate: "Act as a Product Leader at Amazon. Write a PR/FAQ for '${productName}'.\n\n1. **Press Release**: Write a visionary press release announcing the launch of the product, highlighting how it solves: '${productGoals}'.\n2. **FAQ**: Write 5 hard internal questions (e.g., 'Why will users switch?', 'How do we handle privacy?') and 5 external customer questions.",
          okrPromptTemplate: "Context: Defining strategy for '${productName}'. Task: Create 3 OKRs for 'Product Definition'. Key Results should focus on stakeholder buy-in, PR/FAQ approval, and roadmap clarity."
        },
        {
          id: 'success-metrics',
          title: 'Define Success Metrics',
          description: 'Establish KPIs, Guardrail Metrics, and North Star Metric.',
          megaPromptTemplate: "Act as a Data Scientist. Define the metrics for '${productName}'.\n\n1. **North Star Metric**: What is the single metric that captures value delivered?\n2. **L1/L2 Metrics**: List acquisition, engagement, and retention metrics.\n3. **Guardrail Metrics**: What AI-specific metrics (Latency, Toxicity, Token Cost) must we monitor to ensure '${productGoals}' is met safely?",
          okrPromptTemplate: "Context: Metrics planning for '${productName}'. Task: Create 3 OKRs for 'Metric Definition'. Key Results should track dashboard setup, baseline establishment, and instrumentation coverage."
        }
      ]
    }
  },
  {
    id: StageId.DEVELOPMENT,
    label: 'Development & Iteration',
    timeLabel: 'Months 3-5',
    activities: {
      selfService: [
        {
          id: 'prompt-eng',
          title: 'Prompt Engineering & Tuning',
          description: 'Iterative development of system instructions and few-shot examples.',
          megaPromptTemplate: "Act as a Prompt Engineer. We are tuning the model for '${productName}'.\n\n1. Draft a robust 'System Instruction' that defines the persona and constraints.\n2. Create 3 'Few-Shot' examples (Input -> Desired Output) relevant to: '${productDescription}'.\n3. Suggest an evaluation rubric for measuring response quality.",
          okrPromptTemplate: "Context: Developing '${productName}'. Task: Create 3 OKRs for 'Model Performance'. Key Results should measure response accuracy, latency reduction, and prompt iteration velocity."
        },
        {
          id: 'ux-design',
          title: 'AI UX/UI Design',
          description: 'Design interfaces that handle uncertainty, streaming, and feedback.',
          megaPromptTemplate: "Act as a UX Designer specializing in AI. Design the experience for '${productName}'.\n\n1. Describe the 'Happy Path' user flow.\n2. **Error Handling**: How should the UI handle hallucinations or API failures?\n3. **Feedback Loops**: Propose a mechanism for users to correct the AI, improving the model for '${productGoals}'.",
          okrPromptTemplate: "Context: UX Design for '${productName}'. Task: Create 3 OKRs for 'User Experience'. Key Results should track usability testing scores, error recovery rates, and feedback collection volume."
        }
      ]
    }
  },
  {
    id: StageId.LAUNCH,
    label: 'Launch & Evaluation',
    timeLabel: 'Month 6+',
    activities: {
      selfService: [
        {
          id: 'go-to-market',
          title: 'Go-To-Market Strategy',
          description: 'Plan the launch, positioning, and user acquisition channels.',
          megaPromptTemplate: "Act as a Product Marketing Manager. Plan the GTM for '${productName}'.\n\n1. **Positioning**: Write a positioning statement vs competitors.\n2. **Channels**: Identify the top 3 channels to acquire users interested in '${productDescription}'.\n3. **Launch Assets**: List the blog posts, demos, and docs needed for launch.",
          okrPromptTemplate: "Context: Launching '${productName}'. Task: Create 3 OKRs for 'Launch Success'. Key Results should track signups, CAC (Customer Acquisition Cost), and Day-1 retention."
        },
        {
          id: 'post-launch-eval',
          title: 'Post-Launch Evaluation',
          description: 'Monitor performance, costs, and user feedback loop.',
          megaPromptTemplate: "Act as the AI Product Manager. We just launched '${productName}'.\n\n1. Design a 'Weekly Business Review' agenda.\n2. Create a template for analyzing 'Bad Responses' to improve the model.\n3. How do we measure ROI against '${productGoals}'?",
          okrPromptTemplate: "Context: Post-launch for '${productName}'. Task: Create 3 OKRs for 'Operational Excellence'. Key Results should track API cost efficiency, support ticket reduction, and model update frequency."
        }
      ]
    }
  }
];

export const MOTIVATORS = [
  "Great PMs don't just build features; they build clarity out of chaos.",
  "In the age of AI, empathy is your most competitive advantage.",
  "Fall in love with the problem, not the AI solution.",
  "Ship to learn. Iteration is the heartbeat of AI products.",
  "The best prompt is a conversation, not a command.",
  "Data whispers, but user intuition shouts. Balance both.",
  "AI is a tool. The product is the value it creates for the human.",
  "Don't predict the future. Enable your users to create it.",
  "Ambiguity is where the opportunity hides. Embrace it.",
  "Your roadmap is a hypothesis, not a contract."
];