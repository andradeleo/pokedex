import { Pokemon } from "../models/pokemon";

export class PokemonService {
	private POKEMON_API_URL: string = "https://pokeapi.co/api/v2/pokemon/";
	public POKEMON_NEXT_PAGE: string = "";
	public POKEMON_PREVIOUS_PAGE: string = "";

	async carregarPokemons(): Promise<Pokemon[]> {
		const data = await fetch(this.POKEMON_API_URL);
		const pokemonsParsed = await data.json();

		this.POKEMON_PREVIOUS_PAGE = pokemonsParsed.previous;
		this.POKEMON_NEXT_PAGE = pokemonsParsed.next;

		const allPokemonsWithInfo = this.mapearListaPokemons(pokemonsParsed.results);
		return allPokemonsWithInfo;
	}

	async carregarPokemonsProximaPagina(): Promise<Pokemon[]> {
		const data = await fetch(this.POKEMON_NEXT_PAGE);
		const pokemonsParsed = await data.json();

		this.POKEMON_PREVIOUS_PAGE = pokemonsParsed.previous;
		this.POKEMON_NEXT_PAGE = pokemonsParsed.next;

		const allPokemonsWithInfo = this.mapearListaPokemons(pokemonsParsed.results);
		return allPokemonsWithInfo;
	}

	async carregarPokemonsPaginaAnterior(): Promise<Pokemon[]> {
		const data = await fetch(this.POKEMON_PREVIOUS_PAGE);
		const pokemonsParsed = await data.json();

		this.POKEMON_PREVIOUS_PAGE = pokemonsParsed.previous;
		this.POKEMON_NEXT_PAGE = pokemonsParsed.next;

		const allPokemonsWithInfo = this.mapearListaPokemons(pokemonsParsed.results);
		return allPokemonsWithInfo;
	}

	selecionarPokemonPorNome(nome: string): Promise<Pokemon> {
		const url = `https://pokeapi.co/api/v2/pokemon/${nome}`;

		return fetch(url)
			.then((res: Response): Promise<any> => this.processarResposta(res))
			.then((obj: any): Pokemon => this.mapearPokemon(obj));
	}

	private processarResposta(resposta: Response): Promise<any> {
		if (resposta.ok) return resposta.json();

		throw new Error("Pokémon não encontrado!");
	}

	private mapearPokemon(obj: any): Pokemon {
		return {
			id: obj.id,
			nome: obj.name,
			spriteUrl: obj.sprites.front_default,
			altura: obj.height,
			peso: obj.weight,
		};
	}

	private mapearListaPokemons(objetos: any[]): any {
		const pokemons = objetos.map((obj) => this.selecionarPokemonPorNome(obj.name));

		return Promise.all(pokemons);
	}
}
