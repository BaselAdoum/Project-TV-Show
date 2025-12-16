// // Requirements:
// //updated level 200 main
// // 1) All episodes must be shown
// // 2) For each episode, at least following must be displayed:
// //    - The name of the episode
// //    - The season number
// //    - The episode number
// //    - The medium-sized image for the episode
// //    - The summary text of the episode
// // 3) Combine season number and episode number into an episode code:
// //    - Each part should be zero-padded to two digits.
// //    - Example: S02E07 would be the code for the 7th episode of the 2nd season.
// // 4) Your page should state somewhere that the data has (originally) come from TVMaze.com,
// //    and link back to that site (or the specific episode on that site).

// // Code logic:
// // 1. Create setup function (gets data, sets up page, search, and select)
// // 2. Create function to insert data to DOM
// // 3. Call setup function upon load

// // 1️⃣ Global variable for all episodes (accessible to all functions)
// let allEpisodes = [];

// // 2️⃣ Setup function runs when the page loads
// window.onload = setup;

// function setup() {
//   allEpisodes = getAllEpisodes(); // Get data from episodes.js

//   // Create and setup the select dropdown BEFORE rendering episodes
//   setupSelect();

//   makePageForEpisodes(allEpisodes); // Display all episodes initially
//   setupSearch(); // Set up search functionality
//   updateCounter(allEpisodes.length, allEpisodes.length); // Initialize counter
// }

// // 3️⃣ Function to render episodes on the page
// function makePageForEpisodes(episodeList) {
//   const rootElem = document.getElementById("root");

//   // Remove old episodes container if it exists
//   const existingContainer = document.querySelector(".episodes-container");
//   if (existingContainer) existingContainer.remove();

//   // Create a container for all episodes
//   const episodesContainer = document.createElement("div");
//   episodesContainer.className = "episodes-container";

//   // Loop through each episode and create a card
//   for (let i = 0; i < episodeList.length; i++) {
//     const episode = episodeList[i];

//     // Format episode code (S01E01 format)
//     // Pad season and episode number to 2 digits
//     const seasonPadded = episode.season.toString().padStart(2, "0");
//     const episodePadded = episode.number.toString().padStart(2, "0");
//     const episodeCode = `S${seasonPadded}E${episodePadded}`;

//     // Create episode card
//     const episodeCard = document.createElement("div");
//     episodeCard.className = "episode-card";

//     // Set the content for the episode card
//     episodeCard.innerHTML = `
//       <h2>${episode.name} - ${episodeCode}</h2>
//       <img src="${episode.image.medium}" alt="${episode.name}">
//       <div class="summary">${episode.summary}</div>
//     `;

//     // Add the card to the container
//     episodesContainer.appendChild(episodeCard);
//   }

//   // Add the episodes container to the page
//   rootElem.appendChild(episodesContainer);

//   // Add attribution to TVMaze (only if it doesn't exist yet)
//   let attribution = document.querySelector("#attribution");
//   if (!attribution) {
//     attribution = document.createElement("p");
//     attribution.id = "attribution";
//     attribution.innerHTML =
//       'Data originally from <a href="https://www.tvmaze.com/" target="_blank">TVMaze.com</a>';
//     rootElem.appendChild(attribution);
//   }

//   // Update the episode counter
//   updateCounter(episodeList.length, allEpisodes.length);
// }

// // 4️⃣ Search setup
// function setupSearch() {
//   const input = document.getElementById("searchInput");

//   // Live search: filter as user types
//   input.addEventListener("input", () => {
//     const query = input.value.toLowerCase();

//     // Filter global allEpisodes by name or summary
//     const filtered = allEpisodes.filter(
//       (ep) =>
//         ep.name.toLowerCase().includes(query) ||
//         ep.summary.toLowerCase().includes(query)
//     );

//     // Render only filtered episodes
//     makePageForEpisodes(filtered);
//   });
// }

// // 5️⃣ Select dropdown setup
// function setupSelect() {
//   const rootElem = document.getElementById("root");

//   // Create select dropdown if it doesn't exist
//   let select = document.getElementById("episodeSelect");
//   if (!select) {
//     select = document.createElement("select");
//     select.id = "episodeSelect";

//     // Create "Show All" option
//     const allOption = document.createElement("option");
//     allOption.value = "all";
//     allOption.textContent = "-- Show All Episodes --";
//     select.appendChild(allOption);

//     // Create options for each episode
//     allEpisodes.forEach((episode) => {
//       const option = document.createElement("option");
//       option.value = episode.id;

//       // Format episode code for display in dropdown
//       const seasonPadded = episode.season.toString().padStart(2, "0");
//       const episodePadded = episode.number.toString().padStart(2, "0");
//       const episodeCode = `S${seasonPadded}E${episodePadded}`;

//       option.textContent = `${episodeCode} - ${episode.name}`;
//       select.appendChild(option);
//     });

