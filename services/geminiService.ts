import { GoogleGenAI, Type } from "@google/genai";
import { Scenario, Fact } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getNextScenario = async (category: string = 'General'): Promise<Scenario> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Genera un dilema de '¿Qué prefieres?' de la categoría "${category}" en ESPAÑOL. 
      Debe ser creativo, inesperado y adaptarse al tono de la categoría.
      Evita preguntas aburridas estándar.
      Inventa también un porcentaje hipotético de cómo votaría la gente (debe sumar 100) y un comentario muy breve e ingenioso sobre el resultado.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            optionA: { type: Type.STRING },
            optionB: { type: Type.STRING },
            percentageA: { type: Type.INTEGER },
            percentageB: { type: Type.INTEGER },
            commentary: { type: Type.STRING }
          },
          required: ["optionA", "optionB", "percentageA", "percentageB", "commentary"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as Scenario;
  } catch (error) {
    console.error("Error generating scenario:", error);
    // Fallback scenario in case of error
    return {
      optionA: "Intentar de nuevo",
      optionB: "Rendirse",
      percentageA: 99,
      percentageB: 1,
      commentary: "La API está descansando."
    };
  }
};

export const askOracle = async (question: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: question,
      config: {
        systemInstruction: "Eres el Oráculo del Absurdo. Responde a las preguntas de forma críptica, divertida, surrealista y exagerada. Usa metáforas extrañas. Sé breve pero impactante. Responde siempre en ESPAÑOL.",
      }
    });

    return response.text || "El oráculo guarda silencio.";
  } catch (error) {
    console.error("Error asking oracle:", error);
    return "Las estrellas están nubladas. Intenta más tarde.";
  }
};

export const getRandomFact = async (category: string = 'Aleatorio', previousFacts: string[] = []): Promise<Fact> => {
  try {
    const context = previousFacts.length > 0 
      ? `IMPORTANTE: NO repitas ninguno de estos datos anteriores: ${previousFacts.join('; ')}.` 
      : '';

    const topicPrompt = category === 'Aleatorio' 
      ? 'al azar de cualquier tema interesante' 
      : `específicamente sobre el tema: "${category}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Dime un dato curioso (fun fact) ${topicPrompt}. En ESPAÑOL. 
      Debe ser MUY CORTO, directo y conciso. MÁXIMO 15 PALABRAS. 
      Sin introducciones como 'Sabías que...'. Solo el dato puro.
      Busca datos sorprendentes y poco comunes.
      ${context}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING, description: "El subtema específico del dato (ej: 'Física Cuántica' si la categoría es Ciencia)" },
            content: { type: Type.STRING, description: "El dato curioso, extremadamente breve." }
          },
          required: ["topic", "content"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as Fact;
  } catch (error) {
    console.error("Error getting fact:", error);
    return {
      topic: "Error",
      content: "Las IAs a veces se quedan en blanco."
    };
  }
};
