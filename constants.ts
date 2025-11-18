
import type { OptionItem, TextStylePreset } from './types';

export const STYLE_OPTIONS: OptionItem[] = [
  { id: 'none', name: 'Nenhum', prompt_prefix: '' },
  { id: 'photorealistic', name: 'Fotorrealista', prompt_prefix: 'photorealistic, 8k, ultra detailed, sharp focus,' },
  { id: 'cinematic', name: 'Cinematográfico', prompt_prefix: 'cinematic still, epic lighting, dramatic, high contrast,' },
  { id: 'gaming', name: 'Gaming / E-sports', prompt_prefix: 'epic gaming thumbnail, dynamic action, vibrant colors, digital art, esports style,' },
  { id: 'anime', name: 'Anime Vibrante', prompt_prefix: 'vibrant anime style, detailed background, dynamic pose, trending on pixiv,' },
  { id: 'cyberpunk', name: 'Cyberpunk / Neon', prompt_prefix: 'cyberpunk style, neon lights, futuristic, high tech, night city background, glowing effects,' },
  { id: 'comic', name: 'HQs / Pop Art', prompt_prefix: 'comic book style, pop art, bold outlines, halftone dots, vibrant colors, expressive,' },
  { id: 'horror', name: 'Terror / Horror', prompt_prefix: 'horror theme, spooky atmosphere, dark shadows, ominous lighting, scary, high contrast,' },
  { id: 'gta', name: 'Estilo GTA', prompt_prefix: 'GTA loading screen art style, grand theft auto artwork, cel shaded, realistic characters with bold outlines, digital painting,' },
  { id: 'minecraft', name: 'Minecraft / Voxel', prompt_prefix: 'minecraft style, voxel art, blocky world, ray tracing shaders, bright colors, 3d render,' },
  { id: 'roblox', name: 'Roblox 3D', prompt_prefix: 'roblox game style, 3d character render, smooth plastic texture, bright studio lighting, fun atmosphere,' },
  { id: 'lego', name: 'LEGO', prompt_prefix: 'lego style, plastic bricks, macro photography, depth of field, playful,' },
  { id: 'vaporwave', name: 'Vaporwave / Retrô 80s', prompt_prefix: 'vaporwave aesthetic, synthwave, 80s retro style, neon pink and blue, nostalgic, glitch art elements,' },
  { id: 'claymation', name: 'Massinha / Claymation', prompt_prefix: 'claymation style, plasticine texture, stop motion animation look, soft rounded shapes, studio lighting,' },
  { id: 'pixel_art', name: 'Pixel Art', prompt_prefix: 'pixel art style, 16-bit graphics, retro game aesthetic, blocky details,' },
  { id: 'oil_painting', name: 'Pintura a Óleo', prompt_prefix: 'oil painting style, thick brushstrokes, artistic texture, classical art style, masterpiece,' },
  { id: 'vector', name: 'Arte Vetorial / Flat', prompt_prefix: 'vector art, flat design, clean lines, solid colors, minimalist illustrator style, corporate memphis,' },
  { id: 'minimalist', name: 'Minimalista', prompt_prefix: 'minimalist design, clean background, simple shapes, elegant,' },
  { id: '3d_render', name: 'Render 3D Profissional', prompt_prefix: '3d render, octane render, trending on artstation, isometric, cinema 4d,' },
];

export const ASPECT_RATIO_OPTIONS: OptionItem[] = [
  { id: '16:9', name: '16:9 (YouTube)' },
  { id: '9:16', name: '9:16 (Shorts/Stories)' },
  { id: '1:1', name: '1:1 (Quadrado)' },
  { id: '4:3', name: '4:3 (Clássico)' },
];

