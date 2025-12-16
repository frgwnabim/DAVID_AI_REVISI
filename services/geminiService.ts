import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from '../types';

const apiKey = (import.meta.env.VITE_GEMINI_API_KEY as string) || '';

if (!apiKey) {
  console.warn('Warning: VITE_GEMINI_API_KEY is not set. Gemini requests will fail without it.');
}

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey });

const BASE_SYSTEM_INSTRUCTION = `
You are DAVID AI, a sophisticated and elegant health assistant dedicated to SDG 3 (Good Health and Well-being). 
Your primary focus is COVID-19 prevention, information, and triage support.

Your tone should be:
- Professional yet empathetic.
- Elegant and concise.
- Authoritative but safe.

SPECIFIC INSTRUCTIONS FOR IMAGE ANALYSIS:
If a user provides an image for a "temperature check" or "health check":
1. Acknowledge you are an AI and cannot measure core body temperature physically.
2. Perform a "Visual Health Assessment" (look for flushing, sweating, pallor, fatigue).
3. Provide a simulated assessment with a clear disclaimer.
`;

const SYMPTOM_CHECKER_INSTRUCTION = `
You are acting as DAVID AI's "Symptom Checker Module".
Your goal is to screen the user for COVID-19.

Protocol:
1. Ask ONE question at a time. Do not overwhelm the user.
2. Start by asking about the most common symptoms (fever, cough).
3. Then ask about contact history or travel.
4. Then ask about risk factors (age, underlying conditions).
5. After gathering sufficient info, provide a Recommendation (e.g., "Self-isolate and test", "Seek emergency care", "Likely a cold").

Style:
- Short, clear questions.
- Compassionate tone.
- If the user reports emergency signs (difficulty breathing, chest pain), STOP questions and tell them to seek medical help immediately.
`;

export const sendMessageToGemini = async (
  currentMessage: string,
  history: Message[],
  image?: string,
  mode: 'standard' | 'symptom_checker' = 'standard'
): Promise<string> => {
  try {
    const modelId = 'gemini-2.5-flash';
    const systemInstruction = mode === 'symptom_checker' ? SYMPTOM_CHECKER_INSTRUCTION : BASE_SYSTEM_INSTRUCTION;

    const parts: any[] = [];
    
    if (image) {
      const base64Data = image.split(',')[1] || image;
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Data
        }
      });
      parts.push({ text: `[Visual Health Check Requested] ${currentMessage || "Analyze health status."}` });
    } else {
      // If we are starting the symptom checker, inject a hidden context if it's the first message of that mode
      if (mode === 'symptom_checker' && currentMessage === "START_SYMPTOM_CHECK") {
         parts.push({ text: "Please start the COVID-19 symptom assessment for me. Ask the first question." });
      } else {
         parts.push({ text: currentMessage });
      }
    }

    // We rely on the single-turn API for simplicity here, but we pass the history via "contents" if we were doing multi-turn properly.
    // For this stateless function, we are just sending the *latest* prompt with a specific system instruction.
    // In a real app, we'd build the full history array for `contents`.
    
    // Quick fix to include history context for continuity:
    let contextPrompt = "";
    if (history.length > 0) {
        const lastCouple = history.slice(-2); // limited context
        contextPrompt = "Previous context:\n" + lastCouple.map(m => `${m.role}: ${m.text}`).join('\n') + "\n\n";
    }

    const finalPrompt = image ? parts : [{ text: contextPrompt + (parts[0]?.text || "") }];

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: finalPrompt as any
      },
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "I apologize, I could not process that request.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I am unable to access the health database at the moment.";
  }
};