const POKEAPI_URL = "https://pokeapi.co/api/v2/pokemon";
const ITEMS_PER_PAGE = 16;
let currentPage = 1;
let isLoading = false;
let allPokemons = [];

// Function to fetch all Pokémon data from PokeAPI
async function fetchAllPokemonData() {
  const response = await fetch(`${POKEAPI_URL}?limit=10000`);
  const data = await response.json();
  allPokemons = data.results;
}

// Function to fetch Pokémon data from PokeAPI
async function fetchPokemonData(offset) {
  isLoading = true;
  const response = await fetch(
    `${POKEAPI_URL}?limit=${ITEMS_PER_PAGE}&offset=${offset}`
  );
  const data = await response.json();
  isLoading = false;
  return data.results;
}

// Function to render Pokémon cards using HTML template
function renderPokemonCards(pokemonList) {
  const pokemonContainer = document.getElementById("pokemonContainer");
  pokemonContainer.innerHTML = ""; // Clear previous results
  const template = document.getElementById("pokemonCardTemplate");

  pokemonList.forEach((pokemon) => {
    const clone = document.importNode(template.content, true);
    clone.querySelector(
      ".pokemon-img"
    ).src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getIdFromUrl(
      pokemon.url
    )}.png`;
    clone.querySelector(".pokemon-img").alt = pokemon.name;
    clone.querySelector(".pokemon-name").textContent = pokemon.name;
    clone.querySelector(".pokemon-id").textContent = `#${getIdFromUrl(
      pokemon.url
    )}`;
    clone
      .querySelector(".details-button")
      .addEventListener("click", () => viewDetails(getIdFromUrl(pokemon.url)));
    pokemonContainer.appendChild(clone);
  });
}

// Function to extract Pokémon ID from its URL
function getIdFromUrl(url) {
  return url.split("/").slice(-2, -1)[0];
}

// Function to handle pagination
async function handlePagination(page) {
  const offset = (page - 1) * ITEMS_PER_PAGE;
  const pokemonList = await fetchPokemonData(offset);
  renderPokemonCards(pokemonList);
}

// Initialize pagination and render initial Pokémon cards
handlePagination(currentPage);
fetchAllPokemonData(); // Fetch all Pokémon data for search functionality

// Function to display Pokémon details
function displayPokemon(pokemonData) {
  const pokemonInfoDiv = document.getElementById("pokemonInfo");
  const { name, id, types, sprites } = pokemonData;
  const typesList = types.map((type) => type.type.name).join(", ");

  const pokemonHTML = `
        <div>
            <img src="${sprites.front_default}" alt="${name}">
            <h2>${name}</h2>
            <p>ID: ${id}</p>
            <p>Types: ${typesList}</p>
        </div>
    `;
  pokemonInfoDiv.innerHTML = pokemonHTML;
}

// Function to search Pokémon based on input
function searchPokemon() {
  const searchInput = document.getElementById("searchInput");
  const searchValue = searchInput.value.toLowerCase();
  const idFilter = document.getElementById("idFilter").checked;
  const nameFilter = document.getElementById("nameFilter").checked;
  let filteredPokemons = [];

  if (idFilter) {
    filteredPokemons = allPokemons.filter((pokemon) => {
      const pokemonID = pokemon.url.split("/")[6];
      return pokemonID.startsWith(searchValue);
    });
  } else if (nameFilter) {
    filteredPokemons = allPokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().startsWith(searchValue)
    );
  }

  renderPokemonCards(filteredPokemons);

  const notFoundMessage = document.getElementById("notFoundMessage");
  if (filteredPokemons.length === 0) {
    notFoundMessage.style.display = "block";
  } else {
    notFoundMessage.style.display = "none";
  }

  searchInput.value = ""; // Clear the search input
}

// Function to handle key press event
function handleKeyPress(event) {
  if (event.key === "Enter") {
    searchPokemon();
  } else {
    filterPokemon(event.target.value);
  }
}

// Function to filter Pokémon in real-time as the user types
function filterPokemon(query) {
  const searchValue = query.toLowerCase();
  const idFilter = document.getElementById("idFilter").checked;
  const nameFilter = document.getElementById("nameFilter").checked;
  let filteredPokemons = [];

  if (idFilter) {
    filteredPokemons = allPokemons.filter((pokemon) => {
      const pokemonID = pokemon.url.split("/")[6];
      return pokemonID.startsWith(searchValue);
    });
  } else if (nameFilter) {
    filteredPokemons = allPokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().startsWith(searchValue)
    );
  }

  renderPokemonCards(filteredPokemons);

  const notFoundMessage = document.getElementById("notFoundMessage");
  if (filteredPokemons.length === 0) {
    notFoundMessage.style.display = "block";
  } else {
    notFoundMessage.style.display = "none";
  }
}

// Function to navigate to detail.html with Pokémon ID as URL parameter
function viewDetails(pokemonId) {
  window.location.href = `detail.html?id=${pokemonId}`;
}

// Function to handle image upload (if needed in the future)
/* function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageData = e.target.result;
            // Here, you can use imageData for further processing or display
            console.log("Uploaded image data:", imageData);
        };
        reader.readAsDataURL(file);
    }
} */
