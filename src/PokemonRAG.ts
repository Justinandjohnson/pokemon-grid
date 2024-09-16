import axios from 'axios';

interface PokemonInfo {
  id: number;
  name: string;
  types: string[];
  abilities: string[];
  stats: { name: string; value: number }[];
  height: number;
  weight: number;
  description: string;
  evolutionChain: string[];
  moves: string[];
  habitat: string;
  generation: string;
  eggGroups: string[];
  baseExperience: number;
  captureRate: number;
  growthRate: string;
}

class PokemonRAG {
  private cache: Map<number, PokemonInfo> = new Map();

  async getPokemonInfo(id: number): Promise<PokemonInfo> {
    if (this.cache.has(id)) {
      return this.cache.get(id)!;
    }

    const pokemonData = await this.fetchPokemonData(`https://pokeapi.co/api/v2/pokemon/${id}`);
    this.cache.set(id, pokemonData);
    return pokemonData;
  }

  async getRelatedPokemon(id: number): Promise<PokemonInfo[]> {
    const pokemon = await this.getPokemonInfo(id);
    const relatedPokemon: PokemonInfo[] = [];

    for (const type of pokemon.types) {
      const typeResponse = await axios.get(`https://pokeapi.co/api/v2/type/${type}`);
      const pokemonInType = typeResponse.data.pokemon.slice(0, 3);
      for (const p of pokemonInType) {
        if (p.pokemon.name !== pokemon.name) {
          const relatedPokemonData = await this.getPokemonInfo(p.pokemon.url.split('/').slice(-2, -1)[0]);
          relatedPokemon.push(relatedPokemonData);
        }
      }
      if (relatedPokemon.length >= 5) break;
    }

    return relatedPokemon.slice(0, 5);
  }

  private async fetchPokemonData(url: string): Promise<PokemonInfo> {
    const response = await axios.get(url);
    const data = response.data;

    const speciesResponse = await axios.get(data.species.url);
    const speciesData = speciesResponse.data;

    const description = speciesData.flavor_text_entries.find(
      (entry: any) => entry.language.name === 'en'
    )?.flavor_text || 'No description available.';

    const evolutionChain = await this.fetchEvolutionChain(speciesData.evolution_chain.url);

    const moves = data.moves.slice(0, 10).map((move: any) => move.move.name);

    return {
      id: data.id,
      name: data.name,
      types: data.types.map((t: any) => t.type.name),
      abilities: data.abilities.map((a: any) => a.ability.name),
      stats: data.stats.map((s: any) => ({ name: s.stat.name, value: s.base_stat })),
      height: data.height,
      weight: data.weight,
      description: description.replace(/\f/g, ' '),
      evolutionChain,
      moves,
      habitat: speciesData.habitat?.name || 'Unknown',
      generation: speciesData.generation.name,
      eggGroups: speciesData.egg_groups.map((group: any) => group.name),
      baseExperience: data.base_experience,
      captureRate: speciesData.capture_rate,
      growthRate: speciesData.growth_rate.name
    };
  }

  private async fetchEvolutionChain(url: string): Promise<string[]> {
    const response = await axios.get(url);
    const chain = response.data.chain;
    const evolutionChain: string[] = [];

    let currentStage = chain;
    while (currentStage) {
      evolutionChain.push(currentStage.species.name);
      currentStage = currentStage.evolves_to[0];
    }

    return evolutionChain;
  }
}

export const pokemonRAG = new PokemonRAG();