export const COLOR_PALETTE_OPTIONS: OptionItem[] = [
  { id: 'none', name: 'Nenhuma', prompt_prefix: '' },
  { id: 'vibrant', name: 'Vibrante e Contrastante', prompt_prefix: 'vibrant color scheme, high contrast, neon accents,' },
  { id: 'dark_moody', name: 'Escuro e Intimista', prompt_prefix: 'dark and moody color palette, deep shadows, dramatic lighting,' },
  { id: 'bright_clean', name: 'Claro e Limpo', prompt_prefix: 'bright and clean color palette, soft lighting, airy feel,' },
  { id: 'retro', name: 'Retrô', prompt_prefix: 'retro color palette, 80s synthwave aesthetic, vintage feel,' },
  { id: 'pastel', name: 'Tons Pastel', prompt_prefix: 'soft pastel color palette, gentle colors, dreamy atmosphere,' },
  { id: 'golden_hour', name: 'Golden Hour (Pôr do Sol)', prompt_prefix: 'golden hour lighting, warm tones, sun flare, orange and teal,' },
];

export const BORDER_TYPE_OPTIONS: OptionItem[] = [
    { id: 'none', name: 'Nenhuma' },
    { id: 'solid', name: 'Sólida' },
    { id: 'gradient', name: 'Degradê' },
];

export const FONT_OPTIONS: OptionItem[] = [
    { id: 'Anton', name: 'Anton (Impacto)' },
    { id: 'Bebas Neue', name: 'Bebas Neue (Alto)' },
    { id: 'Oswald', name: 'Oswald (Moderno)' },
    { id: 'Montserrat', name: 'Montserrat (Geométrico)' },
    { id: 'Poppins', name: 'Poppins (Redondo)' },
    { id: 'Roboto', name: 'Roboto (Padrão)' },
    { id: 'Open Sans', name: 'Open Sans (Limpo)' },
    { id: 'Lato', name: 'Lato (Amigável)' },
    { id: 'Bangers', name: 'Bangers (Quadrinhos)' },
    { id: 'Permanent Marker', name: 'Permanent Marker (Canetão)' },
    { id: 'Press Start 2P', name: 'Press Start 2P (Pixel)' },
    { id: 'Creepster', name: 'Creepster (Terror)' },
    { id: 'Lobster', name: 'Lobster (Cursiva)' },
    { id: 'Pacifico', name: 'Pacifico (Manuscrito)' },
    { id: 'Abril Fatface', name: 'Abril Fatface (Elegante)' },
    { id: 'Righteous', name: 'Righteous (Tech)' },
    { id: 'Fredoka', name: 'Fredoka (Divertido)' },
    { id: 'Merriweather', name: 'Merriweather (Serifa)' },
    { id: 'Raleway', name: 'Raleway (Fino/Elegante)' },
    { id: 'Impact', name: 'Impact (Clássico)' },
];

