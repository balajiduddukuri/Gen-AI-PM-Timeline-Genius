# Gen AI PM Timeline Genius

**Author:** BalajiDuddukuri  
**Version:** 1.0.0

## Overview

**Gen AI PM Timeline Genius** is an interactive, AI-powered workspace designed for Product Managers building Generative AI products. It transforms the complex lifecycle of AI product development into a manageable, linear timeline.

Unlike static templates, this tool is dynamic. It uses **Google Gemini models** to:
1.  **Generate Custom Roadmaps** based on specific product goals.
2.  **Provide "Mega Prompts"** tailored to each development stage (Discovery, Definition, Development, Launch).
3.  **Generate OKRs** (Objectives and Key Results) automatically for specific activities.
4.  **Execute Prompts** directly within the app to draft PR/FAQs, System Instructions, and more.

## Key Features

*   **Dynamic Context Injection**: Users define their product (Name, Description, Goals), and the entire app adapts.
*   **AI Roadmap Generation**: Generates a bespoke 4-stage project plan with specific activities using Gemini 2.5 Flash.
*   **Mega Prompt Library**: A curated collection of high-value prompts for PM tasks (e.g., "Act as a Data Scientist to define North Star Metrics").
*   **One-Click OKRs**: Instantly drafts measurable OKRs for any selected activity.
*   **Live Prompt Execution**: Run the "Mega Prompts" directly against the LLM and copy the Markdown-formatted results.
*   **Accessibility First**: WCAG 2.2 AA compliant with High Contrast mode, screen reader support, and keyboard navigation.
*   **Theming**: Supports Light, Dark, High Contrast, and "Art Fusion" themes.

## Tech Stack

*   **Frontend**: React 19 (TypeScript)
*   **Styling**: Tailwind CSS
*   **AI Integration**: Google GenAI SDK (`@google/genai`)
*   **Icons**: Heroicons (via SVG)
*   **Build**: ESBuild / Vite (implied environment)

## Setup & Configuration

### Prerequisites
*   Node.js environment (if running locally)
*   A valid **Google Gemini API Key**.

### Environment Variables
The application requires the API key to be available in the process environment:
```env
API_KEY=your_gemini_api_key_here
```

### Installation
1.  Clone the repository.
2.  Install dependencies (if `package.json` exists, otherwise ensure `react`, `react-dom`, and `@google/genai` are available).
3.  Run the development server.

## Project Structure

*   **`App.tsx`**: Main application controller managing global state (Theme, Context, Modal visibility).
*   **`services/geminiService.ts`**: Handles all interactions with the Google Gemini API (OKRs, Trending Projects, Roadmap Generation).
*   **`components/`**:
    *   `Timeline.tsx`: The core visual component displaying stages and activities.
    *   `ProductContextForm.tsx`: Input form for defining the product scope.
    *   `MegaPromptViewer.tsx`: Displays and compiles the prompt templates.
    *   `OKRResult.tsx`: Renders the AI-generated OKRs cards.
    *   `PromptResult.tsx`: A Markdown-capable modal for viewing AI responses.
    *   `TrendingSidebar.tsx`: Fetches trending AI ideas to inspire users.
    *   `Motivator.tsx`: Displays inspirational quotes for PMs.
*   **`constants.ts`**: Contains the default/fallback timeline data and prompts.
*   **`types.ts`**: TypeScript interfaces for data consistency.

## Accessibility (a11y)

The application is designed with inclusivity in mind:
*   **Semantic HTML**: Uses `<main>`, `<section>`, `<article>`, `<header>`, `<footer>`.
*   **ARIA**: Proper labeling (`aria-label`, `aria-expanded`, `role="dialog"`).
*   **Focus Management**: Focus traps in modals, clear focus rings in CSS.
*   **Contrast**: Color palettes vetted for WCAG AA compliance.
*   **Reduced Motion**: Respects system preferences (via Tailwind utilities).

## License

Proprietary / Custom License. Created by BalajiDuddukuri.
