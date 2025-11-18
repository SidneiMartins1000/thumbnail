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
    
    // Otimizando o prompt para o modelo Flash Image que depende da descrição textual para proporção
    const promptWithRatio = `${prompt}. Create a high-quality image with visual impact. Aspect Ratio: ${aspectRatio}. Style: detailed, professional.`;

    // IMPORTANTE: Usando gemini-2.5-flash-image. 
    // Se este modelo falhar com erro de "billed users", verifique se sua chave de API tem permissão 
    // ou se o index.html não está carregando scripts conflitantes (importmap).
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: promptWithRatio }]
      },
      config: {
        responseModalities: [Modality.IMAGE], 
      },
    });

    // O formato de resposta do generateContent para imagens é via inlineData
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts && parts.length > 0) {
        for (const part of parts) {
            if (part.inlineData && part.inlineData.data) {
                return `data:image/jpeg;base64,${part.inlineData.data}`;
            }
        }
    }
    
    throw new Error("A API não retornou imagens.");

  } catch (error: any) {
    console.error("Erro ao gerar thumbnail:", error);
    
    if (error instanceof Error) {
        if (error.message.includes('API key not valid') || error.message.includes('permission') || error.message.includes('invalid')) {
            throw new Error("Sua Chave de API parece ser inválida. Por favor, verifique e tente novamente.");
        }
        // Erro específico de Billing (Faturamento)
        if (error.message.includes('billed users') || error.message.includes('400')) {
             throw new Error("Acesso negado pelo Google (Billing). Tente gerar uma nova chave de API em um projeto diferente no Google AI Studio ou aguarde alguns instantes.");
        }
    }
    throw new Error("Falha ao se comunicar com a API do Gemini. Verifique o console para mais detalhes.");
  }
};

export const enhancePrompt = async (currentPrompt: string, apiKey: string): Promise<string> => {
    try {
        const ai = getAiClient(apiKey);
        const fullPrompt = `Você é um especialista em criar prompts para IA de geração de imagem. Melhore o seguinte prompt do usuário para ser mais descritivo, vívido e adequado para gerar uma imagem de alta qualidade e visualmente atraente. Retorne apenas o prompt aprimorado, sem nenhum texto extra ou explicações. Prompt do usuário: "${currentPrompt}"`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
        });

        return response.text ? response.text.trim() : currentPrompt;
    } catch (error) {
        console.error("Erro ao melhorar o prompt:", error);
        if (error instanceof Error && (error.message.includes('API key not valid') || error.message.includes('permission') || error.message.includes('invalid'))) {
            throw new Error("Sua Chave de API parece ser inválida. Por favor, verifique e tente novamente.");
        }
        throw new Error("Falha ao melhorar o prompt com a IA. Tente novamente.");
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
      text: "Descreva esta imagem em detalhes para que eu possa usar a descrição como um prompt para gerar uma imagem semelhante. Foque nos elementos visuais, estilo, cores e composição. A descrição deve ser otimizada para uma IA de geração de imagem. Retorne apenas o prompt, sem nenhuma frase introdutória como 'Claro, aqui está o prompt:'."
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', // Vision model
        contents: { parts: [imagePart, textPart] },
    });

    return response.text ? response.text.trim() : "";
  } catch (error) {
    console.error("Erro ao gerar prompt da imagem:", error);
    if (error instanceof Error && (error.message.includes('API key not valid') || error.message.includes('permission') || error.message.includes('invalid'))) {
        throw new Error("Sua Chave de API parece ser inválida. Por favor, verifique e tente novamente.");
    }
    throw new Error("Falha ao gerar prompt da imagem. Verifique o console.");
  }
};
