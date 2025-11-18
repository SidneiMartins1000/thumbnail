
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { CanvasLayer, TextLayer, VisualLayer } from '../types';
import { FONT_OPTIONS, EMOJI_LIST, STICKER_LIST, TEXT_STYLE_PRESETS, PATTERN_LIST } from '../constants';
import { DownloadIcon } from './icons/DownloadIcon';
import OptionSelector from './OptionSelector';

interface ImageEditorProps {
  baseImage: string;
  onBack: () => void;
}

interface ImageFilters {
    brightness: number;
    contrast: number;
    saturation: number;
}

const stickerImageCache = new Map<string, HTMLImageElement>();
const patternImageCache = new Map<string, HTMLImageElement>();

const preloadStickers = () => {
  STICKER_LIST.forEach(sticker => {
    if (!stickerImageCache.has(sticker.id)) {
      const img = new Image();
      const svgBlob = new Blob([sticker.svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);
      img.src = url;
      img.onload = () => {
        stickerImageCache.set(sticker.id, img);
        URL.revokeObjectURL(url);
      }
    }
  });
};

const preloadPatterns = () => {
    PATTERN_LIST.forEach(pattern => {
        if (!patternImageCache.has(pattern.id)) {
            const img = new Image();
            const svgBlob = new Blob([pattern.svg], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(svgBlob);
            img.src = url;
            img.onload = () => {
                patternImageCache.set(pattern.id, img);
                URL.revokeObjectURL(url);
            }
        }
    });
}

const ImageEditor: React.FC<ImageEditorProps> = ({ baseImage, onBack }) => {
  const [layers, setLayers] = useState<CanvasLayer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'text' | 'visuals' | 'filters'>('text');
  const [filters, setFilters] = useState<ImageFilters>({ brightness: 100, contrast: 100, saturation: 100 });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const selectedLayer = layers.find(layer => layer.id === selectedLayerId);

  useEffect(() => {
    preloadStickers();
    preloadPatterns();
  }, []);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = imageRef.current;

    if (!canvas || !ctx || !img) return;

    const container = canvas.parentElement;
    if (container) {
      const containerWidth = container.clientWidth;
      const scale = containerWidth / img.naturalWidth;
      canvas.width = containerWidth;
      canvas.height = img.naturalHeight * scale;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply filters to background image only
    ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%)`;
    
    // Reset shadows/styles to draw background clean
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    // Reset filter for other layers
    ctx.filter = 'none';

    layers.forEach(layer => {
      if (layer.type === 'text') {
        ctx.textBaseline = 'top';
        ctx.font = `bold ${layer.fontSize}px "${layer.fontFamily}"`;
        
        const textX = layer.x * canvas.width / 100;
        const textY = layer.y * canvas.height / 100;

        // 1. Configurar Sombra (aplica-se ao preenchimento e borda)
        if (layer.shadowBlur || layer.shadowOffsetX || layer.shadowOffsetY) {
            ctx.shadowColor = layer.shadowColor || 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = layer.shadowBlur || 0;
            ctx.shadowOffsetX = layer.shadowOffsetX || 0;
            ctx.shadowOffsetY = layer.shadowOffsetY || 0;
        } else {
             ctx.shadowColor = 'transparent';
             ctx.shadowBlur = 0;
        }

        // 2. Configurar Cor/Degradê/Pattern
        if (layer.fillType === 'gradient') {
             const gradient = ctx.createLinearGradient(
                 textX, 
                 textY, 
                 layer.gradientDirection === 90 ? textX : textX, 
                 layer.gradientDirection === 90 ? textY + layer.fontSize : textY + layer.fontSize
             );
             gradient.addColorStop(0, layer.color);
             gradient.addColorStop(1, layer.gradientColor2 || '#000000');
             ctx.fillStyle = gradient;
        } else if (layer.fillType === 'pattern' && layer.patternId) {
            const patternImg = patternImageCache.get(layer.patternId);
            if (patternImg && patternImg.complete) {
                const pattern = ctx.createPattern(patternImg, 'repeat');
                ctx.fillStyle = pattern || layer.color;
            } else {
                ctx.fillStyle = layer.color; // Fallback
            }
        } else {
             ctx.fillStyle = layer.color;
        }

        ctx.strokeStyle = layer.strokeColor;
        ctx.lineWidth = layer.strokeWidth;
        
        // 3. Desenhar (Borda primeiro para ficar "atrás" do preenchimento fino, ou depois para "encobrir")
        if(layer.strokeWidth > 0) {
            ctx.strokeText(layer.text, textX, textY);
        }
        
        ctx.fillText(layer.text, textX, textY);

        // Resetar sombra para o próximo item
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

      } else {
        const itemSize = layer.size * canvas.width / 100;
        const layerX = layer.x * canvas.width / 100;
        const layerY = layer.y * canvas.height / 100;

        if (layer.type === 'emoji') {
          ctx.font = `${itemSize}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(layer.content, layerX, layerY);
          ctx.textAlign = 'start';
          ctx.textBaseline = 'alphabetic';
        } else if (layer.type === 'sticker') {
          const stickerImg = stickerImageCache.get(layer.content);
          if (stickerImg?.complete) {
            ctx.drawImage(stickerImg, layerX - itemSize / 2, layerY - itemSize / 2, itemSize, itemSize);
          }
        }
      }
    });
  }, [layers, filters]);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = baseImage;
    img.onload = () => { imageRef.current = img; drawCanvas(); };
  }, [baseImage, drawCanvas]);

  useEffect(() => {
    drawCanvas();
  }, [layers, filters, drawCanvas]);

  useEffect(() => {
    window.addEventListener('resize', drawCanvas);
    return () => window.removeEventListener('resize', drawCanvas);
  }, [drawCanvas]);
  
  const addTextLayer = () => {
    const newLayer: TextLayer = { 
        id: Date.now(), 
        type: 'text', 
        text: 'Texto Editável', 
        fontFamily: 'Anton', 
        fontSize: 80, 
        fillType: 'solid', 
        color: '#FFFFFF', 
        strokeColor: '#000000', 
        strokeWidth: 5, 
        x: 20, 
        y: 40,
        shadowColor: 'rgba(0,0,0,0.5)',
        shadowBlur: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0
    };
    setLayers(prev => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
  };
  
  const addVisualLayer = (type: 'emoji' | 'sticker', content: string) => {
    const newLayer: VisualLayer = { id: Date.now(), type, content, size: 25, x: 50, y: 50 };
    setLayers(prev => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  const updateSelectedLayer = (updates: Partial<CanvasLayer>) => {
    if (selectedLayerId === null) return;
    setLayers(prev => prev.map(layer => layer.id === selectedLayerId ? { ...layer, ...updates } as CanvasLayer : layer));
  };

  const moveLayerForward = () => {
      if (selectedLayerId === null) return;
      const index = layers.findIndex(l => l.id === selectedLayerId);
      if (index < layers.length - 1) {
          const newLayers = [...layers];
          [newLayers[index], newLayers[index + 1]] = [newLayers[index + 1], newLayers[index]];
          setLayers(newLayers);
      }
  };

  const moveLayerBackward = () => {
    if (selectedLayerId === null) return;
    const index = layers.findIndex(l => l.id === selectedLayerId);
    if (index > 0) {
        const newLayers = [...layers];
        [newLayers[index], newLayers[index - 1]] = [newLayers[index - 1], newLayers[index]];
        setLayers(newLayers);
    }
  };

  const applyTextPreset = (presetId: string) => {
      const preset = TEXT_STYLE_PRESETS.find(p => p.id === presetId);
      if (preset && selectedLayer?.type === 'text') {
          updateSelectedLayer(preset.properties);
      }
  }
  
  const deleteSelectedLayer = () => {
    if (selectedLayerId === null) return;
    setLayers(prev => prev.filter(layer => layer.id !== selectedLayerId));
    setSelectedLayerId(null);
  };

  const getLayerAtPosition = (x: number, y: number): CanvasLayer | null => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return null;

    for (let i = layers.length - 1; i >= 0; i--) {
        const layer = layers[i];
        if (layer.type === 'text') {
            ctx.font = `bold ${layer.fontSize}px "${layer.fontFamily}"`;
            const metrics = ctx.measureText(layer.text);
            const layerX = layer.x * canvas.width / 100;
            const layerY = layer.y * canvas.height / 100;
            if (x >= layerX && x <= layerX + metrics.width && y >= layerY && y <= layerY + layer.fontSize) return layer;
        } else {
            const itemSize = layer.size * canvas.width / 100;
            const layerX = layer.x * canvas.width / 100;
            const layerY = layer.y * canvas.height / 100;
            if (x >= layerX - itemSize/2 && x <= layerX + itemSize/2 && y >= layerY - itemSize/2 && y <= layerY + itemSize/2) return layer;
        }
    }
    return null;
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const clickedLayer = getLayerAtPosition(x, y);
    if (clickedLayer) {
        setSelectedLayerId(clickedLayer.id);
        setIsDragging(true);
        setDragStart({ x, y });
    } else {
        setSelectedLayerId(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!isDragging || !canvas || selectedLayerId === null) return;
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    const dx = currentX - dragStart.x;
    const dy = currentY - dragStart.y;
    updateSelectedLayer({ x: selectedLayer!.x + (dx / canvas.width) * 100, y: selectedLayer!.y + (dy / canvas.height) * 100, });
    setDragStart({ x: currentX, y: currentY });
  };
  
  const handleMouseUp = () => setIsDragging(false);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!img || !canvas) return;

    const downloadCanvas = document.createElement('canvas');
    downloadCanvas.width = img.naturalWidth;
    downloadCanvas.height = img.naturalHeight;
    const ctx = downloadCanvas.getContext('2d');
    if (!ctx) return;
    
    // Apply filters to download canvas
    ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%)`;
    ctx.drawImage(img, 0, 0);
    ctx.filter = 'none';

    layers.forEach(layer => {
      const scale = downloadCanvas.width / canvas.width;
      if (layer.type === 'text') {
        ctx.textBaseline = 'top';
        ctx.font = `bold ${layer.fontSize * scale}px "${layer.fontFamily}"`;
        
        const textX = layer.x * downloadCanvas.width / 100;
        const textY = layer.y * downloadCanvas.height / 100;

        // Sombra
         if (layer.shadowBlur || layer.shadowOffsetX || layer.shadowOffsetY) {
            ctx.shadowColor = layer.shadowColor || 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = layer.shadowBlur ? layer.shadowBlur * scale : 0;
            ctx.shadowOffsetX = layer.shadowOffsetX ? layer.shadowOffsetX * scale : 0;
            ctx.shadowOffsetY = layer.shadowOffsetY ? layer.shadowOffsetY * scale : 0;
        } else {
             ctx.shadowColor = 'transparent';
             ctx.shadowBlur = 0;
        }

        // Cor / Gradient / Pattern
        if (layer.fillType === 'gradient') {
             const gradient = ctx.createLinearGradient(
                 textX, 
                 textY, 
                 layer.gradientDirection === 90 ? textX : textX, 
                 layer.gradientDirection === 90 ? textY + (layer.fontSize * scale) : textY + (layer.fontSize * scale)
             );
             gradient.addColorStop(0, layer.color);
             gradient.addColorStop(1, layer.gradientColor2 || '#000000');
             ctx.fillStyle = gradient;
        } else if (layer.fillType === 'pattern' && layer.patternId) {
            const patternImg = patternImageCache.get(layer.patternId);
            if (patternImg && patternImg.complete) {
                const pattern = ctx.createPattern(patternImg, 'repeat');
                // Transform pattern if needed (not trivial in standard canvas api without setTransform which affects everything)
                // For now, patterns scale with the image naturally
                ctx.fillStyle = pattern || layer.color;
            } else {
                ctx.fillStyle = layer.color;
            }
        } else {
             ctx.fillStyle = layer.color;
        }

        ctx.strokeStyle = layer.strokeColor;
        ctx.lineWidth = layer.strokeWidth * scale;
        
        if (layer.strokeWidth > 0) ctx.strokeText(layer.text, textX, textY);
        ctx.fillText(layer.text, textX, textY);

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;

      } else {
        const itemSize = (layer.size * canvas.width / 100) * scale;
        const layerX = (layer.x * canvas.width / 100) * scale;
        const layerY = (layer.y * canvas.height / 100) * scale;
        if (layer.type === 'emoji') {
          ctx.font = `${itemSize}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(layer.content, layerX, layerY);
          ctx.textAlign = 'start';
          ctx.textBaseline = 'alphabetic';
        } else if (layer.type === 'sticker') {
          const stickerImg = stickerImageCache.get(layer.content);
          if (stickerImg?.complete) {
            ctx.drawImage(stickerImg, layerX - itemSize/2, layerY - itemSize/2, itemSize, itemSize);
          }
        }
      }
    });

    const link = document.createElement('a');
    link.download = 'thumbnail_editada.jpg';
    link.href = downloadCanvas.toDataURL('image/jpeg', 0.9);
    link.click();
  };

  const renderSelectedLayerControls = () => {
    if (!selectedLayer) {
        return (
             <div className="text-center text-gray-500 p-4 border-2 border-dashed border-gray-600 rounded-md">
                <p>Selecione uma camada na imagem para editá-la.</p>
             </div>
        )
    }

    return (
        <div className="p-4 bg-gray-900/50 rounded-md border border-gray-700 space-y-6 overflow-y-auto max-h-[600px]">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-indigo-400">Editar Camada</h3>
                <div className="flex gap-1">
                     <button onClick={moveLayerBackward} title="Enviar para Trás" className="p-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition">
                        ⬇️
                    </button>
                    <button onClick={moveLayerForward} title="Trazer para Frente" className="p-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition">
                        ⬆️
                    </button>
                    <button onClick={deleteSelectedLayer} className="ml-2 text-xs bg-red-900/50 text-red-300 px-2 py-1 rounded hover:bg-red-900 transition">
                        Excluir
                    </button>
                </div>
            </div>
            
            {selectedLayer.type === 'text' && (
                <>
                    {/* Seção de Texto */}
                    <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase mb-1 block">Conteúdo</label>
                        <input type="text" value={(selectedLayer as TextLayer).text} onChange={e => updateSelectedLayer({ text: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-indigo-500" />
                    </div>

                    {/* Estilos Prontos */}
                    <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase mb-2 block">Estilos Prontos</label>
                        <div className="grid grid-cols-3 gap-2">
                            {TEXT_STYLE_PRESETS.map(preset => (
                                <button
                                    key={preset.id}
                                    onClick={() => applyTextPreset(preset.id)}
                                    className="h-10 rounded-md border border-gray-600 hover:border-white transition relative overflow-hidden group"
                                    title={preset.name}
                                >
                                    <div className="absolute inset-0 w-full h-full" style={{ background: preset.previewColor }}></div>
                                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-black/70 group-hover:text-black bg-white/20 backdrop-blur-[1px]">
                                        {preset.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-gray-700 pt-4"></div>

                    {/* Fonte e Tamanho */}
                    <div className="space-y-3">
                         <OptionSelector label="Fonte" value={(selectedLayer as TextLayer).fontFamily} onChange={value => updateSelectedLayer({ fontFamily: value })} options={FONT_OPTIONS} />
                        <div>
                            <label className="text-xs text-gray-400 mb-1 block">Tamanho: {(selectedLayer as TextLayer).fontSize}px</label>
                            <input type="range" min="10" max="200" value={(selectedLayer as TextLayer).fontSize} onChange={e => updateSelectedLayer({ fontSize: parseInt(e.target.value, 10) })} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                        </div>
                    </div>

                    <div className="border-t border-gray-700 pt-4"></div>

                    {/* Cores e Degradê */}
                     <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase mb-2 block">Preenchimento</label>
                        <div className="flex gap-1 mb-3">
                            <button 
                                onClick={() => updateSelectedLayer({ fillType: 'solid' })}
                                className={`flex-1 py-1 text-[10px] uppercase font-bold rounded ${selectedLayer.fillType === 'solid' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-400'}`}
                            >
                                Sólido
                            </button>
                            <button 
                                onClick={() => updateSelectedLayer({ fillType: 'gradient' })}
                                className={`flex-1 py-1 text-[10px] uppercase font-bold rounded ${selectedLayer.fillType === 'gradient' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-400'}`}
                            >
                                Degradê
                            </button>
                            <button 
                                onClick={() => updateSelectedLayer({ fillType: 'pattern' })}
                                className={`flex-1 py-1 text-[10px] uppercase font-bold rounded ${selectedLayer.fillType === 'pattern' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-400'}`}
                            >
                                Textura
                            </button>
                        </div>

                        {selectedLayer.fillType === 'solid' && (
                             <div>
                                <label className="text-xs text-gray-500 mb-1 block">Cor</label>
                                <input type="color" value={(selectedLayer as TextLayer).color} onChange={e => updateSelectedLayer({ color: e.target.value })} className="w-full h-8 bg-gray-700 rounded cursor-pointer border-0 p-0" />
                            </div>
                        )}

                        {selectedLayer.fillType === 'gradient' && (
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Cor Inicial</label>
                                    <input type="color" value={(selectedLayer as TextLayer).color} onChange={e => updateSelectedLayer({ color: e.target.value })} className="w-full h-8 bg-gray-700 rounded cursor-pointer border-0 p-0" />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Cor Final</label>
                                    <input type="color" value={(selectedLayer as TextLayer).gradientColor2 || '#000000'} onChange={e => updateSelectedLayer({ gradientColor2: e.target.value })} className="w-full h-8 bg-gray-700 rounded cursor-pointer border-0 p-0" />
                                </div>
                            </div>
                        )}

                        {selectedLayer.fillType === 'pattern' && (
                             <div className="grid grid-cols-4 gap-2">
                                {PATTERN_LIST.map(pattern => (
                                    <button 
                                        key={pattern.id} 
                                        onClick={() => updateSelectedLayer({ patternId: pattern.id })}
                                        className={`aspect-square rounded border-2 overflow-hidden relative hover:scale-105 transition ${selectedLayer.patternId === pattern.id ? 'border-indigo-500' : 'border-gray-600'}`}
                                        title={pattern.name}
                                    >
                                        <img src={`data:image/svg+xml;base64,${btoa(pattern.svg)}`} alt={pattern.name} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                             </div>
                        )}
                    </div>

                    {/* Contorno */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-xs font-semibold text-gray-400 uppercase">Contorno</label>
                            <input type="color" value={(selectedLayer as TextLayer).strokeColor} onChange={e => updateSelectedLayer({ strokeColor: e.target.value })} className="h-6 w-6 bg-transparent border-none cursor-pointer" />
                        </div>
                        <input type="range" min="0" max="20" value={(selectedLayer as TextLayer).strokeWidth} onChange={e => updateSelectedLayer({ strokeWidth: parseInt(e.target.value, 10) })} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                    </div>

                    {/* Sombra */}
                    <div className="bg-gray-800/50 p-2 rounded border border-gray-700">
                        <div className="flex justify-between items-center mb-2">
                             <label className="text-xs font-semibold text-gray-400 uppercase">Sombra</label>
                             <input type="color" value={(selectedLayer as TextLayer).shadowColor || '#000000'} onChange={e => updateSelectedLayer({ shadowColor: e.target.value })} className="h-5 w-5 bg-transparent border-none cursor-pointer" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-[10px] text-gray-500">Desfoque</label>
                                <input type="number" value={(selectedLayer as TextLayer).shadowBlur || 0} onChange={e => updateSelectedLayer({ shadowBlur: parseInt(e.target.value, 10) })} className="w-full bg-gray-700 rounded px-2 py-1 text-xs" />
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-500">Posição Y</label>
                                <input type="number" value={(selectedLayer as TextLayer).shadowOffsetY || 0} onChange={e => updateSelectedLayer({ shadowOffsetY: parseInt(e.target.value, 10) })} className="w-full bg-gray-700 rounded px-2 py-1 text-xs" />
                            </div>
                        </div>
                    </div>
                </>
            )}
             {(selectedLayer.type === 'emoji' || selectedLayer.type === 'sticker') && (
                 <div>
                    <label className="text-sm text-gray-400">Tamanho: {(selectedLayer as VisualLayer).size}%</label>
                    <input type="range" min="5" max="100" value={(selectedLayer as VisualLayer).size} onChange={e => updateSelectedLayer({ size: parseInt(e.target.value, 10) })} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                </div>
             )}
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <div className="lg:col-span-2 bg-gray-900 p-2 rounded-lg border border-gray-700 flex items-center justify-center min-h-[400px]">
        <canvas ref={canvasRef} className="w-full h-auto rounded-md cursor-grab shadow-2xl" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} />
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 space-y-4 flex flex-col h-full max-h-[800px]">
        <h2 className="text-xl font-bold text-white">Editor</h2>
        
        <div>
            <div className="flex border-b border-gray-700 overflow-x-auto">
                <button onClick={() => setActiveTab('text')} className={`py-2 px-4 font-semibold -mb-px whitespace-nowrap transition ${activeTab === 'text' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:bg-gray-700/50'}`}>Texto</button>
                <button onClick={() => setActiveTab('visuals')} className={`py-2 px-4 font-semibold -mb-px whitespace-nowrap transition ${activeTab === 'visuals' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:bg-gray-700/50'}`}>Stickers</button>
                <button onClick={() => setActiveTab('filters')} className={`py-2 px-4 font-semibold -mb-px whitespace-nowrap transition ${activeTab === 'filters' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:bg-gray-700/50'}`}>Ajustes</button>
            </div>
            <div className="pt-4">
                {activeTab === 'text' && (
                    <button onClick={addTextLayer} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition shadow-md">Adicionar Texto</button>
                )}
                {activeTab === 'visuals' && (
                    <div className="space-y-4 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 mb-2">Emojis</h3>
                            <div className="grid grid-cols-8 gap-2">
                                {EMOJI_LIST.map(emoji => <button key={emoji} onClick={() => addVisualLayer('emoji', emoji)} className="text-xl rounded-md bg-gray-700 hover:bg-gray-600 p-1 transition transform hover:scale-110">{emoji}</button>)}
                            </div>
                        </div>
                         <div>
                            <h3 className="text-sm font-semibold text-gray-400 mb-2">Stickers</h3>
                            <div className="grid grid-cols-4 gap-2">
                                {STICKER_LIST.map(sticker => <button key={sticker.id} title={sticker.name} onClick={() => addVisualLayer('sticker', sticker.id)} className="rounded-md bg-gray-700 hover:bg-gray-600 p-2 transition aspect-square flex items-center justify-center transform hover:scale-105" dangerouslySetInnerHTML={{ __html: sticker.svg }} />)}
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'filters' && (
                    <div className="space-y-4 p-2">
                        <div>
                            <label className="text-sm font-medium text-gray-300 flex justify-between">
                                <span>Brilho</span>
                                <span>{filters.brightness}%</span>
                            </label>
                            <input type="range" min="0" max="200" value={filters.brightness} onChange={e => setFilters(prev => ({...prev, brightness: parseInt(e.target.value)}))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-300 flex justify-between">
                                <span>Contraste</span>
                                <span>{filters.contrast}%</span>
                            </label>
                            <input type="range" min="0" max="200" value={filters.contrast} onChange={e => setFilters(prev => ({...prev, contrast: parseInt(e.target.value)}))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-300 flex justify-between">
                                <span>Saturação</span>
                                <span>{filters.saturation}%</span>
                            </label>
                            <input type="range" min="0" max="200" value={filters.saturation} onChange={e => setFilters(prev => ({...prev, saturation: parseInt(e.target.value)}))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                        </div>
                         <button 
                            onClick={() => setFilters({ brightness: 100, contrast: 100, saturation: 100 })}
                            className="text-xs text-gray-400 underline hover:text-white mt-2"
                        >
                            Resetar Filtros
                        </button>
                    </div>
                )}
            </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
             {activeTab !== 'filters' && renderSelectedLayerControls()}
        </div>

        <div className="pt-4 border-t border-gray-700 space-y-2 mt-auto">
            <button onClick={handleDownload} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold py-3 px-4 rounded-md hover:from-green-500 hover:to-green-400 transition shadow-lg">
              <DownloadIcon />
              Baixar Imagem Final
            </button>
             <button onClick={onBack} className="w-full bg-gray-700 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-600 transition">
                Gerar Outra Imagem
            </button>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;