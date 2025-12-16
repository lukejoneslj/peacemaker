import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with the API key
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

// Get the model - using Gemini 2.5 Flash-Lite
export const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2048,
  },
});

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
    const prompt = `Analyze the following text and rate it on a toxicity scale from 1-10, where 1 is highly toxic and 10 is completely peaceful.

TEXT TO ANALYZE: "${text}"
TOPIC: ${topic || "general discussion"}

Please respond ONLY with a valid JSON object in this exact format:
{
  "score": 5,
  "explanation": "Brief explanation of the analysis",
  "category": "moderate",
  "improvementTips": ["Tip 1", "Tip 2", "Tip 3"]
}

Requirements:
- score: integer 1-10 (1=most toxic, 10=most peaceful)
- explanation: 2-3 sentences explaining the score
- category: "severe" (1-2), "toxic" (3-4), "moderate" (5-6), "mild" (7-8), or "non-toxic" (9-10)
- improvementTips: array of 2-3 actionable suggestions

Be constructive and helpful in your analysis.`;

    // Generate content from the model
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    console.log("Gemini API Response:", responseText); // Debug logging

    // Try to parse the JSON from the response
    // Look for JSON object in the response
    const jsonMatch = responseText.match(/\{[\s\S]*?\}/);

    if (jsonMatch) {
      try {
        const jsonResponse = JSON.parse(jsonMatch[0]);

        // Validate required fields
        if (typeof jsonResponse.score !== 'number' ||
            typeof jsonResponse.explanation !== 'string' ||
            typeof jsonResponse.category !== 'string') {
          throw new Error("Missing required fields in response");
        }

        return {
          score: jsonResponse.score as ToxicityLevel,
          explanation: jsonResponse.explanation,
          category: jsonResponse.category as "non-toxic" | "mild" | "moderate" | "toxic" | "severe",
          improvementTips: Array.isArray(jsonResponse.improvementTips) ? jsonResponse.improvementTips : []
        };
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        console.error("Raw response:", responseText);
        throw new Error("Failed to parse JSON response from Gemini API");
      }
    }

    // If no JSON found, try to extract information from plain text
    console.warn("No JSON found in response, attempting fallback parsing");
    console.log("Full response:", responseText);

    // Try to extract score from text
    const scoreMatch = responseText.match(/score["\s:]+(\d+)/i);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 5; // Default to moderate

    return {
      score: score as ToxicityLevel,
      explanation: responseText.length > 100 ? responseText.substring(0, 500) + "..." : responseText,
      category: "moderate" as const,
      improvementTips: ["Please try rephrasing your message to be more constructive."]
    };
  } catch (error) {
    console.error("Error analyzing toxicity:", error);
    throw error;
  }
} 