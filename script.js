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

function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");

  // Clear the current content
  rootElem.innerHTML = "";

  // Create a container for all episodes
  const episodesContainer = document.createElement("div");
  episodesContainer.className = "episodes-container";

  // Loop through each episode and create a card
  for (let i = 0; i < episodeList.length; i++) {
    const episode = episodeList[i];

    // Create episode card
    const episodeCard = document.createElement("div");
    episodeCard.className = "episode-card";

    // Format episode code (S01E01 format)
    // We need to pad season and number to 2 digits
    const seasonPadded = episode.season.toString().padStart(2, "0");
    const episodePadded = episode.number.toString().padStart(2, "0");
    const episodeCode = `S${seasonPadded}E${episodePadded}`;

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
  const attribution = document.createElement("p");
  attribution.innerHTML =
    'Data originally from <a href="https://www.tvmaze.com/" target="_blank">TVMaze.com</a>';
  rootElem.appendChild(attribution);
}

window.onload = setup;