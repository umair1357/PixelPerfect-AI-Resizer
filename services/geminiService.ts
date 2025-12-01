import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// Note: In a real production app, ensure this key is guarded or proxied.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an SEO-friendly alt text and a short description for an image.
 * Uses gemini-2.5-flash for speed and multimodal capabilities.
 */
export const analyzeImage = async (base64Data: string, mimeType: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key is missing. Please configure your environment.";
  }

  try {
    // Strip the data URL prefix if present to get just the base64 string
    const cleanBase64 = base64Data.split(',')[1] || base64Data;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType
            }
          },
          {
            text: "Analyze this image. Provide a concise, professional alt-text description suitable for accessibility, and suggest 3 SEO-friendly tags. Format as: 'Alt: [description]\nTags: [tag1, tag2, tag3]'"
          }
        ]
      }
    });

    return response.text || "No description generated.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Failed to analyze image. Please try again.";
  }
};
