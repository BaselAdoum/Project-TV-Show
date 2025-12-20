// 1️⃣ Global variables
let allEpisodes = [];
let allShows = [];
let showEpisodesCache = {}; // Cache for episodes by show ID

// 2️⃣ Setup function
window.onload = setup;

function setup() {
  // Setup navigation button
  setupNavigation();

  // Setup show search
  setupShowSearch();

  // Setup show dropdown
  setupShowDropdown();

  // Setup episode search
  setupEpisodeSearch();

  // Setup episode select
  setupEpisodeSelect();

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

      // Display shows listing
      displayShowsListing(allShows);
      showShowsView();
    })
    .catch((error) => {
      // Show error message only if fetch fails
      const rootElem = document.getElementById("root");
      rootElem.innerHTML = `<div class="error-message">Error: Could not load shows. ${error.message}</div>`;
    });
}

// 3️⃣ Navigation setup
function setupNavigation() {
  const backButton = document.getElementById("backToShows");

  backButton.addEventListener("click", () => {
    showShowsView();
  });
}

// 4️⃣ Show shows listing view
function showShowsView() {
  // Update UI visibility
  document.getElementById("backToShows").classList.add("hidden");
  document.getElementById("showControls").classList.remove("hidden");
  document.getElementById("episodeControls").classList.add("hidden");

  // Clear episode search
  document.getElementById("episodeSearchInput").value = "";
  document.getElementById("episodeSelect").value = "all";

  // Reset show search and dropdown
  document.getElementById("showSearchInput").value = "";
  document.getElementById("showDropdown").value = "";

  // Display all shows listing
  displayShowsListing(allShows);
}

// 5️⃣ Show episodes view
function showEpisodesView(showId) {
  // Update UI visibility
  document.getElementById("backToShows").classList.remove("hidden");
  document.getElementById("showControls").classList.add("hidden");
  document.getElementById("episodeControls").classList.remove("hidden");

  // Load and display episodes for the selected show
  loadShowEpisodes(showId);
}

// 6️⃣ Display shows listing
function displayShowsListing(shows, filteredShows = null) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  // Create shows container
  const showsContainer = document.createElement("div");
  showsContainer.className = "shows-container";

  // Check if we have shows to display
  if (shows.length === 0) {
    showsContainer.innerHTML =
      '<div class="no-results">No shows found. Try a different search.</div>';
    rootElem.appendChild(showsContainer);
    updateShowCounter(0, filteredShows ? filteredShows.length : 0);
    populateShowDropdown(shows); // Update dropdown with filtered shows
    return;
  }

  // Loop through each show and create a card
  for (let i = 0; i < shows.length; i++) {
    const show = shows[i];

    // Create show card
    const showCard = document.createElement("div");
    showCard.className = "show-card";
    showCard.dataset.showId = show.id;

    // Create genres string
    const genresHtml =
      show.genres && show.genres.length > 0
        ? `<div class="show-genres"><strong>Genres:</strong> ${show.genres.join(
            ", "
          )}</div>`
        : '<div class="show-genres"><strong>Genres:</strong> Not specified</div>';

    // Create show details HTML
    showCard.innerHTML = `
      <div class="show-card-inner">
        <div class="show-image">
          <img src="${
            show.image
              ? show.image.medium
              : "https://via.placeholder.com/210x295?text=No+Image"
          }" 
               alt="${show.name}">
        </div>
        <div class="show-info">
          <h2 class="show-title">${show.name}</h2>
          <div class="show-meta">
            <span class="show-status"><strong>Status:</strong> ${
              show.status || "Unknown"
            }</span>
            <span class="show-rating"><strong>Rating:</strong> ${
              show.rating?.average || "N/A"
            }/10</span>
            <span class="show-runtime"><strong>Runtime:</strong> ${
              show.runtime || "N/A"
            } min</span>
          </div>
          ${genresHtml}
          <div class="show-summary">${
            show.summary
              ? show.summary.replace(/<[^>]*>/g, "")
              : "No summary available."
          }</div>
        </div>
      </div>
    `;

    // Add click event to show card
    showCard.addEventListener("click", () => {
      showEpisodesView(show.id);
    });

    // Add the card to the container
    showsContainer.appendChild(showCard);
  }

  // Add the shows container to the page
  rootElem.appendChild(showsContainer);

  // Add attribution to TVMaze (only if it doesn't exist yet)
  let attribution = document.querySelector("#attribution");
  if (!attribution) {
    attribution = document.createElement("p");
    attribution.id = "attribution";
    attribution.innerHTML =
      'Data originally from <a href="https://www.tvmaze.com/" target="_blank">TVMaze.com</a>';
    rootElem.appendChild(attribution);
  }

  // Update show counter
  updateShowCounter(
    shows.length,
    filteredShows ? filteredShows.length : allShows.length
  );

  // Populate show dropdown with filtered shows
  populateShowDropdown(shows);
}

