// LEVEL 400: Fetch cache 
const fetchCache = new Map();

// 1️⃣ Global variable for episodes
let allEpisodes = [];

// LEVEL 400: Currently selected show
let currentShowId = null;
// LEVEL 
// 400: Cached fetch helper
function cachedFetch(url) {
  if (!fetchCache.has(url)) {
    fetchCache.set(url, fetch(url).then(res => res.json()));
  }
  return fetchCache.get(url);
}

// 2️⃣ Setup function
window.onload = setup;

function setup() {
  makePageForEpisodes([]);
  loadShows();
  setupSearch();
  setupSelect();

  document
    .getElementById("showSelect")
    .addEventListener("change", (e) => {
      const showId = e.target.value;
      if (!showId) return;

      currentShowId = showId;
      fetchEpisodes(showId);
    });
}


// ============================
// Load shows into dropdown *400*
// ============================
function loadShows() {
  cachedFetch("https://api.tvmaze.com/shows")
    .then(shows => {
      shows.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );

      const showSelect = document.getElementById("showSelect");
      showSelect.innerHTML = `<option value="">Select a show</option>`;

      shows.forEach(show => {
        const option = document.createElement("option");
        option.value = show.id;
        option.textContent = show.name;
        showSelect.appendChild(option);
      });
    });
}

  // Fetch data from TVMaze API
  function fetchEpisodes(showId) {
  cachedFetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
    .then(episodes => {
      allEpisodes = episodes;
      makePageForEpisodes(allEpisodes);
      setupSelect();
      setupSearch();
      updateCounter(allEpisodes.length, allEpisodes.length);
    })
    .catch(error => {
      const rootElem = document.getElementById("root");
      rootElem.innerHTML = `
        <div class="error-message">
          Error: Could not load episodes. ${error.message}
        </div>`;
      updateCounter(0, 0);
    });
}

// 3️⃣ Function to render episodes on the page
function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");

  // Remove old episodes container if it exists
  const existingContainer = document.querySelector(".episodes-container");
  if (existingContainer) existingContainer.remove();

  // Clear any error/loading messages
  rootElem.innerHTML = "";

  // Create a container for all episodes
  const episodesContainer = document.createElement("div");
  episodesContainer.className = "episodes-container";

  // Check if we have episodes to display
  if (episodeList.length === 0) {
    // Don't show anything when list is empty (will show during initial load)
    rootElem.appendChild(episodesContainer);
    return;
  }

  // Loop through each episode and create a card
  for (let i = 0; i < episodeList.length; i++) {
    const episode = episodeList[i];

    // Format episode code (S01E01 format)
    // Pad season and episode number to 2 digits
    const seasonPadded = episode.season.toString().padStart(2, "0");
    const episodePadded = episode.number.toString().padStart(2, "0");
    const episodeCode = `S${seasonPadded}E${episodePadded}`;

    // Create episode card
    const episodeCard = document.createElement("div");
    episodeCard.className = "episode-card";

    // Set the content for the episode card
    episodeCard.innerHTML = `
      <h2>${episode.name} - ${episodeCode}</h2>
      <img src="${episode.image.medium}" alt="${episode.name}">
      <div class="summary">${episode.summary}</div>
    `;

    // Add the card to the container
    episodesContainer.appendChild(episodeCard);
  }

  // Add the episodes container to the page
  rootElem.appendChild(episodesContainer);

  // Add attribution to TVMaze (only if it doesn't exist yet)
  let attribution = document.querySelector("#attribution");
  if (!attribution) {
    attribution = document.createElement("p");
    attribution.id = "attribution";
    attribution.innerHTML =
      'Data originally from <a href="https://www.tvmaze.com/" target="_blank">TVMaze.com</a>';
    rootElem.appendChild(attribution);
  }

  // Update the episode counter
  updateCounter(episodeList.length, allEpisodes.length);
}

// 4️⃣ Search setup
function setupSearch() {
  const input = document.getElementById("searchInput");

  // Live search: filter as user types
  input.addEventListener("input", () => {
    const query = input.value.toLowerCase();

    // Filter global allEpisodes by name or summary
    const filtered = allEpisodes.filter(
      (ep) =>
        ep.name.toLowerCase().includes(query) ||
        (ep.summary || "").toLowerCase().includes(query)
    );

    // Render only filtered episodes
    makePageForEpisodes(filtered);
  });
}

// 5️⃣ Select dropdown setup
function setupSelect() {
  // Get select element (already exists in HTML)
  const select = document.getElementById("episodeSelect");

  // Clear existing options except the default one if it exists
  select.innerHTML = "";

  // Create "Show All" option
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "-- Show All Episodes --";
  select.appendChild(allOption);

  // Create options for each episode
  allEpisodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.id;

    // Format episode code for display in dropdown
    const seasonPadded = episode.season.toString().padStart(2, "0");
    const episodePadded = episode.number.toString().padStart(2, "0");
    const episodeCode = `S${seasonPadded}E${episodePadded}`;

    option.textContent = `${episodeCode} - ${episode.name}`;
    select.appendChild(option);
  });

  // Handle select change event
  select.addEventListener("change", () => {
    const value = select.value;
    if (value === "all") {
      makePageForEpisodes(allEpisodes);
    } else {
      const selectedEpisode = allEpisodes.find((ep) => ep.id == value);
      if (selectedEpisode) {
        makePageForEpisodes([selectedEpisode]);
      }
    }
  });
}

// 6️⃣ Counter updater ("Displaying X/Y episodes")
function updateCounter(current, total) {
  const counter = document.getElementById("episodeCounter");
  if (counter) {
    counter.textContent = `Displaying ${current}/${total} episodes`;
  }
}

