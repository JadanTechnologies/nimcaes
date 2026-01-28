
import { GoogleGenAI } from "@google/genai";

export const getAiGuidance = async (query: string, recordContext: any) => {
  try {
    // Initialize inside the function to prevent top-level errors if API_KEY is empty/missing
    // This allows the main UI to render even if the key isn't provided yet.
    const apiKey = process.env.API_KEY || "";
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an internal NIMC (National Identity Management Commission) compliance assistant. 
      Help the agent with their query regarding data modification policies in Nigeria.
      
      Context of current record being viewed:
      ${JSON.stringify(recordContext, null, 2)}
      
      User Query: ${query}
      
      Provide a concise, professional response based on Nigerian data protection laws (NDPR) and NIMC standard operating procedures.`,
    });
    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    // Specific handling for common initialization errors
    if (error instanceof Error && error.message.includes("API Key")) {
      return "AI Guidance is currently unavailable: System API key is not configured. Please contact the technical administrator.";
    }
    return "I'm sorry, I encountered an error connecting to the compliance database. Please proceed with manual verification.";
  }
};
