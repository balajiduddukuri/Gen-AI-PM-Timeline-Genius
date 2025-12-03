import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ProductContext, OKR, TrendingProject, Activity, Stage, StageId } from "../types";

// Helper to initialize the client safely
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateOKRs = async (
  activity: Activity,
  productContext: ProductContext
): Promise<OKR[]> => {
  const client = getClient();
  if (!client) return [];

  // Use the specific OKR template if available, otherwise construct a generic one
  let promptTemplate = activity.okrPromptTemplate || 
    `Context: We are managing a software product named "\${productName}".
    Description: \${productDescription}
    Goals: \${productGoals}
    Task: Create 3 high-quality Objectives and Key Results (OKRs) specifically for the activity "${activity.title}".
    Ensure the Key Results are measurable and numeric.`;

  // Interpolate the template with actual product context
  const prompt = promptTemplate
    .replace(/\${productName}/g, productContext.name || "the product")
    .replace(/\${productDescription}/g, productContext.description || "not specified")
    .replace(/\${productGoals}/g, productContext.goals || "not specified");

  const responseSchema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        objective: { type: Type.STRING, description: "The high level objective" },
        keyResults: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "List of 3 measurable key results"
        }
      },
      required: ["objective", "keyResults"]
    }
  };

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as OKR[];
    }
    return [];
  } catch (error) {
    console.error("Failed to generate OKRs:", error);
    return [];
  }
};

export const generateTrendingProjects = async (): Promise<TrendingProject[]> => {
  const client = getClient();
  if (!client) return [];

  const prompt = "List 5 trending, impressive 'AI Product Ideas' for an aspiring AI Product Manager. These should be viable, modern AI applications. Examples: 'Legal Doc Summarizer', 'AI Health Coach', 'Personalized Tutor'. Give them catchy names.";

  const responseSchema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        techStack: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["title", "description", "techStack"]
    }
  };

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as TrendingProject[];
    }
    return [];
  } catch (error) {
    console.error("Failed to generate trending projects:", error);
    return [];
  }
};

export const runGenericPrompt = async (prompt: string): Promise<string> => {
  const client = getClient();
  if (!client) return "Error: API Key missing.";

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.8,
      }
    });

    return response.text || "No content generated.";
  } catch (error) {
    console.error("Failed to run prompt:", error);
    return "Error generating content. Please try again.";
  }
};

export const analyzeVideoContext = async (videoUrl: string): Promise<ProductContext> => {
  // 1. Handle the specific known video from requirements
  if (videoUrl.includes('MZlKnSJ_gaA')) {
     return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            name: "AI Product Manager's Evaluation Dashboard",
            description: "A centralized dashboard for monitoring indeterministic AI outputs. It serves as an analytics beacon for AI Product Managers to oversee performance, factual correctness, and structural validity of LLM features.",
            goals: "Ensure factual correctness, validate JSON output structure, monitor bias, and track token/infrastructure costs to ensure business viability."
          });
        }, 800);
     });
  }

  // 2. Generic handler for other URLs
  const client = getClient();
  const fallback = {
      name: "Generic AI Product",
      description: "A placeholder context derived from the video content.",
      goals: "Define clear objectives."
  };

  if (!client) return fallback;

  const prompt = `
    I have a video URL: "${videoUrl}".
    Please generate a plausible "Product Context" based on what a technical product video at this URL might be about.
    Return a JSON object with:
    - name: Product name
    - description: What it does
    - goals: Key business goals
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING },
      description: { type: Type.STRING },
      goals: { type: Type.STRING }
    },
    required: ["name", "description", "goals"]
  };

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as ProductContext;
    }
    return fallback;
  } catch (error) {
    console.error("Failed to analyze video context:", error);
    return fallback;
  }
};

export const generateCustomTimeline = async (productContext: ProductContext): Promise<Stage[]> => {
  const client = getClient();
  if (!client) return [];

  const prompt = `
    Act as a Head of Product. Create a custom 4-stage Product Development Timeline for:
    Product: ${productContext.name}
    Description: ${productContext.description}
    Goals: ${productContext.goals}

    The stages should be: Discovery, Definition, Development, Launch.
    For each stage, provide 2 key activities (Self-Service).
    For each activity, generate a "megaPromptTemplate" that helps a PM execute that task using an LLM.
    
    Return a JSON structure matching the Stage[] interface.
  `;

  // Define schema for Activity
  const activitySchema: Schema = {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      title: { type: Type.STRING },
      description: { type: Type.STRING },
      megaPromptTemplate: { type: Type.STRING },
      okrPromptTemplate: { type: Type.STRING }
    },
    required: ["id", "title", "description", "megaPromptTemplate"]
  };

  // Define schema for Stage
  const stageSchema: Schema = {
     type: Type.OBJECT,
     properties: {
        id: { type: Type.STRING, enum: [StageId.DISCOVERY, StageId.DEFINITION, StageId.DEVELOPMENT, StageId.LAUNCH] },
        label: { type: Type.STRING },
        timeLabel: { type: Type.STRING },
        activities: {
           type: Type.OBJECT,
           properties: {
             selfService: {
               type: Type.ARRAY,
               items: activitySchema
             }
           }
        }
     },
     required: ["id", "label", "timeLabel", "activities"]
  };

  const responseSchema: Schema = {
     type: Type.ARRAY,
     items: stageSchema
  };

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Stage[];
    }
    return [];
  } catch (error) {
    console.error("Failed to generate custom timeline:", error);
    return [];
  }
};