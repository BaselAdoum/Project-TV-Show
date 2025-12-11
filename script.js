//Requirments:

// 1)All episodes must be shown
        // line 77
// 2)For each episode, at least following must be displayed:
    // The name of the episode
    // The season number
    // The episode number
    // The medium-sized image for the episode
    // The summary text of the episode
        // yes
// 3)Combine season number and episode number into an episode code:
    // Each part should be zero-padded to two digits.
    // Example: S02E07 would be the code for the 7th episode of the 2nd season. S2E7 would be incorrect.
          // line 50 - 55
// 4)Your page should state somewhere that the data has (originally) come from TVMaze.com, 
// and link back to that site (or the specific episode on that site). See tvmaze.com/api#licensing.
          // line 70 - 75
//for task 1 we need to do 2 things. one to bring data from
//the list of object file. 
//two, insert this data in the index.html file in order to render this data (dom).
// code logic
// 1 create function setup (it has 2 functions get data function, function to insert data to dom)
// 2 create function to insert data to dom 
// 3 call the function setup upon load. 


// 1️⃣ Global variable for all episodes
let allEpisodes = []; // Make this global so search can access it

// 2️⃣ Setup function runs when the page loads
window.onload = setup;
function setup() {
  allEpisodes = getAllEpisodes();        // get data from episodes.js
  makePageForEpisodes(allEpisodes);         // Display all episodes initially
  setupSearch();                         // Set up search functionality
  setupSelect();                             // Set up select dropdown 
  updateCounter(allEpisodes.length, allEpisodes.length);     // Initialize counter

}

// 3️⃣ Function to render episodes on the page
function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");

// Clear only episode container, keep attribution if exists
//Remove old container
  const existingContainer = document.querySelector(".episodes-container");
  if (existingContainer) existingContainer.remove();
  
  //create new container
  // Create a container for all episodes
  const episodesContainer = document.createElement("div");
  episodesContainer.className = "episodes-container";

  // Loop through each episode and create a card
  for (let i = 0; i < episodeList.length; i++) {
    const episode = episodeList[i];



    // Format episode code (S01E01 format)
    // We need to pad season and number to 2 digits
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

  // Add the container to the page
  rootElem.appendChild(episodesContainer);

  // Add attribution to TVMaze
  let attribution = document.createElement("p");
   if (!attribution) {
    attribution = document.createElement("p");
  attribution.innerHTML =
    'Data originally from <a href="https://www.tvmaze.com/" target="_blank">TVMaze.com</a>';
  rootElem.appendChild(attribution);
}
 updateCounter(episodeList.length, allEpisodes.length);
}
// 4️⃣ Search setup
function setupSearch() {
  const input = document.getElementById("searchInput");

  // Live search: filter as user types
  input.addEventListener("input", () => {
    const query = input.value.toLowerCase();

    // Filter global allEpisodes
    const filtered = allEpisodes.filter(ep =>
      ep.name.toLowerCase().includes(query) ||
      ep.summary.toLowerCase().includes(query)
    );

    // Render only filtered episodes
    makePageForEpisodes(filtered);
  });
}
// 5️⃣ Select dropdown setup
function setupSelect() {
  // create select dynamically above episodes container if not exists
  let select = document.getElementById("episodeSelect");
  if (!select) {
    const topBar = document.querySelector(".top-bar");
    select = document.createElement("select");
    select.id = "episodeSelect";

    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "-- Show All Episodes --";
    select.appendChild(allOption);

    
  }
 
 // Append container above attribution
  const attribution = document.querySelector("p") || document.createElement("p");
  if (!attribution.parentElement) {
    attribution.innerHTML =
      'Data originally from <a href="https://www.tvmaze.com/" target="_blank">TVMaze.com</a>';
    rootElem.appendChild(attribution);
  }

  rootElem.insertBefore(episodesContainer, attribution);
}
  // handle select change
  select.addEventListener("change", () => {
    const value = select.value;
    if (value === "all") {
      makePageForEpisodes(allEpisodes);
    } else {
      const selectedEpisode = allEpisodes.find(ep => ep.id == value);
      makePageForEpisodes([selectedEpisode]);
    }
  });

// 6️⃣ Counter updater ("Displaying X/Y episodes")
function updateCounter(current, total) {
  const label = document.getElementById("episodeCounter");
  label.textContent = `Displaying ${current}/${total} episodes`;
}