export const PATTERN_LIST: { id: string, name: string, svg: string }[] = [
  {
    id: 'glitter_purple',
    name: 'Glitter Roxo',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#4A148C"/><filter id="noiseP"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="linear" slope="3" intercept="-1"/><feFuncG type="linear" slope="3" intercept="-1"/><feFuncB type="linear" slope="3" intercept="-1"/></feComponentTransfer></filter><rect width="100%" height="100%" filter="url(#noiseP)" opacity="0.6" style="mix-blend-mode: overlay"/></svg>`
  },
  {
    id: 'gold_foil',
    name: 'Folha de Ouro',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="goldGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%"><stop offset="0%" stop-color="#FFF176"/><stop offset="50%" stop-color="#FBC02D"/><stop offset="100%" stop-color="#F57F17"/></radialGradient><filter id="goldNoise"><feTurbulence type="turbulence" baseFrequency="0.1" numOctaves="2" result="turbulence"/><feSpecularLighting in="turbulence" surfaceScale="5" specularConstant="1" specularExponent="20" lighting-color="#FFD700" result="specular"><fePointLight x="50" y="50" z="50"/></feSpecularLighting><feComposite in="specular" in2="SourceAlpha" operator="in" result="composite"/></filter></defs><rect width="100%" height="100%" fill="url(#goldGrad)"/><rect width="100%" height="100%" filter="url(#goldNoise)" opacity="0.5"/></svg>`
  },
  {
    id: 'stone',
    name: 'Pedra',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#5D4037"/><filter id="stoneFilter"><feTurbulence type="fractalNoise" baseFrequency="0.4" numOctaves="4" stitchTiles="stitch" result="noise"/><feDiffuseLighting in="noise" lighting-color="#ffffff" surfaceScale="3"><feDistantLight azimuth="45" elevation="60"/></feDiffuseLighting></filter><rect width="100%" height="100%" fill="#795548"/><rect width="100%" height="100%" filter="url(#stoneFilter)" opacity="0.7" style="mix-blend-mode: multiply"/></svg>`
  },
  {
    id: 'magma',
    name: 'Magma/Abstrato',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#300000"/><filter id="magmaFilter"><feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" seed="5"/><feColorMatrix values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"/></filter><rect width="100%" height="100%" filter="url(#magmaFilter)" opacity="1" style="mix-blend-mode: screen"/><rect width="100%" height="100%" fill="rgba(255,0,0,0.3)"/></svg>`
  },
  {
    id: 'ice',
    name: 'Gelo/Cristal',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#E1F5FE"/><filter id="iceFilter"><feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="3"/><feDisplacementMap in="SourceGraphic" scale="20"/></filter><rect width="100%" height="100%" fill="#B3E5FC" filter="url(#iceFilter)" opacity="0.8"/></svg>`
  },
  {
    id: 'wood',
    name: 'Madeira',
    svg: `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#6D4C41"/><path d="M0 20 Q50 10 100 20 M0 50 Q50 60 100 50 M0 80 Q50 70 100 80" stroke="#3E2723" stroke-width="3" fill="none"/><path d="M20 0 Q30 50 20 100 M70 0 Q60 50 70 100" stroke="#4E342E" stroke-width="2" fill="none" opacity="0.5"/></svg>`
  },
  {
    id: 'carbon',
    name: 'Fibra de Carbono',
    svg: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect width="20" height="20" fill="#1a1a1a"/><path d="M0 20 L20 0 M10 20 L20 10 M0 10 L10 0" stroke="#333" stroke-width="1.5"/></svg>`
  },
  {
    id: 'jeans',
    name: 'Jeans',
    svg: `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#1565C0"/><filter id="fabric"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#fabric)" opacity="0.3" style="mix-blend-mode: overlay"/></svg>`
  },
  {
    id: 'grass',
    name: 'Grama',
    svg: `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="#2E7D32"/><path d="M5 40 L10 20 L15 40 M20 40 L25 15 L30 40 M30 40 L35 25 L40 40" stroke="#4CAF50" stroke-width="2" fill="none"/><path d="M0 40 L5 25 L10 40 M15 40 L20 10 L25 40" stroke="#66BB6A" stroke-width="2" fill="none"/></svg>`
  },
  {
    id: 'leaves',
    name: 'Folhas',
    svg: `<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><rect width="60" height="60" fill="#1B5E20"/><circle cx="15" cy="15" r="10" fill="#43A047"/><circle cx="45" cy="45" r="10" fill="#43A047"/><ellipse cx="45" cy="15" rx="12" ry="8" fill="#2E7D32" transform="rotate(45 45 15)"/><ellipse cx="15" cy="45" rx="12" ry="8" fill="#2E7D32" transform="rotate(45 15 45)"/></svg>`
  },
  {
    id: 'metal',
    name: 'Metal',
    svg: `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#B0B0B0"/><stop offset="50%" stop-color="#E0E0E0"/><stop offset="100%" stop-color="#B0B0B0"/></linearGradient></defs><rect width="100" height="100" fill="url(#grad)"/><path d="M0 10 L100 0 M0 30 L100 20 M0 50 L100 40 M0 70 L100 60 M0 90 L100 80" stroke="#FFFFFF" stroke-width="0.5" opacity="0.5"/><path d="M10 0 L0 100 M30 0 L20 100 M50 0 L40 100 M70 0 L60 100 M90 0 L80 100" stroke="#000000" stroke-width="0.5" opacity="0.2"/></svg>`
  },
  {
    id: 'noise',
    name: 'Granulado',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#noiseFilter)" opacity="0.5"/></svg>`
  },
];

