
import { GoogleGenAI, Modality } from "@google/genai";

const getAiClient = (apiKey: string) => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }
  return new GoogleGenAI({ apiKey });
};

// Função auxiliar robusta para extrair texto de erros
const getErrorString = (error: any): string => {
    try {
        // Tenta stringificar o objeto inteiro primeiro para pegar propriedades aninhadas como 'error.message' do JSON
        return JSON.stringify(error, Object.getOwnPropertyNames(error));
    } catch {
        if (typeof error === 'string') return error;
        if (error instanceof Error) return error.message + ' ' + (error.stack || '');
        return String(error);
    }
};

export const generateThumbnail = async (prompt: string, aspectRatio: string, apiKey: string): Promise<string> => {
  try {
    const ai = getAiClient(apiKey);
    console.log(`Generating with prompt: "${prompt}" and aspect ratio: ${aspectRatio}`);
    
    // Otimizando o prompt para o modelo Flash Image
    const promptWithRatio = `${prompt}. Create a high-quality image with visual impact. Aspect Ratio: ${aspectRatio}. Style: detailed, professional, youtube thumbnail.`;

    // O modelo gemini-2.5-flash-image é o recomendado para geração de imagens
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: promptWithRatio }]
      },
      config: {
        responseModalities: [Modality.IMAGE], 
      },
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (parts && parts.length > 0) {
        for (const part of parts) {
            if (part.inlineData && part.inlineData.data) {
                return `data:image/jpeg;base64,${part.inlineData.data}`;
            }
        }
    }
    
    throw new Error("A API não retornou dados de imagem válidos.");

  } catch (error: any) {
    console.error("Erro ao gerar thumbnail (Raw):", error);
    
    const errorStr = getErrorString(error).toLowerCase();
    
    // Verificações agressivas para erro de billing
    if (errorStr.includes('billed users') || errorStr.includes('billing') || errorStr.includes('imagen api is only accessible to billed users')) {
         throw new Error("BILLING_REQUIRED");
    }

    if (errorStr.includes('api key not valid') || errorStr.includes('permission') || errorStr.includes('invalid api key')) {
        throw new Error("Sua Chave de API parece ser inválida. Verifique se copiou corretamente do Google AI Studio.");
    }
    
    if (errorStr.includes('quota')) {
         throw new Error("Você atingiu sua cota de uso da API. Tente novamente mais tarde.");
    }
    
    if (errorStr.includes('429')) {
        throw new Error("Você atingiu o limite de requisições rápidas. Aguarde um momento e tente novamente.");
    }

    if (error instanceof Error) {
        throw new Error(error.message);
    }
    
    // Fallback usando a string serializada para garantir que o usuário veja algo útil
    throw new Error(getErrorString(error));
  }
};

export const enhancePrompt = async (currentPrompt: string, apiKey: string): Promise<string> => {
    try {
        const ai = getAiClient(apiKey);
        const fullPrompt = `Você é um especialista em criar prompts para IA de geração de imagem. Melhore o seguinte prompt do usuário para ser mais descritivo, vívido e adequado para gerar uma imagem de alta qualidade para thumbnail de YouTube. Retorne APENAS o prompt aprimorado, em inglês (para melhor qualidade), sem aspas e sem explicações. Prompt original: "${currentPrompt}"`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', // Modelo de texto continua free
            contents: fullPrompt,
        });

        return response.text ? response.text.trim() : currentPrompt;
    } catch (error) {
        console.error("Erro ao melhorar o prompt:", error);
        return currentPrompt;
    }
}

export const generatePromptFromImage = async (base64Image: string, mimeType: string, apiKey: string): Promise<string> => {
  try {
    const ai = getAiClient(apiKey);
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };

    const textPart = {
      text: "Analise esta imagem e crie um prompt detalhado para gerar uma imagem com estilo e composição similares, focado em criar uma Thumbnail de YouTube. Retorne apenas o prompt em texto corrido."
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', // Modelo de texto/multimodal continua free
        contents: { parts: [imagePart, textPart] },
    });

    return response.text ? response.text.trim() : "";
  } catch (error) {
    console.error("Erro ao gerar prompt da imagem:", error);
    throw new Error("Não foi possível analisar a imagem de referência.");
  }
};
