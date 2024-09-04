import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

interface PokemonDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: string[];
  image: string;
}

function PokemonDetail() {
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      const result = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const pokemonData: PokemonDetails = {
        id: result.data.id,
        name: result.data.name,
        height: result.data.height,
        weight: result.data.weight,
        types: result.data.types.map((type: any) => type.type.name),
        image: result.data.sprites.front_default,
      };
      setPokemon(pokemonData);
    };

    fetchPokemonDetails();
  }, [id]);

  if (!pokemon) return <div>Loading...</div>;

  return (
    <div className="pokemon-detail">
      <Link to="/">Back to Grid</Link>
      <h1>{pokemon.name}</h1>
      <img src={pokemon.image} alt={pokemon.name} style={{ width: '200px', height: '200px' }} />
      <p>Height: {pokemon.height}</p>
      <p>Weight: {pokemon.weight}</p>
      <p>Types: {pokemon.types.join(', ')}</p>
    </div>
  );
}

export default PokemonDetail;