export const TEXT_STYLE_PRESETS: TextStylePreset[] = [
  {
    id: 'clean_white',
    name: 'Padrão',
    previewColor: 'white',
    properties: {
      fillType: 'solid',
      color: '#FFFFFF',
      strokeColor: '#000000',
      strokeWidth: 4,
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
    }
  },
  {
    id: 'ps_gold',
    name: 'Ouro Luxo',
    previewColor: 'linear-gradient(45deg, #FBC02D, #F57F17)',
    properties: {
      fillType: 'pattern',
      patternId: 'gold_foil',
      strokeColor: '#4E342E',
      strokeWidth: 4,
      shadowColor: '#000000',
      shadowBlur: 8,
      shadowOffsetX: 3,
      shadowOffsetY: 3
    }
  },
  {
    id: 'ps_stone',
    name: 'Pedra',
    previewColor: '#795548',
    properties: {
      fillType: 'pattern',
      patternId: 'stone',
      strokeColor: '#212121',
      strokeWidth: 3,
      shadowColor: 'rgba(0,0,0,0.8)',
      shadowBlur: 4,
      shadowOffsetX: 4,
      shadowOffsetY: 4
    }
  },
  {
    id: 'ps_glitter',
    name: 'Glitter Roxo',
    previewColor: '#4A148C',
    properties: {
      fillType: 'pattern',
      patternId: 'glitter_purple',
      strokeColor: '#FFFFFF',
      strokeWidth: 3,
      shadowColor: '#7B1FA2',
      shadowBlur: 15,
      shadowOffsetX: 0,
      shadowOffsetY: 0
    }
  },
  {
    id: 'ps_magma',
    name: 'Magma',
    previewColor: '#B71C1C',
    properties: {
      fillType: 'pattern',
      patternId: 'magma',
      strokeColor: '#FFEB3B',
      strokeWidth: 2,
      shadowColor: '#D50000',
      shadowBlur: 20,
      shadowOffsetX: 0,
      shadowOffsetY: 0
    }
  },
  {
    id: 'ps_ice',
    name: 'Congelado',
    previewColor: '#B3E5FC',
    properties: {
      fillType: 'pattern',
      patternId: 'ice',
      strokeColor: '#0277BD',
      strokeWidth: 4,
      shadowColor: '#81D4FA',
      shadowBlur: 10,
      shadowOffsetX: 0,
      shadowOffsetY: 0
    }
  },
   {
    id: 'ps_tech',
    name: 'Tech Carbono',
    previewColor: '#212121',
    properties: {
      fillType: 'pattern',
      patternId: 'carbon',
      strokeColor: '#00E676',
      strokeWidth: 2,
      shadowColor: '#00E676',
      shadowBlur: 10,
      shadowOffsetX: 0,
      shadowOffsetY: 0
    }
  },
  {
    id: 'gold_gradient',
    name: 'Ouro Liso',
    previewColor: 'linear-gradient(to bottom, #FFD700, #B8860B)',
    properties: {
      fillType: 'gradient',
      color: '#FFFF00',
      gradientColor2: '#FFA500',
      gradientDirection: 90,
      strokeColor: '#443300',
      strokeWidth: 4,
      shadowColor: '#000000',
      shadowBlur: 10,
      shadowOffsetX: 2,
      shadowOffsetY: 5
    }
  },
  {
    id: 'silver',
    name: 'Prata Liso',
    previewColor: 'linear-gradient(to bottom, #F5F5F5, #707070)',
    properties: {
      fillType: 'gradient',
      color: '#FFFFFF',
      gradientColor2: '#999999',
      gradientDirection: 90,
      strokeColor: '#000000',
      strokeWidth: 3,
      shadowColor: 'rgba(0,0,0,0.8)',
      shadowBlur: 5,
      shadowOffsetX: 2,
      shadowOffsetY: 3
    }
  },
  {
    id: 'fire',
    name: 'Fogo Liso',
    previewColor: 'linear-gradient(to bottom, #FFFF00, #FF0000)',
    properties: {
      fillType: 'gradient',
      color: '#FFFF00',
      gradientColor2: '#FF0000',
      gradientDirection: 90,
      strokeColor: '#330000',
      strokeWidth: 5,
      shadowColor: '#FF4500',
      shadowBlur: 15,
      shadowOffsetX: 0,
      shadowOffsetY: 0
    }
  },
  {
    id: 'neon_cyan',
    name: 'Neon Ciano',
    previewColor: 'cyan',
    properties: {
      fillType: 'solid',
      color: '#00FFFF',
      strokeColor: '#FFFFFF',
      strokeWidth: 2,
      shadowColor: '#00FFFF',
      shadowBlur: 20,
      shadowOffsetX: 0,
      shadowOffsetY: 0
    }
  },
  {
    id: 'neon_pink',
    name: 'Neon Rosa',
    previewColor: 'magenta',
    properties: {
      fillType: 'solid',
      color: '#FF00FF',
      strokeColor: '#FFFFFF',
      strokeWidth: 2,
      shadowColor: '#FF00FF',
      shadowBlur: 20,
      shadowOffsetX: 0,
      shadowOffsetY: 0
    }
  },
   {
    id: 'jungle_text',
    name: 'Selva',
    previewColor: '#2E7D32',
    properties: {
      fillType: 'pattern',
      patternId: 'leaves',
      strokeColor: '#1B5E20',
      strokeWidth: 4,
      shadowColor: '#000000',
      shadowBlur: 5,
      shadowOffsetX: 2,
      shadowOffsetY: 2
    }
  },
  {
    id: 'metal_plate',
    name: 'Metálico',
    previewColor: '#B0B0B0',
    properties: {
      fillType: 'pattern',
      patternId: 'metal',
      strokeColor: '#000000',
      strokeWidth: 3,
      shadowColor: 'rgba(0,0,0,0.8)',
      shadowBlur: 2,
      shadowOffsetX: 2,
      shadowOffsetY: 2
    }
  }
];

