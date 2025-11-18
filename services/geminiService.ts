
import { GoogleGenAI } from "@google/genai";

const getAiClient = (apiKey: string) => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }
  return new GoogleGenAI({ apiKey });
};

// Função auxiliar robusta para extrair texto de erros
const getErrorString = (error: any): string => {
    try {
        return JSON.stringify(error, Object.getOwnPropertyNames(error));
    } catch {
        if (typeof error === 'string') return error;
        if (error instanceof Error) return error.message + ' ' + (error.stack || '');
        return String(error);
    }
};

const getDimensions = (aspectRatio: string) => {
    switch (aspectRatio) {
        case '16:9': return { w: 1920, h: 1080 };
        case '9:16': return { w: 1080, h: 1920 };
        case '1:1': return { w: 1080, h: 1080 };
        case '4:3': return { w: 1440, h: 1080 };
        default: return { w: 1920, h: 1080 };
    }
}

// V2: Renomeado para garantir que o código novo seja utilizado e evitar chamadas à API antiga em cache
export const generateSvgThumbnailV2 = async (prompt: string, aspectRatio: string, apiKey: string): Promise<string> => {
  try {
    const ai = getAiClient(apiKey);
    console.log(`[V2] Iniciando geração SVG com Gemini 2.5 Flash para: "${prompt}"`);

    const { w, h } = getDimensions(aspectRatio);

    // Prompt de sistema ultra-específico para SVG robusto
    const systemPrompt = `You are an expert graphic designer and SVG artist. 
    Your task is to generate a high-quality, colorful, and professional YouTube Thumbnail using ONLY raw SVG code.
    
    Rules:
    1. Return ONLY the XML SVG code starting with <svg and ending with </svg>. Do NOT wrap in markdown blocks.
    2. The SVG MUST have a viewBox="0 0 ${w} ${h}" and preserveAspectRatio="xMidYMid slice".
    3. Use width="${w}" and height="${h}" in the svg tag.
    4. Use rich gradients, shadows, and distinct vector shapes.
    5. Do NOT use external images (<image href="...">) as they will not load. Draw everything with vectors (paths, rects, circles).
    6. Style request: Professional, vibrant, high click-through rate.
    7. Do NOT add any text outside of the SVG tags.`;

    const userPrompt = `Create a thumbnail visual description based on this idea: ${prompt}. 
    Render the result directly as SVG code.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Modelo de texto (Free Tier)
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    let text = response.text || "";
    console.log("[V2] Resposta recebida do Gemini. Processando SVG...");
    
    // Limpeza para extrair apenas o SVG caso o modelo coloque markdown
    const svgMatch = text.match(/<svg[\s\S]*?<\/svg>/i);
    if (svgMatch) {
        text = svgMatch[0];
    } else {
         // Fallback de limpeza
         text = text.replace(/```xml/g, '').replace(/```svg/g, '').replace(/```/g, '');
         if (!text.includes('<svg')) {
            throw new Error("O modelo não gerou um código SVG válido.");
         }
    }

    // Codifica para Base64 de forma segura para UTF-8 (emojis, acentos)
    const base64 = btoa(unescape(encodeURIComponent(text)));
    return `data:image/svg+xml;base64,${base64}`;

  } catch (error: any) {
    console.error("Erro ao gerar thumbnail (SVG V2):", error);
    const errorStr = getErrorString(error).toLowerCase();

    if (errorStr.includes('api key not valid') || errorStr.includes('permission') || errorStr.includes('invalid api key')) {
        throw new Error("Sua Chave de API parece ser inválida.");
    }
    
    if (errorStr.includes('quota') || errorStr.includes('429')) {
         throw new Error("Cota da API excedida temporariamente. Tente novamente em instantes.");
    }

    if (errorStr.includes('billing') || errorStr.includes('billed users')) {
        throw new Error("Erro de faturamento detectado. Certifique-se de que está usando o 'Modo Gratuito' atualizado.");
    }

    if (error instanceof Error) {
        throw new Error(error.message);
    }
    
    throw new Error("Falha ao gerar a arte vetorial.");
  }
};

export const enhancePrompt = async (currentPrompt: string, apiKey: string): Promise<string> => {
    try {
        const ai = getAiClient(apiKey);
        const fullPrompt = `Melhore este prompt para criação de arte vetorial/SVG para thumbnail: "${currentPrompt}". Retorne apenas o prompt melhorado em inglês.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
        });

        return response.text ? response.text.trim() : currentPrompt;
    } catch (error) {
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
      text: "Descreva esta imagem visualmente para que eu possa recriá-la como uma arte vetorial SVG. Retorne apenas a descrição."
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
    });

    return response.text ? response.text.trim() : "";
  } catch (error) {
    console.error("Erro ao analisar imagem:", error);
    throw new Error("Não foi possível analisar a imagem.");
  }
};
