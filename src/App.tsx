import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PokemonGrid from './PokemonGrid';
import PokemonDetail from './PokemonDetail';
import { HoverChatbot } from './HoverChatbot';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(null);

  const handleSelectPokemon = (id: number | null) => {
    setSelectedPokemonId(id);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white flex">
        <div className={`flex-grow transition-all duration-300 ${isChatOpen ? 'mr-96' : ''}`}>
          <header className="bg-indigo-800 text-white p-4">
            <h1 className="text-2xl font-bold">Pokédex</h1>
          </header>
          <main className="p-4">
            <Routes>
              <Route path="/" element={<PokemonGrid onSelectPokemon={handleSelectPokemon} />} />
              <Route path="/pokemon/:id" element={<PokemonDetail onSelectPokemon={handleSelectPokemon} />} />
            </Routes>
          </main>
        </div>
        <HoverChatbot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
      </div>
    </Router>
  );
}

export default App;