export const EMOJI_LIST: string[] = [
  '😂', '❤️', '🔥', '👍', '🤯', '😱', '💰', '🚀', '⭐', '🎉', '💯', '✅', 
  '🤔', '😲', '😭', '🙏', '🙌', '😮', '😡', '🙄', '😏', '😇', '🥳', '🥺', 
  '📈', '💎', '🏆', '🎁', '➡️', '❓', '❗', '❌', '⚠️', '🛑', '💔', '😠', 
  '😎', '😜', '😨', '😢', '🤩', '🤑', '🤐', '🤫', '🧐', '😈', '🤡', '💀', 
  '👽', '🤖', '👾', '👀', '🧠', '💪', '👈', '👉', '👆', '👇', '👊', '👋', 
  '✍️', '👑', '💡', '💣', '💥', '💸', '📞', '💻', '🖥️', '⌨️', '🖱️', '🎮', 
  '📸', '🎥', '📺', '🔔', '🚫', '❎', '➕', '➖', '➗', '✖️', '🔜', '🔝', '🔞'
];

export const STICKER_LIST: { id: string, name: string, svg: string }[] = [
    {
        id: 'arrow_red_chunky',
        name: 'Seta Vermelha Grossa',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M5 50 L60 50 L60 30 L95 60 L60 90 L60 70 L5 70 Z" fill="red" stroke="black" stroke-width="3"/></svg>`
    },
    {
        id: 'arrow_doodle',
        name: 'Seta Desenhada',
        svg: `<svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg"><path d="M10 40 Q 50 10, 80 40" stroke="red" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M70 30 L80 40 L70 50" stroke="red" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    },
    {
        id: 'circle_red_brush',
        name: 'Círculo de Pincel',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="none" stroke="red" stroke-width="8" stroke-dasharray="10 5" transform="rotate(-15 50 50)"/></svg>`
    },
    {
        id: 'subscribe_button',
        name: 'Botão Inscrever-se',
        svg: `<svg viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="200" height="60" rx="10" fill="#FF0000"/><text x="100" y="38" font-family="Roboto, sans-serif" font-size="28" fill="white" text-anchor="middle" font-weight="bold">INSCREVA-SE</text></svg>`
    },
    {
        id: 'thug_life_glasses',
        name: 'Óculos Thug Life',
        svg: `<svg viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg"><g fill="#000"><rect x="0" y="0" width="30" height="30"/><rect x="90" y="0" width="30" height="30"/><rect x="25" y="10" width="10" height="10"/><rect x="40" y="10" width="10" height="10"/><rect x="55" y="10" width="10" height="10"/><rect x="70" y="10" width="10" height="10"/><rect x="85" y="10" width="10" height="10"/></g></svg>`
    },
    {
        id: 'sparkles',
        name: 'Brilhos',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 0 L55 45 L100 50 L55 55 L50 100 L45 55 L0 50 L45 45 Z" fill="yellow"/><path d="M20 15 L22 33 L40 35 L22 37 L20 55 L18 37 L0 35 L18 33 Z" fill="white"/><path d="M80 65 L82 83 L100 85 L82 87 L80 105 L78 87 L60 85 L78 83 Z" fill="cyan"/></svg>`
    },
    {
        id: 'fire',
        name: 'Fogo',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#FFA500" d="M12.83 2.2a1 1 0 0 0-1.66 0C8.3 6.13 6 9.58 6 12.5c0 3.31 2.69 6 6 6s6-2.69 6-6c0-2.92-2.3-6.37-5.17-10.3z"/><path fill="#FFC107" d="M12 17.5c-1.38 0-2.5-1.12-2.5-2.5s2.5-4 2.5-4s2.5 2.62 2.5 4s-1.12 2.5-2.5 2.5z"/></svg>`
    },
    {
        id: 'versus',
        name: 'Versus',
        svg: `<svg viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg"><text x="0" y="40" font-family="Anton, sans-serif" font-size="40" font-weight="bold" fill="white" stroke="black" stroke-width="2">VS</text></svg>`
    },
    {
        id: 'comic_burst',
        name: 'Explosão Comic',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 0 L55 35 L75 25 L65 45 L95 50 L65 55 L75 75 L55 65 L50 100 L45 65 L25 75 L35 55 L5 50 L35 45 L25 25 L45 35 Z" fill="yellow" stroke="black" stroke-width="2"/></svg>`
    },
    {
        id: 'crown_gold',
        name: 'Coroa Dourada',
        svg: `<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg"><path d="M10 50 L20 20 L40 40 L50 10 L60 40 L80 20 L90 50 Z" fill="gold" stroke="black" stroke-width="2"/><circle cx="20" cy="18" r="5" fill="red"/><circle cx="50" cy="8" r="5" fill="blue"/><circle cx="80" cy="18" r="5" fill="red"/></svg>`
    },
    {
        id: '100_sticker',
        name: '100 Pontos',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 50"><text x="0" y="40" font-family="Impact, sans-serif" font-size="50" font-weight="bold" fill="red" stroke="white" stroke-width="2">100</text></svg>`
    },
    {
        id: 'censored_bar',
        name: 'Barra de Censura',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20"><rect width="100" height="20" fill="black"/></svg>`
    },
    {
        id: 'like_icon',
        name: 'Ícone Like',
        svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#3B82F6" d="M5 9v11h4V9H5zm14.4-1c.2 0 .4.1.6.3s.2.4.2.6v.2l-2.8 6.3c-.2.4-.6.6-1 .6H9V9l4.3-4.3c.2-.2.5-.3.8-.3h.1c.3 0 .6.1.8.4l2.1 2.3V9h2.3z"/></svg>`
    },
    {
        id: 'bell',
        name: 'Sino de Notificação',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" fill="gold"/></svg>`
    },
    {
        id: 'live_badge',
        name: 'Selo LIVE',
        svg: `<svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="120" height="40" rx="8" fill="#FF0000"/><text x="60" y="28" font-family="Oswald, sans-serif" font-size="24" fill="white" text-anchor="middle" font-weight="bold">● LIVE</text></svg>`
    },
    {
        id: 'new_badge',
        name: 'Selo NOVO',
        svg: `<svg viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="100" height="40" rx="8" fill="#3B82F6"/><text x="50" y="28" font-family="Bebas Neue, sans-serif" font-size="28" fill="white" text-anchor="middle" font-weight="bold">NOVO</text></svg>`
    },
    {
        id: 'rec_indicator',
        name: 'Indicador REC',
        svg: `<svg viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="100" height="40" rx="8" fill="black" opacity="0.7"/><circle cx="20" cy="20" r="8" fill="red"/><text x="65" y="28" font-family="Oswald, sans-serif" font-size="24" fill="white" text-anchor="middle" font-weight="bold">REC</text></svg>`
    },
    {
        id: 'comic_pow',
        name: 'POW! Comic',
        svg: `<svg viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg"><path d="M75 0 L85 30 L110 20 L95 45 L140 50 L95 55 L110 80 L85 70 L75 100 L65 70 L40 80 L55 55 L10 50 L55 45 L40 20 L65 30 Z" fill="orange" stroke="black" stroke-width="3"/><text x="75" y="60" font-family="Anton, sans-serif" font-size="40" fill="red" stroke="black" stroke-width="1.5" text-anchor="middle" transform="rotate(-15 75 55)">POW!</text></svg>`
    },
    {
        id: 'arrow_glowing_blue',
        name: 'Seta Azul Brilhante',
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><defs><filter id="glow"><feGaussianBlur stdDeviation="4.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><path d="M20 60 L70 60 L70 40 L110 70 L70 100 L70 80 L20 80 Z" fill="#00BFFF" filter="url(#glow)"/></svg>`
    },
    {
        id: 'underline_yellow_doodle',
        name: 'Sublinhado Amarelo',
        svg: `<svg viewBox="0 0 150 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 10 C 30 20, 60 0, 90 10 S 145 0, 145 15" stroke="yellow" stroke-width="5" fill="none" stroke-linecap="round"/></svg>`
    },
    {
        id: 'heart_pixel',
        name: 'Coração Pixel',
        svg: `<svg viewBox="0 0 9 8" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path stroke="#FF0000" d="M1 2h1V1h1v1h1V1h1v1h1V2h1v1h-1v1h-1v1h-1V4h-1v1H2V4H1V3h1V2z"/><path fill="#FF0000" d="M2 2h1v1h-1zM4 2h1v1h-1zM6 2h1v1h-1zM3 3h1v1h-1zM5 3h1v1h-1z"/></svg>`
    },
    {
        id: 'comment_bubble',
        name: 'Balão de Comentário',
        svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2z" fill="white"/></svg>`
    },
    {
        id: 'eye_views',
        name: 'Ícone Visualizações',
        svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 4.5C7 4.5 2.7 7.6 1 12c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5C21.3 7.6 17 4.5 12 4.5zm0 10c-2.5 0-4.5-2-4.5-4.5S9.5 5.5 12 5.5s4.5 2 4.5 4.5-2 4.5-4.5 4.5zm0-7C10.9 7.5 10 8.4 10 9.5s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="white"/></svg>`
    },
    {
        id: 'loading_bar',
        name: 'Barra de Carregamento',
        svg: `<svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="200" height="20" fill="#4A5568" rx="5"/><rect x="0" y="0" width="140" height="20" fill="#4299E1" rx="5"/></svg>`
    },
    {
        id: 'shocked_face',
        name: 'Rosto Chocado',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="yellow" stroke="black" stroke-width="3"/><circle cx="35" cy="40" r="8" fill="black"/><circle cx="65" cy="40" r="8" fill="black"/><ellipse cx="50" cy="70" rx="20" ry="10" fill="black"/></svg>`
    },
    {
        id: 'red_frame_corner',
        name: 'Canto de Moldura',
        svg: `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><path d="M0 0 H 50 V 10 H 10 V 50 H 0 Z" fill="red"/></svg>`
    },
    {
        id: 'sale_tag',
        name: 'Etiqueta de Desconto',
        svg: `<svg viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg"><path d="M0 0 H 80 L 100 25 L 80 50 H 0 V 0 Z" fill="red"/><circle cx="15" cy="25" r="5" fill="white"/><text x="55" y="32" font-family="Impact, sans-serif" font-size="20" fill="white" text-anchor="middle">SALE</text></svg>`
    },
    {
        id: 'checkmark_green',
        name: 'Check Verde',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#4CAF50" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>`
    },
    {
        id: 'cross_red',
        name: 'X Vermelho',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#F44336" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 17.59 13.41 12 19 6.41z"/></svg>`
    },
    {
        id: 'warning_sign',
        name: 'Sinal de Alerta',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 0 L100 100 H 0 Z" fill="yellow"/><text x="50" y="70" font-family="Anton, sans-serif" font-size="60" fill="black" text-anchor="middle">!</text></svg>`
    },
    {
        id: 'money_flying',
        name: 'Dinheiro Voando',
        svg: `<svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg"><g transform="rotate(-15 50 40)"><rect x="10" y="10" width="50" height="25" fill="#4CAF50" stroke="black" stroke-width="1"/><circle cx="35" cy="22.5" r="5" fill="#2E7D32"/><text x="55" y="28" font-size="15" fill="black">$</text></g><g transform="rotate(20 50 40) translate(20, 20)"><rect x="10" y="10" width="50" height="25" fill="#4CAF50" stroke="black" stroke-width="1"/><circle cx="35" cy="22.5" r="5" fill="#2E7D32"/><text x="55" y="28" font-size="15" fill="black">$</text></g></svg>`
    },
    {
        id: 'glitch_overlay',
        name: 'Efeito Glitch',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke-width="3"><path d="M0 20 H 100" stroke="cyan" transform="translate(5, 0)"/><path d="M0 50 H 100" stroke="red" transform="translate(-5, 0)"/><path d="M0 80 H 100" stroke="white" transform="translate(3, 0)"/></g></svg>`
    },
    {
        id: 'question_mark_bubble',
        name: 'Balão de Dúvida',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="white" stroke="black" stroke-width="3" /><text x="50" y="68" font-family="Anton, sans-serif" font-size="60" fill="black" text-anchor="middle">?</text></svg>`
    }
];

