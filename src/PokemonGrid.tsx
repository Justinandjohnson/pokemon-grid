import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  height: number;
  weight: number;
}

interface PokemonGridProps {
  onSelectPokemon: (id: number) => void;
}

function PokemonGrid({ onSelectPokemon }: PokemonGridProps) {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchPokemon = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`);
      const newPokemon = await Promise.all(
        response.data.results.map(async (p: any) => {
          const detailResponse = await axios.get(p.url);
          return {
            id: detailResponse.data.id,
            name: detailResponse.data.name,
            image: detailResponse.data.sprites.other['official-artwork'].front_default || detailResponse.data.sprites.front_default,
            types: detailResponse.data.types?.map((t: any) => t.type.name) || [],
            height: detailResponse.data.height,
            weight: detailResponse.data.weight,
          };
        })
      );
      setPokemon(prev => [...prev, ...newPokemon]);
      setOffset(prev => prev + 20);
      setHasMore(response.data.next !== null);
    } catch (error) {
      console.error('Error fetching Pokemon:', error);
    }
    setIsLoading(false);
  }, [offset, isLoading, hasMore]);

  const lastPokemonRef = useCallback((node: HTMLDivElement) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchPokemon();
      }
    });
    if (node) observer.current.observe(node);
  }, [fetchPokemon, hasMore, isLoading]);

  useEffect(() => {
    fetchPokemon();
  }, [fetchPokemon]);

  // Function to determine weight color
  const getWeightColor = (weight: number) => {
    // Assuming weight range from 0 to 1000 (adjust as needed)
    const percentage = Math.min(weight / 1000, 1);
    const red = Math.round(255 * (1 - percentage));
    const green = Math.round(255 * percentage);
    return `rgb(${red}, ${green}, 0)`;
  };

  // Function to determine height color
  const getHeightColor = (height: number) => {
    // Assuming height range from 0 to 20 meters (adjust as needed)
    const percentage = Math.min(height / 200, 1); // height is in decimeters
    const blue = Math.round(255 * (1 - percentage));
    const orange = Math.round(255 * percentage);
    return `rgb(${orange}, ${Math.round(orange/2)}, ${blue})`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {pokemon.map((p, index) => (
        <div
          key={p.id}
          ref={index === pokemon.length - 1 ? lastPokemonRef : null}
          className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group relative overflow-hidden"
          onClick={() => onSelectPokemon(p.id)}
        >
          <Link to={`/pokemon/${p.id}`}>
            <img src={p.image} alt={p.name} className="w-full h-40 object-contain mb-2 relative z-10" />
            <h2 className="text-center text-lg font-semibold capitalize text-white relative z-10">{p.name}</h2>
          </Link>
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-600 to-indigo-900 text-white p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex flex-col justify-center items-center z-20">
            <h3 className="text-xl font-bold mb-2 capitalize">{p.name}</h3>
            <p className="text-sm mb-1 font-semibold">
              Types: <span className="font-normal">{p.types.length > 0 ? p.types.join(', ') : 'Unknown'}</span>
            </p>
            <p className="text-sm mb-1 font-semibold">
              Height: <span className="font-normal" style={{ color: getHeightColor(p.height) }}>{p.height / 10}m</span>
            </p>
            <p className="text-sm font-semibold">
              Weight: <span className="font-normal" style={{ color: getWeightColor(p.weight) }}>{p.weight / 10}kg</span>
            </p>
            <div className="mt-2 text-xs bg-indigo-500 px-2 py-1 rounded-full">
              #{p.id.toString().padStart(3, '0')}
            </div>
          </div>
        </div>
      ))}
      {isLoading && <div className="col-span-full text-center text-white">Loading more Pokémon...</div>}
    </div>
  );
}

export default PokemonGrid;