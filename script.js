function handleKeyPress(event) {
    if (event.key === 'Enter') {
        searchPokemon();
    }
  }
// Function to navigate to detail.html with Pokémon ID as URL parameter
function viewDetails(pokemonId) {
  window.location.href = `detail.html?id=${pokemonId}`;
}
  
function searchPokemon() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  const apiUrl = `https://pokeapi.co/api/v2/pokemon/${searchInput}`;
  
  // uodate
  fetch(apiUrl)
      .then(response => {
          if (!response.ok) {
              throw new Error('Pokemon not found!');
          }
          return response.json();
      })
      .then(data => {
          displayPokemon(data);
      })
      .catch(error => {
          console.error('Error fetching Pokemon data:', error);
          document.getElementById('pokemonInfo').innerHTML = 'Pokemon not found!';
      });
}
  
/*function handleImageUpload(event) {
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
}*/

const POKEAPI_URL = 'https://pokeapi.co/api/v2/pokemon';
const ITEMS_PER_PAGE = 16;
  
let currentPage = 1;
let isLoading = false;
  
// Function to fetch Pokémon data from PokeAPI
async function fetchPokemonData(offset) {
  isLoading = true;
  const response = await fetch(`${POKEAPI_URL}?limit=${ITEMS_PER_PAGE}&offset=${offset}`);
  const data = await response.json();
  isLoading = false;
  return data.results;
}
  
// Function to render Pokémon cards using HTML template
function renderPokemonCards(pokemonList) {
  const pokemonContainer = document.getElementById('pokemonContainer');
  const template = document.getElementById('pokemonCardTemplate');
  
  pokemonList.forEach(pokemon => {
      const clone = document.importNode(template.content, true);
      clone.querySelector('.pokemon-img').src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getIdFromUrl(pokemon.url)}.png`;
      clone.querySelector('.pokemon-img').alt = pokemon.name;
      clone.querySelector('.pokemon-name').textContent = pokemon.name;
      clone.querySelector('.pokemon-id').textContent = `#${getIdFromUrl(pokemon.url)}`;
      clone.querySelector('.details-button').addEventListener('click', () => viewDetails(pokemon.url));
      pokemonContainer.appendChild(clone);
  });
}
  
// Function to extract Pokémon ID from its URL
function getIdFromUrl(url) {
  return url.split('/').slice(-2, -1)[0];
}
  
// Function to handle pagination
async function handlePagination(page) {
  const offset = (page - 1) * ITEMS_PER_PAGE;
  const pokemonList = await fetchPokemonData(offset);
  renderPokemonCards(pokemonList);
}
  
// Function to initialize scrolling pagination
window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 5 && !isLoading) {
      currentPage++;
      handlePagination(currentPage);
  }
});
  
// Initialize pagination and render initial Pokémon cards
handlePagination(currentPage);
  
  
  
function displayPokemon(pokemonData) {
  const pokemonInfoDiv = document.getElementById('pokemonInfo');
  const { name, id, types, sprites } = pokemonData;
  
  const typesList = types.map(type => type.type.name).join(', ');
  
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
  
  