import { Pokemon } from "../../models/pokemon";
import { PokemonService } from "../../services/pokemon.service";
import { FormatarNumeroDoisAlgarismos } from "../../utils/number-formatter";
import "./pokemon-detalhes.css";

class PokemonDetalhes {
	private pokemonService: PokemonService;
	private btnToHome: HTMLButtonElement;
	private pokemonImage: HTMLImageElement;
	private spanIdNumber: HTMLSpanElement;
	private subTitle: HTMLTitleElement;
	private spanHeight: HTMLSpanElement;
	private spanWeight: HTMLSpanElement;

	constructor() {
		this.configurarTela();
		this.pegarPokemons();
	}

	configurarTela() {
		this.pokemonService = new PokemonService();
		this.configurarElementos();

		this.btnToHome.addEventListener("click", () => this.redirecionarUsuario());
	}
	configurarElementos() {
		this.btnToHome = document.getElementById("btn-back-home") as HTMLButtonElement;
		this.pokemonImage = document.getElementById("pokemon-img") as HTMLImageElement;
		this.spanIdNumber = document.getElementById("id-number") as HTMLSpanElement;
		this.subTitle = document.getElementById("pokemon-name") as HTMLTitleElement;
		this.spanHeight = document.getElementById("height-number") as HTMLSpanElement;
		this.spanWeight = document.getElementById("weight-number") as HTMLSpanElement;
	}

	async pegarPokemons() {
		try {
			const url = new URLSearchParams(window.location.search);
			const nome = url.get("nome") as string;
			const pokemon = await this.pokemonService.selecionarPokemonPorNome(nome);
			this.popularCard(pokemon);
		} catch (err) {
			console.log(err);
		}
	}

	private popularCard(pokemon: Pokemon) {
		this.pokemonImage.src = pokemon.spriteUrl;
		this.spanIdNumber.textContent = FormatarNumeroDoisAlgarismos(pokemon.id);
		this.subTitle.textContent = pokemon.nome;
		this.spanHeight.textContent = `${pokemon.altura / 10}m`;
		this.spanWeight.textContent = `${pokemon.peso / 10}kg`;
	}

	redirecionarUsuario(): any {
		window.location.href = "index.html";
	}
}

window.addEventListener("load", () => new PokemonDetalhes());
