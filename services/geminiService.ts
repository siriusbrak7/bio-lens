import { GoogleGenAI, Type, Schema } from "@google/genai";
import { NotebookContent } from "../types";
import { SYSTEM_PROMPT_TEMPLATE } from "../constants";

const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

const contentSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    topicTitle: { type: Type.STRING },
    sectionA: {
      type: Type.OBJECT,
      properties: {
        hook: { type: Type.STRING },
        keyConcept: { type: Type.STRING },
        narrativeMarkdown: { type: Type.STRING, description: "Markdown formatted explanatory text with headers (##) and bold terms (**term**)" },
        realWorldRelevance: { type: Type.STRING },
        crossUnitConnections: { type: Type.ARRAY, items: { type: Type.STRING } },
        importantTerms: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["hook", "keyConcept", "narrativeMarkdown", "realWorldRelevance", "crossUnitConnections", "importantTerms"]
    },
    sectionB: {
      type: Type.OBJECT,
      properties: {
        checkpoints: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              type: { type: Type.STRING, enum: ["Recall", "Application", "Analysis", "Critical Thinking"] },
              question: { type: Type.STRING },
              answer: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ["id", "type", "question", "answer", "explanation"]
          }
        }
      },
      required: ["checkpoints"]
    },
    sectionC: {
      type: Type.OBJECT,
      properties: {
        flashcards: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              type: { type: Type.STRING },
              front: { type: Type.STRING },
              back: { type: Type.STRING }
            },
            required: ["id", "type", "front", "back"]
          }
        }
      },
      required: ["flashcards"]
    },
    sectionD: {
      type: Type.OBJECT,
      properties: {
        researchQuestion: { type: Type.STRING },
        methodOverview: { type: Type.STRING },
        hypothesisPrompt: { type: Type.STRING },
        dataInterpretationQuestion: { type: Type.STRING },
        conclusionFramework: { type: Type.STRING }
      },
      required: ["researchQuestion", "methodOverview", "hypothesisPrompt", "dataInterpretationQuestion", "conclusionFramework"]
    }
  },
  required: ["topicTitle", "sectionA", "sectionB", "sectionC", "sectionD"]
};

export const generateTopicContent = async (unitName: string, topicName: string): Promise<NotebookContent> => {
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const prompt = SYSTEM_PROMPT_TEMPLATE
    .replace('{{UNIT_NAME}}', unitName)
    .replace('{{TOPIC_NAME}}', topicName);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: contentSchema,
        temperature: 0.7, // Creative but structured
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as NotebookContent;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const explainTerm = async (term: string, context: string): Promise<string> => {
   if (!apiKey) return "API Key missing.";
   
   const prompt = `Explain the biological term "${term}" simply for a high school student. Context: ${context}. Keep it under 50 words.`;
   
   try {
     const response = await ai.models.generateContent({
       model: 'gemini-2.5-flash',
       contents: prompt,
     });
     return response.text || "Could not define term.";
   } catch (e) {
     return "Definition unavailable.";
   }
};
