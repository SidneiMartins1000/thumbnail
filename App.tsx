
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ThumbnailGenerator from './components/ThumbnailGenerator';
import ApiKeyManager from './components/ApiKeyManager';
import { useApiKey } from './hooks/useApiKey';

const App: React.FC = () => {
  const [apiKey, saveApiKey, clearApiKey] = useApiKey();
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  
  useEffect(() => {
    // Clear old console logs to help debugging
    console.clear();
    console.log("App mounted. Environment: Free Mode (SVG).");
  }, []);

  const handleKeySubmit = (key: string) => {
    saveApiKey(key);
    setApiKeyError(null); // Clear previous errors
  };

  const handleInvalidApiKey = () => {
    setApiKeyError("Sua Chave de API é inválida ou expirou. Por favor, insira uma nova.");
    clearApiKey();
  }

  if (!apiKey) {
    return <ApiKeyManager onKeySubmit={handleKeySubmit} error={apiKeyError} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white selection:bg-indigo-500 selection:text-white">
      <Header onClearApiKey={clearApiKey} />
      
      <main className="container mx-auto px-4 py-8">
        
        {/* Banner de Status Gratuito */}
        <div className="flex justify-center mb-6">
            <span className="px-4 py-1 rounded-full bg-indigo-900/50 border border-indigo-500 text-indigo-300 text-sm font-semibold flex items-center gap-2">
                ⚡ Modo Gratuito (SVG) Ativado
            </span>
        </div>

        {/* Botão Promocional "Money" */}
        <div className="flex justify-center mb-10">
          <a 
            href="https://go.hotmart.com/L103010255L" 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-b from-green-500 via-green-600 to-green-800 text-white font-['Anton'] text-2xl tracking-wider uppercase rounded-2xl shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:shadow-[0_0_35px_rgba(34,197,94,0.8)] hover:-translate-y-1 transition-all duration-300 border-2 border-yellow-400/50 hover:border-yellow-300 overflow-hidden"
          >
            {/* Efeito de brilho passando */}
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></span>
            
            <span className="text-3xl drop-shadow-md transform group-hover:scale-110 transition-transform">💸</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-yellow-100 to-yellow-300 drop-shadow-sm z-10">
              VIVA SEMPRE COM DINHEIRO
            </span>
            <span className="text-3xl drop-shadow-md transform group-hover:scale-110 transition-transform">💸</span>
          </a>
        </div>

        <ThumbnailGenerator key="v2-generator" apiKey={apiKey} onInvalidApiKey={handleInvalidApiKey} />
      </main>
      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>Desenvolvido por Sidnei Martins para criadores de conteúdo.</p>
        <p className="text-xs text-gray-600 mt-1">v2.0 Free</p>
      </footer>
    </div>
  );
};

export default App;
