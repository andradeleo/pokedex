import "./tela-inicio.css";
import { PokemonService } from "../../services/pokemon.service";
import { Pokemon } from "../../models/pokemon";
import { FormatarNumeroDoisAlgarismos } from "../../utils/number-formatter";

class TelaPokemon {
	public pokemonService: PokemonService;
	private pokemonsList: Pokemon[] = [];
	private pokemonsContainer: HTMLDivElement;
	private btnNext: HTMLButtonElement;
	private btnPrevious: HTMLButtonElement;
	private btnSearch: HTMLButtonElement;
	private inputSearch: HTMLInputElement;

	constructor() {
		this.configurarTela();
		this.pegarPokemons();
	}

	configurarTela() {
		this.pokemonService = new PokemonService();
		this.configurarElementos();

		this.pokemonsContainer.addEventListener("click", (e) => this.selecionarCardClicado(e));
		this.inputSearch.addEventListener("input", (e) => this.atualizarEstadoBotaoPesquisa(e));
		this.btnNext?.addEventListener("click", () => this.carregarPokemonsProximaPagina());
		this.btnPrevious?.addEventListener("click", () => this.carregarPokemonsPaginaAnterior());
		this.btnSearch.addEventListener("click", () => this.carregarPokemonPesquisado());
	}

	configurarElementos() {
		this.pokemonsContainer = document.getElementById("PokemonList") as HTMLDivElement;
		this.btnNext = document.getElementById("btn-next") as HTMLButtonElement;
		this.btnPrevious = document.getElementById("btn-previous") as HTMLButtonElement;
		this.btnSearch = document.getElementById("btn-search") as HTMLButtonElement;
		this.inputSearch = document.getElementById("input-search") as HTMLInputElement;
	}

	async pegarPokemons() {
		this.pokemonsList = await this.pokemonService.carregarPokemons();
		console.log("aqui", this.pokemonsList);
		this.renderizarListaEmTela(this.pokemonsList);
		console.log(this.pokemonsList);
	}

	async carregarPokemonsProximaPagina() {
		try {
			this.btnNext.disabled = true;
			this.pokemonsList = await this.pokemonService.carregarPokemonsProximaPagina();
			this.pokemonsContainer.innerHTML = "";
			this.renderizarListaEmTela(this.pokemonsList);
		} catch (err) {
			console.log(err);
		} finally {
			this.btnNext.disabled = false;
		}
	}

	async carregarPokemonsPaginaAnterior() {
		try {
			this.btnPrevious.disabled = true;
			this.pokemonsList = await this.pokemonService.carregarPokemonsPaginaAnterior();
			this.pokemonsContainer.innerHTML = "";
			this.renderizarListaEmTela(this.pokemonsList);
		} catch (err) {
			console.log(err);
		} finally {
			this.btnPrevious.disabled = false;
		}
	}

	async carregarPokemonPesquisado() {
		const pokemonInput = this.inputSearch.value;

		if (pokemonInput == null || pokemonInput == "") {
			return;
		}

		try {
			this.btnSearch.disabled = true;
			const pokemonPesquisado = await this.pokemonService.selecionarPokemonPorNome(pokemonInput.toLowerCase());
			this.pokemonsContainer.innerHTML = "";
			this.criarCardsPokemons(pokemonPesquisado);
		} catch (err) {
			const error = err as Error;
			console.log(error.message);
		} finally {
			this.btnSearch.disabled = false;
		}
	}

	private renderizarListaEmTela(pokemonsList: Pokemon[]): void {
		pokemonsList.forEach((pokemon) => {
			this.criarCardsPokemons(pokemon);
		});
		this.AtualizarBotoes();
	}

	private criarCardsPokemons(pokemon: Pokemon): void {
		const pokemonImg = document.createElement("img");
		pokemonImg.src = pokemon.spriteUrl;

		const pokemonId = document.createElement("span");
		pokemonId.textContent = "ID: ";
		pokemonId.setAttribute("class", "id");

		const pokemonIdNumber = document.createElement("span");
		pokemonIdNumber.textContent = FormatarNumeroDoisAlgarismos(pokemon.id);
		pokemonId.appendChild(pokemonIdNumber);

		const pokemonName = document.createElement("span");
		pokemonName.setAttribute("class", "pokemon-name");
		pokemonName.textContent = pokemon.nome;

		const card = document.createElement("a");
		card.setAttribute("class", "pokemon-card");
		card.appendChild(pokemonImg);
		card.appendChild(pokemonId);
		card.appendChild(pokemonName);

		this.pokemonsContainer?.appendChild(card);
	}

	private AtualizarBotoes() {
		if (this.pokemonService.POKEMON_PREVIOUS_PAGE == null) {
			this.btnPrevious.classList.add("hide");
		} else {
			this.btnPrevious.classList.remove("hide");
		}

		if (this.pokemonService.POKEMON_NEXT_PAGE === null) {
			this.btnNext.classList.add("hide");
		} else {
			this.btnNext.classList.remove("hide");
		}
	}

	private atualizarEstadoBotaoPesquisa(e: Event) {
		const input = e.target as HTMLInputElement;

		if (input.value === "" || input.value === null) {
			this.btnSearch.disabled = true;
			this.pokemonsContainer.innerHTML = "";
			this.pegarPokemons();
		} else {
			this.btnSearch.disabled = false;
		}
	}

	private selecionarCardClicado(e: Event) {
		e.preventDefault();
		const card = e.target as HTMLAnchorElement;
		const anchor = card.closest("a");
		const pokemonName = anchor?.childNodes[2].textContent;
		if (!pokemonName) return;
		if (pokemonName !== null) this.redirecionarUsuario(pokemonName);
	}

	private redirecionarUsuario(nome: string): any {
		window.location.href = "pokemon-detalhes.html?nome=" + nome;
	}
}

window.addEventListener("load", async () => new TelaPokemon());
