
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const getGeminiAI = () => {
  return new GoogleGenAI({ apiKey: API_KEY });
};

export const generateSmartDescription = async (category: string, title: string, specs: any) => {
  const ai = getGeminiAI();
  const prompt = `Generate a compelling, concise product description for a ${category} item titled "${title}". 
                  Technical specs: ${JSON.stringify(specs)}. Keep it professional and highlights key selling points.`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        maxOutputTokens: 200,
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "No description generated.";
  }
};

export const getMarketInsights = async (stats: any) => {
  const ai = getGeminiAI();
  const prompt = `Analyze these marketplace stats and provide 3 short bullet points for business strategy: ${JSON.stringify(stats)}`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    return ["Focus on high-performing categories", "Optimize pricing strategies", "Enhance user engagement"];
  }
};
