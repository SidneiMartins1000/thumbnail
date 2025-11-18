import { GoogleGenAI, Modality } from "@google/genai";

const getAiClient = (apiKey: string) => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }
  return new GoogleGenAI({ apiKey });
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
    console.error("Erro ao gerar thumbnail:", error);
    
    if (error instanceof Error) {
        const msg = error.message.toLowerCase();
        const apiErrorBody = (error as any).body || (error as any).response; // Tenta pegar o corpo do erro da API se disponível

        if (msg.includes('api key not valid') || msg.includes('permission') || msg.includes('invalid api key')) {
            throw new Error("Sua Chave de API parece ser inválida. Verifique se copiou corretamente do Google AI Studio.");
        }
        
        // Erro específico de billing para imagem
        if (msg.includes('imagen api is only accessible to billed users') || msg.includes('billed users')) {
             throw new Error("⚠️ A geração de imagens requer que o projeto no Google AI Studio tenha faturamento ativado (Billing). Adicione um método de pagamento no seu projeto do Google Cloud para usar este recurso.");
        }

        if (msg.includes('quota')) {
             throw new Error("Você atingiu sua cota de uso da API. Tente novamente mais tarde.");
        }
        
        if (msg.includes('429')) {
            throw new Error("Você atingiu o limite de requisições rápidas. Aguarde um momento e tente novamente.");
        }
    }
    throw new Error(`Erro na geração: ${error.message || "Falha de comunicação com a API"}`);
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
        // Falha silenciosa ou retorno do original em caso de erro na melhoria
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
