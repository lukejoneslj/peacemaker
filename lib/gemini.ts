import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with the API key
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

// Get the model - using Gemini 2.0 Flash Lite
export const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

// Define types for the Toxicity Scale
export type ToxicityLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface ToxicityScore {
  score: ToxicityLevel;
  explanation: string;
  category: "non-toxic" | "mild" | "moderate" | "toxic" | "severe";
  improvementTips: string[];
}

// Function to analyze text for toxicity level
export async function analyzeToxicity(text: string, topic: string = ""): Promise<ToxicityScore> {
  try {
    // Create the prompt for the Gemini model
    const prompt = `
      Analyze the following perspective on ${topic || "a political topic"} and rate it on the Toxicity Scale, which is a 10-point scale from non-toxic to severe.
      
      The Toxicity Scale:
      - Level 1: Completely non-toxic, respectful, and constructive.
      - Level 2: Generally respectful with minor criticism.
      - Level 3: Mildly critical but still respectful and civil.
      - Level 4: Noticeably critical, some negative tone, but no hostility.
      - Level 5: Moderately negative, clear criticism, mild hostility.
      - Level 6: Negative tone with moderate hostility and sarcasm.
      - Level 7: Clearly hostile, aggressive language, minor insults.
      - Level 8: Very hostile, significant insults and inflammatory language.
      - Level 9: Extremely hostile, severe insults, potentially threatening language.
      - Level 10: Maximum hostility, threats, harassment, or hate speech.
      
      TEXT TO ANALYZE:
      "${text}"
      
      Your response should have a constructive, supportive tone. Validate what aspects of their perspective are thoughtful, even if you're identifying toxicity. Your goal is to help the user become more effective at communicating across political divides.
      
      Return a JSON object with:
      1. "score": A number from 1 to 10 representing the Toxicity Scale score
      2. "explanation": A 3-4 paragraph explanation that:
         - Validly identifies the core position being expressed
         - Explains why the text received this score, with specific examples
         - Notes constructive elements of the communication
         - Suggests how the message might be received by those with different views
      3. "category": One of the following based on the score:
         - "non-toxic" (scores 1-2)
         - "mild" (scores 3-4)
         - "moderate" (scores 5-6)
         - "toxic" (scores 7-8)
         - "severe" (scores 9-10)
      4. "improvementTips": An array of 3-5 specific, actionable tips to make the communication more respectful and constructive while still maintaining the core position. Each tip should:
         - Be clear and actionable
         - Include specific "instead of saying X, try saying Y" examples
         - Maintain the core position while changing the tone or framing
         - Focus on how to express the same point in a way that's more likely to be heard by those with different views
      
      For example, an improvement tip might be: "Instead of saying 'Anyone who supports this policy is blind to reality,' try saying 'I believe this policy overlooks some important real-world consequences such as...'"
      
      Response format:
      {
        "score": number,
        "explanation": string,
        "category": string,
        "improvementTips": string[]
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
        score: jsonResponse.score as ToxicityLevel,
        explanation: jsonResponse.explanation,
        category: jsonResponse.category as "non-toxic" | "mild" | "moderate" | "toxic" | "severe",
        improvementTips: jsonResponse.improvementTips || []
      };
    }
    
    throw new Error("Invalid response format from Gemini API");
  } catch (error) {
    console.error("Error analyzing toxicity:", error);
    throw error;
  }
} 