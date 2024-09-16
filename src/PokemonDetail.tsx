import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

interface PokemonDetails {
  id: number;
  name: string;
  image: string;
  height: number;
  weight: number;
  types: string[];
  abilities: string[];
}

interface PokemonDetailProps {
  onSelectPokemon: (id: number | null) => void;
}

function PokemonDetail({ onSelectPokemon }: PokemonDetailProps) {
  const { id } = useParams<{ id: string }>();
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      const result = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
      setPokemon({
        id: result.data.id,
        name: result.data.name,
        image: result.data.sprites.front_default,
        height: result.data.height,
        weight: result.data.weight,
        types: result.data.types.map((type: any) => type.type.name),
        abilities: result.data.abilities.map((ability: any) => ability.ability.name),
      });
      onSelectPokemon(result.data.id);
    };

    fetchPokemonDetails();
    return () => onSelectPokemon(null);
  }, [id, onSelectPokemon]);

  if (!pokemon) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img className="h-48 w-full object-cover md:w-48" src={pokemon.image} alt={pokemon.name} />
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">#{pokemon.id}</div>
            <h2 className="mt-1 text-2xl leading-8 font-bold text-gray-900 capitalize">{pokemon.name}</h2>
            <p className="mt-2 text-gray-600">Height: {pokemon.height / 10}m</p>
            <p className="text-gray-600">Weight: {pokemon.weight / 10}kg</p>
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-900">Types:</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {pokemon.types.map((type) => (
                  <span key={type} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">{type}</span>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-900">Abilities:</h3>
              <ul className="mt-2 list-disc list-inside">
                {pokemon.abilities.map((ability) => (
                  <li key={ability} className="text-gray-600 capitalize">{ability}</li>
                ))}
              </ul>
            </div>
            <Link to="/" className="mt-6 inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300">
              Back to Pokédex
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PokemonDetail;