import React from 'react';
import PokemonChatbot from './PokemonChatbot';

interface HoverChatbotProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function HoverChatbot({ isOpen, setIsOpen }: HoverChatbotProps) {
  return (
    <div className={`fixed right-0 top-0 h-full z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 bg-indigo-600 text-white px-2 py-4 rounded-l-md hover:bg-indigo-700 transition-colors"
      >
        {isOpen ? '>' : '<'}
      </button>
      <div className="bg-gray-900 h-full w-96 shadow-lg overflow-y-auto text-white">
        <PokemonChatbot />
      </div>
    </div>
  );
}