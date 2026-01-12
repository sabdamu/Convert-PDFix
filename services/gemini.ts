import { GoogleGenAI, Type } from "@google/genai";

// Fix: Initialize GoogleGenAI using process.env.API_KEY directly as per coding guidelines
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeDocument = async (fileName: string, fileType: string, base64Data?: string) => {
  const ai = getAI();
  const model = 'gemini-3-flash-preview';

  let prompt = `You are a smart document assistant for Convert PDFix. 
  The user is uploading a file named "${fileName}" of type "${fileType}".
  Please provide a professional 3-sentence summary of what this document likely contains 
  and 3 suggestions for how the user can improve or use this document after conversion. 
  Format your response clearly in Indonesian.`;

  try {
    const contents: any[] = [{ text: prompt }];

    if (base64Data && (fileType.includes('image') || fileType.includes('pdf'))) {
      contents.push({
        inlineData: {
          mimeType: fileType.includes('pdf') ? 'application/pdf' : 'image/jpeg',
          data: base64Data
        }
      });
    }

    const response = await ai.models.generateContent({
      model,
      contents: { parts: contents },
    });

    // Fix: Access response.text property directly as per SDK guidelines
    return response.text;
  } catch (error) {
    console.error("Gemini AI error:", error);
    return "Analisis AI tidak tersedia untuk dokumen ini, tetapi konversi Anda sudah siap!";
  }
};

export const simulateConversion = async (toolId: string): Promise<string> => {
  // In a real app, this would be a server-side call to a processing engine.
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`https://picsum.photos/seed/${toolId}/800/600`);
    }, 3000);
  });
};