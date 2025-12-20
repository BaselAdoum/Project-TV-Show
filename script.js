// 1️⃣ Global variables
let allEpisodes = [];
let allShows = [];
let showEpisodesCache = {}; // Cache for episodes by show ID

// 2️⃣ Setup function
window.onload = setup;

function setup() {
  // Start with empty container
  makePageForEpisodes([]);

  // Setup show dropdown (will be populated after fetch)
  setupShowSelect();

  // Setup search (initially disabled until shows are loaded)
  setupSearch();

  // Fetch all shows from TVMaze API
  fetch("https://api.tvmaze.com/shows")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load shows");
      }
      return response.json();
    })
    .then((shows) => {
      // Sort shows alphabetically, case-insensitive
      allShows = shows.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );

      // Populate show dropdown
      populateShowSelect(allShows);

      // Load the first show by default
      if (allShows.length > 0) {
        loadShowEpisodes(allShows[0].id);
      }
    })
    .catch((error) => {
      // Show error message only if fetch fails
      const rootElem = document.getElementById("root");
      rootElem.innerHTML = `<div class="error-message">Error: Could not load shows. ${error.message}</div>`;
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
    // Don't show anything when list is empty
    rootElem.appendChild(episodesContainer);
    return;
  }

  // Loop through each episode and create a card
  for (let i = 0; i < episodeList.length; i++) {
    const episode = episodeList[i];

    // Format episode code (S01E01 format)
    const seasonPadded = episode.season.toString().padStart(2, "0");
    const episodePadded = episode.number.toString().padStart(2, "0");
    const episodeCode = `S${seasonPadded}E${episodePadded}`;

    // Create episode card
    const episodeCard = document.createElement("div");
    episodeCard.className = "episode-card";

    // Set the content for the episode card
    episodeCard.innerHTML = `
      <h2>${episode.name} - ${episodeCode}</h2>
      <img src="${
        episode.image
          ? episode.image.medium
          : "https://via.placeholder.com/250x140?text=No+Image"
      }" alt="${episode.name}">
      <div class="summary">${episode.summary || "No summary available"}</div>
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
        (ep.summary && ep.summary.toLowerCase().includes(query))
    );

    // Render only filtered episodes
    makePageForEpisodes(filtered);
  });
}

// 5️⃣ Episode select dropdown setup
function setupEpisodeSelect() {
  // Get select element
  const select = document.getElementById("episodeSelect");

  // Clear existing options
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

// 6️⃣ Show select dropdown setup
function setupShowSelect() {
  const select = document.getElementById("showSelect");

  // Create a default loading option
  const loadingOption = document.createElement("option");
  loadingOption.value = "";
  loadingOption.textContent = "Loading shows...";
  loadingOption.disabled = true;
  select.appendChild(loadingOption);
}

function populateShowSelect(shows) {
  const select = document.getElementById("showSelect");

  // Clear existing options
  select.innerHTML = "";

  // Create a default option
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select a TV show...";
  select.appendChild(defaultOption);

  // Add options for each show
  shows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    select.appendChild(option);
  });

  // Handle show selection change
  select.addEventListener("change", (event) => {
    const showId = event.target.value;
    if (showId) {
      loadShowEpisodes(showId);
    } else {
      // Clear episodes if no show is selected
      allEpisodes = [];
      makePageForEpisodes([]);
      setupEpisodeSelect();
      updateCounter(0, 0);
    }
  });
}

// 7️⃣ Function to load episodes for a specific show
function loadShowEpisodes(showId) {
  const rootElem = document.getElementById("root");

  // Show loading message
  rootElem.innerHTML = '<div class="loading-message">Loading episodes...</div>';

  // Check if we already have episodes cached for this show
  if (showEpisodesCache[showId]) {
    allEpisodes = showEpisodesCache[showId];
    makePageForEpisodes(allEpisodes);
    setupEpisodeSelect();
    updateCounter(allEpisodes.length, allEpisodes.length);
    return;
  }

  // Fetch episodes for the selected show
  fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load episodes");
      }
      return response.json();
    })
    .then((episodes) => {
      // Cache the episodes
      showEpisodesCache[showId] = episodes;
      allEpisodes = episodes;

      // Display episodes
      makePageForEpisodes(episodes);
      setupEpisodeSelect();
      updateCounter(episodes.length, episodes.length);

      // Clear search input when switching shows
      document.getElementById("searchInput").value = "";
    })
    .catch((error) => {
      // Show error message
      rootElem.innerHTML = `<div class="error-message">Error: Could not load episodes. ${error.message}</div>`;
      updateCounter(0, 0);
    });
}

// 8️⃣ Counter updater ("Displaying X/Y episodes")
function updateCounter(current, total) {
  const counter = document.getElementById("episodeCounter");
  if (counter) {
    counter.textContent = `Displaying ${current}/${total} episodes`;
  }
}