//     // Add select dropdown to the top of the page
//     const topBar = document.querySelector(".top-bar");
//     if (topBar) {
//       // Insert select after search input if topBar exists
//       const searchInput = document.getElementById("searchInput");
//       if (searchInput) {
//         topBar.insertBefore(select, searchInput.nextSibling);
//       } else {
//         topBar.appendChild(select);
//       }
//     } else {
//       // Create a top bar if it doesn't exist
//       const topBar = document.createElement("div");
//       topBar.className = "top-bar";
//       topBar.appendChild(select);
//       rootElem.insertBefore(topBar, rootElem.firstChild);
//     }
//   }

//   // Handle select change event
//   select.addEventListener("change", () => {
//     const value = select.value;
//     if (value === "all") {
//       makePageForEpisodes(allEpisodes);
//     } else {
//       const selectedEpisode = allEpisodes.find((ep) => ep.id == value);
//       if (selectedEpisode) {
//         makePageForEpisodes([selectedEpisode]);
//       }
//     }
//   });
// }

// // 6️⃣ Counter updater ("Displaying X/Y episodes")
// function updateCounter(current, total) {
//   const label = document.getElementById("episodeCounter");
//   if (label) {
//     label.textContent = `Displaying ${current}/${total} episodes`;
//   } else {
//     // Create counter if it doesn't exist
//     const counter = document.createElement("div");
//     counter.id = "episodeCounter";
//     counter.textContent = `Displaying ${current}/${total} episodes`;

//     // Add counter to the top bar
//     const topBar = document.querySelector(".top-bar");
//     if (topBar) {
//       topBar.appendChild(counter);
//     } else {
//       const rootElem = document.getElementById("root");
//       rootElem.insertBefore(counter, rootElem.firstChild);
//     }
//   }
// }


// 1️⃣ Global variable for episodes
let allEpisodes = [];

// 2️⃣ Setup function
window.onload = setup;

function setup() {
  // Show loading message
  showMessage("Loading episodes from TVMaze...", "loading");
  
  // Fetch data from TVMaze API
  fetch('https://api.tvmaze.com/shows/82/episodes')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load episodes');
      }
      return response.json();
    })
    .then(episodes => {
      allEpisodes = episodes;
      makePageForEpisodes(allEpisodes);
      setupSelect();
      setupSearch();
      updateCounter(allEpisodes.length, allEpisodes.length);
    })
    .catch(error => {
      showMessage(`Error: Could not load episodes. ${error.message}`, "error");
    });
}

// 3️⃣ Basic message display (meets requirements)
function showMessage(text, type) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = `<div class="${type}-message">${text}</div>`;
}

// 4️⃣ Function to render episodes on the page
function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");

  // Remove old episodes container if it exists
  const existingContainer = document.querySelector(".episodes-container");
  if (existingContainer) existingContainer.remove();

  // Create a container for all episodes
  const episodesContainer = document.createElement("div");
  episodesContainer.className = "episodes-container";

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
    attribution.innerHTML = 'Data originally from <a href="https://www.tvmaze.com/" target="_blank">TVMaze.com</a>';
    rootElem.appendChild(attribution);
  }

  // Update the episode counter
  updateCounter(episodeList.length, allEpisodes.length);
}

// 5️⃣ Search setup
function setupSearch() {
  const input = document.getElementById("searchInput");

  // Live search: filter as user types
  input.addEventListener("input", () => {
    const query = input.value.toLowerCase();

    // Filter global allEpisodes by name or summary
    const filtered = allEpisodes.filter(
      (ep) =>
        ep.name.toLowerCase().includes(query) ||
        ep.summary.toLowerCase().includes(query)
    );

    // Render only filtered episodes
    makePageForEpisodes(filtered);
  });
}

// 6️⃣ Select dropdown setup
function setupSelect() {
  const rootElem = document.getElementById("root");

  // Create select dropdown if it doesn't exist
  let select = document.getElementById("episodeSelect");
  if (!select) {
    select = document.createElement("select");
    select.id = "episodeSelect";

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

    // Add select dropdown to the top of the page
    const topBar = document.querySelector(".top-bar");
    if (topBar) {
      // Insert select after search input if topBar exists
      const searchInput = document.getElementById("searchInput");
      if (searchInput) {
        topBar.insertBefore(select, searchInput.nextSibling);
      } else {
        topBar.appendChild(select);
      }
    } else {
      // Create a top bar if it doesn't exist
      const topBar = document.createElement("div");
      topBar.className = "top-bar";
      topBar.appendChild(select);
      rootElem.insertBefore(topBar, rootElem.firstChild);
    }
  }

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

// 7️⃣ Counter updater ("Displaying X/Y episodes")
function updateCounter(current, total) {
  const label = document.getElementById("episodeCounter");
  if (label) {
    label.textContent = `Displaying ${current}/${total} episodes`;
  } else {
    // Create counter if it doesn't exist
    const counter = document.createElement("div");
    counter.id = "episodeCounter";
    counter.textContent = `Displaying ${current}/${total} episodes`;

    // Add counter to the top bar
    const topBar = document.querySelector(".top-bar");
    if (topBar) {
      topBar.appendChild(counter);
    } else {
      const rootElem = document.getElementById("root");
      rootElem.insertBefore(counter, rootElem.firstChild);
    }
  }
}