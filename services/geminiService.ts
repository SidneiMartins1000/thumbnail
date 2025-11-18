import { GoogleGenAI } from "@google/genai";

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
    
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: aspectRatio,
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      throw new Error("A API não retornou imagens.");
    }
  } catch (error) {
    console.error("Erro ao gerar thumbnail:", error);
    if (error instanceof Error && (error.message.includes('API key not valid') || error.message.includes('permission') || error.message.includes('invalid'))) {
        throw new Error("Sua Chave de API parece ser inválida. Por favor, verifique e tente novamente.");
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

        return response.text.trim();
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

    return response.text.trim();
  } catch (error) {
    console.error("Erro ao gerar prompt da imagem:", error);
    if (error instanceof Error && (error.message.includes('API key not valid') || error.message.includes('permission') || error.message.includes('invalid'))) {
        throw new Error("Sua Chave de API parece ser inválida. Por favor, verifique e tente novamente.");
    }
    throw new Error("Falha ao gerar prompt da imagem. Verifique o console.");
  }
};
