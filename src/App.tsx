import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PokemonGrid from './PokemonGrid';
import PokemonDetail from './PokemonDetail';
import { HoverChatbot } from './HoverChatbot';

function App() {
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(true);

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white flex">
        <div className={`flex-grow transition-all duration-300 ${isChatOpen ? 'mr-96' : ''}`}>
          <header className="bg-indigo-800 text-white p-4">
            <h1 className="text-2xl font-bold">Pokédex</h1>
          </header>
          <main className="p-4">
            <Routes>
              <Route path="/" element={
                <PokemonGrid onSelectPokemon={setSelectedPokemonId} />
              } />
              <Route path="/pokemon/:id" element={
                <PokemonDetail onSelectPokemon={setSelectedPokemonId} />
              } />
            </Routes>
          </main>
        </div>
        <HoverChatbot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
      </div>
    </Router>
  );
}

export default App;
