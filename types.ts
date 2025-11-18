
export interface ThumbnailOptions {
  style: string;
  aspectRatio: string;
  colorPalette: string;
  borderType: 'none' | 'solid' | 'gradient';
  borderColor1: string;
  borderColor2: string;
  borderWidth: number;
}

export interface OptionItem {
  id: string;
  name: string;
  prompt_prefix?: string;
}

export interface BaseLayer {
  id: number;
  x: number; // percentage
  y: number; // percentage
}

export interface TextLayer extends BaseLayer {
  type: 'text';
  text: string;
  fontFamily: string;
  fontSize: number; // represents a base size, will be scaled
  
  // Preenchimento
  fillType: 'solid' | 'gradient' | 'pattern';
  color: string; // Usado como cor sólida ou cor inicial do degradê
  gradientColor2?: string; // Cor final do degradê
  gradientDirection?: number; // Em graus (0-360)
  patternId?: string; // ID da textura/estampa

  // Borda/Contorno
  strokeColor: string;
  strokeWidth: number;

  // Sombra
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
}

export interface VisualLayer extends BaseLayer {
  type: 'emoji' | 'sticker';
  content: string; // emoji character or sticker ID
  size: number; // percentage of canvas width
}

export type CanvasLayer = TextLayer | VisualLayer;

export interface TextStylePreset {
  id: string;
  name: string;
  previewColor: string; // CSS gradient or color for the button
  properties: Partial<TextLayer>;
}
