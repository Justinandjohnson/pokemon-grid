import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Pokemon {
  id: number;
  name: string;
  image: string;
}

function PokemonGrid() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);

  useEffect(() => {
    const fetchPokemon = async () => {
      const results = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100');
      const pokemonData = await Promise.all(
        results.data.results.map(async (pokemon: any, index: number) => {
          const id = index + 1;
          const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
          return { id, name: pokemon.name, image: imageUrl };
        })
      );
      setPokemon(pokemonData);
    };

    fetchPokemon();
  }, []);

  return (
    <div className="pokemon-grid">
      {pokemon.map((p) => (
        <Link key={p.id} to={`/pokemon/${p.id}`}>
          <div className="pokemon-card">
            <img src={p.image} alt={p.name} />
            <p>{p.name}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default PokemonGrid;