export const RANDOM_PROMPTS = [
    "Um astronauta jogando xadrez com um alienígena na superfície de Marte, realista, alta definição.",
    "Um gato hacker invadindo a matrix, estilo cyberpunk, luzes neon, óculos escuros, código verde caindo.",
    "Um castelo flutuante feito de doces e sorvete, céu azul vibrante, estilo Pixar, 3d render.",
    "Um detetive particular noir em uma cidade chuvosa, preto e branco com um guarda-chuva vermelho brilhante.",
    "Um dragão mecânico soltando fogo azul, detalhes complexos, fundo industrial, steampunk.",
    "Uma lhama surfando em uma onda gigante de arco-íris, estilo cartoon vibrante, sol brilhante.",
    "Um laboratório de cientista maluco explodindo com poções coloridas, expressão de choque, fumaça colorida.",
    "Um guerreiro viking lutando contra um robô futurista, épico, cinematográfico, raios e trovões.",
    "Uma pizza gigante flutuando no espaço sideral como um OVNI, planetas de pepperoni, estrelas brilhantes.",
    "Um escritório moderno onde todos os funcionários são cachorros de terno, sérios, trabalhando em computadores.",
    "Uma floresta mágica brilhante à noite, cogumelos gigantes fluorescentes, fadas, atmosfera mística.",
    "Um carro esportivo futurista voando sobre uma cidade cyberpunk, motion blur, luzes de velocidade.",
    "Um zumbi gamer jogando videogame com raiva, headset, controle quebrado, quarto bagunçado com luz led.",
    "Uma paisagem de montanhas feitas de polígonos low poly, pôr do sol roxo e rosa, estilo vaporwave.",
    "Um close-up extremo de um olho humano refletindo uma galáxia inteira, detalhado, macro."
];