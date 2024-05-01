function handleKeyPress(event) {
    if (event.key === 'Enter') {
        searchPokemon();
    }
}

function searchPokemon() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${searchInput}`;

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
