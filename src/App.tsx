import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PokemonGrid from './PokemonGrid';
import PokemonDetail from './PokemonDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<PokemonGrid />} />
          <Route path="/pokemon/:id" element={<PokemonDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