// 7️⃣ Show search setup
function setupShowSearch() {
  const input = document.getElementById("showSearchInput");

  input.addEventListener("input", () => {
    const query = input.value.toLowerCase();

    // Filter shows by name, genres, or summary
    const filtered = allShows.filter((show) => {
      if (show.name.toLowerCase().includes(query)) return true;
      if (
        show.genres &&
        show.genres.some((genre) => genre.toLowerCase().includes(query))
      )
        return true;
      if (
        show.summary &&
        show.summary
          .replace(/<[^>]*>/g, "")
          .toLowerCase()
          .includes(query)
      )
        return true;
      return false;
    });

    // Display filtered shows
    displayShowsListing(filtered, filtered);
  });
}

// 8️⃣ Function to populate show dropdown with filtered shows
function populateShowDropdown(shows) {
  const dropdown = document.getElementById("showDropdown");

  // Save current selection
  const currentSelection = dropdown.value;

  // Clear existing options except the first one
  const firstOption = dropdown.querySelector('option[value=""]');
  dropdown.innerHTML = "";
  if (firstOption) dropdown.appendChild(firstOption);

  // Add shows to dropdown (sorted alphabetically)
  const sortedShows = [...shows].sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );

  sortedShows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    dropdown.appendChild(option);
  });

  // Restore selection if it still exists in the filtered list
  if (
    currentSelection &&
    dropdown.querySelector(`option[value="${currentSelection}"]`)
  ) {
    dropdown.value = currentSelection;
  } else {
    dropdown.value = "";
  }
}

// 9️⃣ Setup show dropdown selection
function setupShowDropdown() {
  const dropdown = document.getElementById("showDropdown");

  dropdown.addEventListener("change", () => {
    const selectedShowId = dropdown.value;
    if (selectedShowId) {
      // Find and highlight the selected show
      const selectedShowCard = document.querySelector(
        `.show-card[data-show-id="${selectedShowId}"]`
      );

      if (selectedShowCard) {
        // Scroll to the selected show
        selectedShowCard.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        // Highlight the selected show temporarily
        selectedShowCard.style.backgroundColor = "#e8f4ff";
        selectedShowCard.style.boxShadow = "0 0 0 3px #0077ff";

        setTimeout(() => {
          selectedShowCard.style.backgroundColor = "";
          selectedShowCard.style.boxShadow = "";
        }, 2000);
      }
    }
  });
}

// 🔟 Function to update show counter
function updateShowCounter(current, total) {
  const counter = document.getElementById("showCounter");
  if (counter) {
    counter.textContent = `Found ${current} shows`;
  }
}

// 1️⃣1️⃣ Episode search setup
function setupEpisodeSearch() {
  const input = document.getElementById("episodeSearchInput");

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

// 1️⃣2️⃣ Episode select dropdown setup
function setupEpisodeSelect() {
  const select = document.getElementById("episodeSelect");

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

function populateEpisodeSelect(episodes) {
  const select = document.getElementById("episodeSelect");

  // Clear existing options
  select.innerHTML = "";

  // Create "Show All" option
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "-- Show All Episodes --";
  select.appendChild(allOption);

  // Create options for each episode
  episodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.id;

    // Format episode code for display in dropdown
    const seasonPadded = episode.season.toString().padStart(2, "0");
    const episodePadded = episode.number.toString().padStart(2, "0");
    const episodeCode = `S${seasonPadded}E${episodePadded}`;

    option.textContent = `${episodeCode} - ${episode.name}`;
    select.appendChild(option);
  });
}

// 1️⃣3️⃣ Function to load episodes for a specific show
function loadShowEpisodes(showId) {
  const rootElem = document.getElementById("root");

  // Show loading message
  rootElem.innerHTML = '<div class="loading-message">Loading episodes...</div>';

  // Clear episode search and select
  document.getElementById("episodeSearchInput").value = "";

  // Check if we already have episodes cached for this show
  if (showEpisodesCache[showId]) {
    allEpisodes = showEpisodesCache[showId];
    makePageForEpisodes(allEpisodes);
    populateEpisodeSelect(allEpisodes);
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
      populateEpisodeSelect(episodes);
      updateCounter(episodes.length, episodes.length);
    })
    .catch((error) => {
      // Show error message
      rootElem.innerHTML = `<div class="error-message">Error: Could not load episodes. ${error.message}</div>`;
      updateCounter(0, 0);
    });
}

// 1️⃣4️⃣ Function to render episodes on the page
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
    episodesContainer.innerHTML =
      '<div class="no-results">No episodes found. Try a different search.</div>';
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

  // Update the episode counter
  updateCounter(episodeList.length, allEpisodes.length);
}

// 1️⃣5️⃣ Counter updater ("Displaying X/Y episodes")
function updateCounter(current, total) {
  const counter = document.getElementById("episodeCounter");
  if (counter) {
    counter.textContent = `Displaying ${current}/${total} episodes`;
  }
}
