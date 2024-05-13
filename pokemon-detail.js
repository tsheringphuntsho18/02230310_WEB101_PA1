// pokemon-detail.js
document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const pokemonId = urlParams.get('id');

    const response = await fetch(`${pokemonId}`);
    const pokemonData = await response.json();

    const pokemonDetails = document.getElementById("pokemon-details");
    pokemonDetails.innerHTML = `
        <h1>${pokemonData.name}</h1>
        <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
        <p><strong>Type:</strong> ${pokemonData.types.map(type => type.type.name).join(", ")}</p>
        <p><strong>Abilities:</strong> ${pokemonData.abilities.map(ability => ability.ability.name).join(", ")}</p>
        <p><strong>Base Experience:</strong> ${pokemonData.base_experience}</p>
        <p><strong>Weight:</strong> ${pokemonData.weight}</p>
        <p><strong>Height:</strong> ${pokemonData.height}</p>
        <p><strong>Moves:</strong> ${pokemonData.moves.map(move => move.move.name).join(", ")}</p>
    `;
});

let currentPokemonId = null;

document.addEventListener("DOMContentLoaded", () => {
  const MAX_POKEMONS = 151;
  const pokemonID = new URLSearchParams(window.location.search).get("id");
  const id = parseInt(pokemonID, 10);

  if (id < 1 || id > MAX_POKEMONS) {
    return (window.location.href = "./index.html");
  }

  currentPokemonId = id;
  loadPokemon(id);
});

async function loadPokemon(id) {
  try {
    const [pokemon, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
        res.json()
      ),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) =>
        res.json()
      ),
    ]);

    const abilitiesWrapper = document.querySelector(
      ".pokemon-detail-wrap .pokemon-detail.move"
    );
    abilitiesWrapper.innerHTML = "";

    if (currentPokemonId === id) {
      displayPokemonDetails(pokemon);
      const flavorText = getEnglishFlavorText(pokemonSpecies);
      document.querySelector(".body3-fonts.pokemon-description").textContent =
        flavorText;

      const [leftArrow, rightArrow] = ["#leftArrow", "#rightArrow"].map((sel) =>
        document.querySelector(sel)
      );
      leftArrow.removeEventListener("click", navigatePokemon);
      rightArrow.removeEventListener("click", navigatePokemon);

      if (id !== 1) {
        leftArrow.addEventListener("click", () => {
          navigatePokemon(id - 1);
        });
      }
      if (id !== 151) {
        rightArrow.addEventListener("click", () => {
          navigatePokemon(id + 1);
        });
      }

      window.history.pushState({}, "", `./detail.html?id=${id}`);
    }

    return true;
  } catch (error) {
    console.error("An error occured while fetching Pokemon data:", error);
    return false;
  }
}

async function navigatePokemon(id) {
  currentPokemonId = id;
  await loadPokemon(id);
}