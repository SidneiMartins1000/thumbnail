import React from 'react';

interface HeaderProps {
  onClearApiKey: () => void;
}

const Header: React.FC<HeaderProps> = ({ onClearApiKey }) => {
  return (
    <header className="bg-gray-900/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-800 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex-1 hidden md:block"></div>
        
        <h1 className="text-3xl md:text-5xl font-['Anton'] uppercase text-center tracking-wide flex-1 leading-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] filter">
            Gerador de Thumbnail
          </span>
          <br className="md:hidden" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-red-400 to-orange-500 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] md:ml-3 filter">
            para YouTube
          </span>
        </h1>

        <div className="flex-1 flex justify-end">
           <button
             onClick={onClearApiKey}
             className="text-xs font-medium text-gray-500 hover:text-indigo-400 hover:bg-gray-800/50 rounded-full px-3 py-1.5 transition duration-200 border border-transparent hover:border-gray-700"
             title="Alterar Chave de API"
           >
             Configurar API
           </button>
        </div>
      </div>
    </header>
  );
};

export default Header;