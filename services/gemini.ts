
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_CONTEXT, PROMPTS, ROADMAP_PROMPT } from "../constants";
import { Message, RoadmapResponse } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

// Using Flash model for higher rate limits and faster response times while maintaining research quality
const MODEL_NAME = 'gemini-3-flash-preview';

/**
 * Utility to wait for a specified duration.
 */
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Executes a function with exponential backoff retry logic specifically for rate limit errors.
 */
async function withRetry<T>(fn: () => Promise<T>, retries = 5, delay = 4000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    // Attempt to extract error details from various potential structures
    // The Gemini SDK often returns nested error objects: { error: { code, message, status } }
    const deepStatus = error?.error?.code || error?.error?.status;
    const deepMessage = error?.error?.message;
    
    const rootStatus = error?.status || error?.code;
    const rootMessage = error?.message;

    // Convert everything to lowercase string for robust matching
    const errorStr = JSON.stringify(error).toLowerCase();
    const combinedMessage = (deepMessage || rootMessage || "").toString().toLowerCase();
    const combinedStatus = (deepStatus || rootStatus || "").toString().toLowerCase();

    // Check for Rate Limit (429) or Resource Exhausted status in any part of the error
    const isRetryable = 
      combinedStatus.includes('429') ||
      combinedStatus.includes('resource_exhausted') ||
      combinedMessage.includes('429') || 
      combinedMessage.includes('quota') || 
      combinedMessage.includes('resource_exhausted') ||
      errorStr.includes('resource_exhausted') ||
      errorStr.includes('"code":429');

    if (isRetryable) {
      if (retries > 0) {
        console.warn(`Quota limit hit. Retrying in ${delay}ms... (${retries} attempts left)`);
        await wait(delay);
        return withRetry(fn, retries - 1, delay * 2);
      } else {
        // Transform the technical error into a user-friendly message
        throw new Error("The research assistant is currently at capacity (Rate Limit Exceeded). Please wait a moment for the quota to reset and try again.");
      }
    }

    throw error;
  }
}

/**
 * Searches for a paper using Google Search grounding.
 */
export const searchForPaper = async (query: string): Promise<string> => {
  return withRetry(async () => {
    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `Find the academic paper titled or related to: "${query}". Return a comprehensive summary of its content, including Abstract, Introduction, Methodology, and Results, so that I can analyze it. Structure it like a paper.`,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      return response.text || "No results found.";
    } catch (error: any) {
      console.error("Search Error:", error);
      throw error;
    }
  });
};

/**
 * Analyzes the provided paper text based on a specific prompt (Summary, Gaps, Predictions).
 */
export const analyzePaper = async (paperContent: string, promptType: 'SUMMARY' | 'GAPS' | 'PREDICTIONS') => {
  return withRetry(async () => {
    try {
      const specificPrompt = PROMPTS[promptType];
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `
${SYSTEM_CONTEXT}

PAPER CONTENT:
${paperContent}

${specificPrompt}
      `,
      });

      return response.text || "Analysis failed to generate text.";
    } catch (error: any) {
      console.error("Analysis Error:", error);
      throw error;
    }
  });
};

/**
 * Explains a selected text/equation snippet from a paper.
 */
export const explainSelection = async (paperContent: string, selection: string) => {
  return withRetry(async () => {
    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `
${SYSTEM_CONTEXT}

PAPER CONTENT FOR CONTEXT:
${paperContent.substring(0, 10000)} ... [Truncated for brevity]

${PROMPTS.EQUATION}
"${selection}"
      `,
      });

      return response.text || "Failed to explain selection.";
    } catch (error: any) {
      console.error("Equation Explanation Error:", error);
      throw error;
    }
  });
};

/**
 * Chats with the paper content.
 */
export const chatWithPaper = async (
  paperContent: string,
  history: Message[],
  newMessage: string
) => {
  return withRetry(async () => {
    try {
      const chat = ai.chats.create({
        model: MODEL_NAME,
        config: {
          systemInstruction: `${SYSTEM_CONTEXT}\n\nCONTEXT PAPER:\n${paperContent}`,
        },
        history: history.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.content }]
        }))
      });

      const result = await chat.sendMessage({ message: newMessage });
      return result.text;

    } catch (error: any) {
      console.error("Chat Error:", error);
      throw error;
    }
  });
};

/**
 * Generates a scientific learning roadmap based on the paper.
 */
export const generateLearningRoadmap = async (
  title: string, 
  abstract: string, 
  arxivId?: string
): Promise<RoadmapResponse> => {
  return withRetry(async () => {
    try {
      // Limit abstract length to avoid context window issues if full text is passed
      const safeAbstract = abstract.length > 5000 ? abstract.substring(0, 5000) + "..." : abstract;
      const safeArxivId = arxivId || "Not Provided";

      const filledPrompt = ROADMAP_PROMPT
        .replace("{title}", title)
        .replace("{abstract}", safeAbstract)
        .replace("{arxiv_id}", safeArxivId)
        .replace("{paper_title}", title)
        .replace("{paper_arxiv_id}", safeArxivId);

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: filledPrompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      
      const text = response.text || "{}";
      const jsonStr = text.replace(/```json\n?|```/g, "").trim();
      return JSON.parse(jsonStr) as RoadmapResponse;
    } catch (error: any) {
      console.error("Roadmap Error:", error);
      throw error;
    }
  });
};
