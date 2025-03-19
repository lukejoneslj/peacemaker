import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with the API key
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

// Get the model - using Gemini 2.0 Flash Lite
export const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

// Define types for the Dignity Index
export type DignityLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface DignityScore {
  score: DignityLevel;
  explanation: string;
  category: "contempt" | "dignity";
}

// Function to analyze text for dignity index
export async function analyzeDignity(text: string): Promise<DignityScore> {
  try {
    // Create the prompt for the Gemini model
    const prompt = `
      Analyze the following text and rate it on the Dignity Index, which is an 8-point scale from contempt to dignity.
      
      The Dignity Index:
      - Level 1 (Contempt): Escalates from violent words to violent actions. Views others as less than human and calls for violence.
      - Level 2 (Contempt): Accuses the other side of promoting evil, not just doing bad.
      - Level 3 (Contempt): Attacks the other side's moral character, not just capabilities.
      - Level 4 (Contempt): Mocks and attacks the other side's background, beliefs, commitment, or competence.
      - Level 5 (Dignity): Listens to other views and respectfully explains own goals and plans.
      - Level 6 (Dignity): Sees working with others to find common ground as a welcome duty.
      - Level 7 (Dignity): Wants to fully engage the other side to discuss deep disagreements.
      - Level 8 (Dignity): Sees oneself in every human being and offers dignity to everyone.
      
      TEXT TO ANALYZE:
      "${text}"
      
      Return a JSON object with:
      1. "score": A number from 1 to 8 representing the Dignity Index score
      2. "explanation": A brief explanation of why the text received this score, with specific examples
      3. "category": Either "contempt" (scores 1-4) or "dignity" (scores 5-8)
      
      Response format:
      {
        "score": number,
        "explanation": string,
        "category": string
      }
    `;

    // Generate content from the model
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse the JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const jsonResponse = JSON.parse(jsonMatch[0]);
      
      return {
        score: jsonResponse.score as DignityLevel,
        explanation: jsonResponse.explanation,
        category: jsonResponse.category as "contempt" | "dignity"
      };
    }
    
    throw new Error("Invalid response format from Gemini API");
  } catch (error) {
    console.error("Error analyzing dignity:", error);
    throw error;
  }
} 