
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAiGuidance = async (query: string, recordContext: any) => {
  try {
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
    return "I'm sorry, I encountered an error connecting to the compliance database. Please proceed with manual verification.";
  }
};
