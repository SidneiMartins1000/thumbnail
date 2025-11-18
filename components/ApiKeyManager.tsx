
import React, { useState } from 'react';

interface ApiKeyManagerProps {
  onKeySubmit: (key: string) => void;
  error?: string | null;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ onKeySubmit, error }) => {
  const [key, setKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      onKeySubmit(key.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold text-center text-indigo-400 mb-4">Configure sua Chave de API</h2>
        <p className="text-center text-gray-400 mb-6">
          Para criar thumbnails incríveis, insira sua chave de API do Google Gemini.
        </p>
        
        <div className="bg-gray-900/50 p-3 rounded-md mb-6 border border-gray-700 space-y-2">
           <p className="text-xs text-gray-400 text-center">
             🔒 <strong>Segurança:</strong> Sua chave é salva <strong>apenas no seu navegador</strong> (LocalStorage).
           </p>
           <p className="text-xs text-green-400 text-center border-t border-gray-700 pt-2">
             ✅ <strong>Modo Gratuito Ativado:</strong> Este app utiliza o modelo Flash (Texto) para gerar artes, não requerendo cartão de crédito.
           </p>
        </div>

        {error && (
            <div className="text-center text-red-400 bg-red-900/30 p-3 rounded-md text-sm mb-4">
                <p>{error}</p>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="api-key" className="block text-sm font-medium text-gray-300 mb-2">
              Chave de API (Gemini)
            </label>
            <input
              id="api-key"
              type="password"
              className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              placeholder="Cole sua chave de API aqui"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition duration-150"
          >
            Salvar e Começar a Criar
          </button>
        </form>
         <div className="mt-6 text-center text-sm text-gray-500">
            <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-indigo-400 hover:text-indigo-300"
            >
                Não tem uma chave? Obtenha uma de graça no Google AI Studio &rarr;
            </a>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyManager;
