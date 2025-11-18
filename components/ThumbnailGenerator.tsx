
import React, { useState, useCallback, useEffect } from 'react';
import type { ThumbnailOptions } from '../types';
import { generateSvgThumbnailV2, enhancePrompt, generatePromptFromImage } from '../services/geminiService';
import OptionSelector from './OptionSelector';
import Spinner from './Spinner';
import ImageEditor from './ImageEditor';
import { SparklesIcon } from './icons/SparklesIcon';
import { ImageIcon } from './icons/ImageIcon';
import { STYLE_OPTIONS, ASPECT_RATIO_OPTIONS, COLOR_PALETTE_OPTIONS, BORDER_TYPE_OPTIONS, RANDOM_PROMPTS } from '../constants';

interface ThumbnailGeneratorProps {
  apiKey: string;
  onInvalidApiKey: () => void;
}

const ThumbnailGenerator: React.FC<ThumbnailGeneratorProps> = ({ apiKey, onInvalidApiKey }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [options, setOptions] = useState<ThumbnailOptions>({
    style: 'photorealistic',
    aspectRatio: '16:9',
    colorPalette: 'vibrant',
    borderType: 'none',
    borderColor1: '#4F46E5', // Indigo
    borderColor2: '#EC4899', // Pink
    borderWidth: 16,
  });
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [isGeneratingFromImage, setIsGeneratingFromImage] = useState<boolean>(false);

  useEffect(() => {
    console.log("ThumbnailGenerator V2 (Free SVG Mode) Mounted.");
  }, []);

  const handleOptionsChange = useCallback((newOptions: Partial<ThumbnailOptions>) => {
    setOptions(prev => ({ ...prev, ...newOptions }));
  }, []);

  const applyBorderToImage = (base64Image: string, borderOptions: ThumbnailOptions): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Mesmo se não houver borda, passamos pelo Canvas para "rasterizar" o SVG
      // Isso garante que o editor receba uma imagem manipulável e não um vetor puro
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const borderWidth = (borderOptions.borderType !== 'none') ? borderOptions.borderWidth * 2 : 0;
        
        canvas.width = img.width + borderWidth;
        canvas.height = img.height + borderWidth;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          return reject(new Error('Não foi possível obter o contexto do canvas.'));
        }

        // Preencher fundo (caso o SVG seja transparente em algum ponto)
        ctx.fillStyle = '#1a1a1a'; // Dark bg fallback
        ctx.fillRect(0,0, canvas.width, canvas.height);

        if (borderOptions.borderType === 'solid') {
          ctx.fillStyle = borderOptions.borderColor1;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (borderOptions.borderType === 'gradient') {
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          gradient.addColorStop(0, borderOptions.borderColor1);
          gradient.addColorStop(1, borderOptions.borderColor2);
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Draw image centered
        const x = (borderOptions.borderType !== 'none') ? borderOptions.borderWidth : 0;
        const y = (borderOptions.borderType !== 'none') ? borderOptions.borderWidth : 0;
        ctx.drawImage(img, x, y, img.width, img.height);
        
        resolve(canvas.toDataURL('image/jpeg', 0.95));
      };
      img.onerror = (e) => {
          console.error("Erro ao carregar imagem no canvas:", e);
          reject(new Error('Falha ao processar a imagem gerada.'));
      };
      img.src = base64Image;
    });
  };
  
  const handleApiError = (error: unknown) => {
    const err = error instanceof Error ? error : new Error('Ocorreu um erro desconhecido.');
    if (err.message.includes('inválida')) {
      onInvalidApiKey();
    } else {
      setError(err.message);
    }
  };

  const handleEnhancePrompt = async () => {
    if (!prompt.trim() || isEnhancingPrompt) return;

    setIsEnhancingPrompt(true);
    setError(null);
    try {
        const enhanced = await enhancePrompt(prompt, apiKey);
        setPrompt(enhanced);
    } catch (err) {
        handleApiError(err);
    } finally {
        setIsEnhancingPrompt(false);
    }
  };

  const handleRandomPrompt = () => {
      const randomIndex = Math.floor(Math.random() * RANDOM_PROMPTS.length);
      setPrompt(RANDOM_PROMPTS[randomIndex]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setUploadedImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setUploadedImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleGeneratePromptFromImage = async () => {
    if (!uploadedImageFile) return;

    setIsGeneratingFromImage(true);
    setError(null);
    try {
        const reader = new FileReader();
        reader.readAsDataURL(uploadedImageFile);
        reader.onloadend = async () => {
            try {
                const base64Data = (reader.result as string).split(',')[1];
                const mimeType = uploadedImageFile.type;
                const generatedPrompt = await generatePromptFromImage(base64Data, mimeType, apiKey);
                setPrompt(generatedPrompt);
            } catch(err) {
                 handleApiError(err);
            } finally {
                setIsGeneratingFromImage(false);
            }
        };
        reader.onerror = () => {
             setError("Falha ao ler o arquivo de imagem.");
             setIsGeneratingFromImage(false);
        }
    } catch (err) {
        handleApiError(err);
        setIsGeneratingFromImage(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Por favor, insira uma descrição para a sua thumbnail.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    const stylePrefix = STYLE_OPTIONS.find(opt => opt.id === options.style)?.prompt_prefix || '';
    const colorPrefix = COLOR_PALETTE_OPTIONS.find(opt => opt.id === options.colorPalette)?.prompt_prefix || '';
    
    // Append "vector art" hints to ensure the model knows we want shapes
    const finalPrompt = `${stylePrefix} ${colorPrefix} ${prompt}. Vector art style, clean shapes, svg output.`;

    try {
      // Usando a nova função V2 para garantir uso do modelo Gratuito e quebrar cache
      console.log("Chamando generateSvgThumbnailV2...");
      const baseImageUrl = await generateSvgThumbnailV2(finalPrompt, options.aspectRatio, apiKey);
      
      // SVG precisa ser convertido para raster via canvas para aplicar bordas corretamente
      const processedImage = await applyBorderToImage(baseImageUrl, options);
      setGeneratedImage(processedImage);
      setIsEditing(true); 
    } catch (err) {
      console.error("Erro no handleSubmit:", err);
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoBackToGenerator = () => {
      setIsEditing(false);
      setGeneratedImage(null);
      setError(null);
  }

  if (isEditing && generatedImage) {
      return <ImageEditor baseImage={generatedImage} onBack={handleGoBackToGenerator} />;
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        {isLoading ? (
             <div className="text-center py-20">
                <Spinner large={true} />
                <p className="mt-4 text-gray-400 animate-pulse text-lg">Gerando Arte Vetorial (Modo Grátis)...</p>
                <p className="mt-2 text-sm text-gray-500">Desenhando formas e cores...</p>
             </div>
        ) : (
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
                1. Descreva sua Thumbnail
              </label>
              <div className="relative">
                <textarea
                  id="prompt"
                  rows={3}
                  className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 pr-20 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                  placeholder="Ex: Um astronauta surfando em um anel de Saturno"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                 <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <button
                        type="button"
                        onClick={handleEnhancePrompt}
                        disabled={isEnhancingPrompt || !prompt.trim()}
                        className="p-1.5 rounded-full bg-gray-700 text-indigo-400 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Melhorar prompt com IA"
                        title="Melhorar prompt com IA"
                    >
                        {isEnhancingPrompt ? <Spinner /> : <SparklesIcon />}
                    </button>
                    <button
                        type="button"
                        onClick={handleRandomPrompt}
                        className="p-1.5 rounded-full bg-gray-700 text-yellow-400 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-yellow-500 transition duration-150"
                        aria-label="Surpreenda-me"
                        title="Surpreenda-me (Prompt Aleatório)"
                    >
                        🎲
                    </button>
                </div>
              </div>
            </div>

            <div>
                <div className="relative my-4 flex items-center">
                    <div className="flex-grow border-t border-gray-600"></div>
                    <span className="flex-shrink mx-4 text-gray-500 text-xs">OU</span>
                    <div className="flex-grow border-t border-gray-600"></div>
                </div>

                <div className="p-4 bg-gray-900/50 rounded-md border border-gray-700 space-y-4">
                     <label htmlFor="image-upload" className="block text-sm font-medium text-gray-300">
                        Envie uma imagem de referência
                    </label>
                     <div className="flex items-center gap-4">
                        <input
                        type="file"
                        id="image-upload"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleImageUpload}
                        className="hidden"
                        />
                        <label
                        htmlFor="image-upload"
                        className="cursor-pointer bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-semibold py-2 px-4 rounded-md transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg hover:shadow-blue-500/20 transform hover:-translate-y-0.5"
                        >
                            <ImageIcon />
                            Selecionar...
                        </label>
                        {uploadedImage && <img src={uploadedImage} alt="Preview" className="h-16 w-auto rounded-md object-cover border-2 border-gray-600"/>}
                    </div>

                    {uploadedImage && (
                        <button
                        type="button"
                        onClick={handleGeneratePromptFromImage}
                        disabled={isGeneratingFromImage}
                        className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white font-bold py-2 px-3 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-teal-500 transition duration-150 disabled:opacity-50"
                        >
                        {isGeneratingFromImage ? <Spinner /> : <SparklesIcon />}
                        Gerar Prompt da Imagem
                        </button>
                    )}
                </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">2. Personalize o Estilo</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <OptionSelector
                  label="Estilo Visual"
                  value={options.style}
                  onChange={(value) => handleOptionsChange({ style: value })}
                  options={STYLE_OPTIONS}
                />
                <OptionSelector
                  label="Paleta de Cores"
                  value={options.colorPalette}
                  onChange={(value) => handleOptionsChange({ colorPalette: value })}
                  options={COLOR_PALETTE_OPTIONS}
                />
                 <OptionSelector
                  label="Proporção"
                  value={options.aspectRatio}
                  onChange={(value) => handleOptionsChange({ aspectRatio: value })}
                  options={ASPECT_RATIO_OPTIONS}
                />
              </div>
            </div>
            
            <div>
               <h3 className="text-sm font-medium text-gray-300 mb-2">3. Adicione uma Borda (Opcional)</h3>
                <div className="p-4 bg-gray-900/50 rounded-md border border-gray-700 space-y-4">
                    <OptionSelector
                      label="Tipo de Borda"
                      value={options.borderType}
                      onChange={(value) => handleOptionsChange({ borderType: value as 'none' | 'solid' | 'gradient' })}
                      options={BORDER_TYPE_OPTIONS}
                    />

                    {options.borderType !== 'none' && (
                        <>
                         <div className={`grid ${options.borderType === 'gradient' ? 'grid-cols-2' : 'grid-cols-1'} gap-4 items-center`}>
                            <div className="flex flex-col">
                                <label htmlFor="borderColor1" className="block text-sm font-medium text-gray-400 mb-1">
                                    Cor {options.borderType === 'gradient' ? '1' : ''}
                                </label>
                                <input type="color" id="borderColor1" value={options.borderColor1} onChange={(e) => handleOptionsChange({ borderColor1: e.target.value })} className="w-full h-10 bg-gray-700 rounded-md border border-gray-600 cursor-pointer"/>
                            </div>
                            {options.borderType === 'gradient' && (
                                <div className="flex flex-col">
                                    <label htmlFor="borderColor2" className="block text-sm font-medium text-gray-400 mb-1">Cor 2</label>
                                    <input type="color" id="borderColor2" value={options.borderColor2} onChange={(e) => handleOptionsChange({ borderColor2: e.target.value })} className="w-full h-10 bg-gray-700 rounded-md border border-gray-600 cursor-pointer"/>
                                </div>
                            )}
                        </div>
                        <div>
                             <label htmlFor="borderWidth" className="block text-sm font-medium text-gray-400 mb-1">Espessura: {options.borderWidth}px</label>
                             <input type="range" id="borderWidth" min="2" max="50" value={options.borderWidth} onChange={(e) => handleOptionsChange({ borderWidth: parseInt(e.target.value, 10)})} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                        </div>
                        </>
                    )}
               </div>
            </div>

            {error && (
            <div className="text-center p-4 rounded-md bg-red-900/30 border border-red-800 animate-bounce-short">
                <p className="text-red-400 break-words font-bold mb-1">Ops!</p>
                <p className="text-red-300 text-sm break-words">{error}</p>
            </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold py-3 px-4 rounded-md shadow-lg hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 transition-all duration-200 transform hover:-translate-y-0.5"
            >
                <SparklesIcon />
                Gerar Thumbnail (Grátis)
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};

export default ThumbnailGenerator;
