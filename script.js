//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  // Get container element to hold episode cards the html structure
  const container = document.getElementById("episodes-container");
  container.innerHTML = ""; // clear old cards
  
  // Create episode cards and append to container
  episodeList.forEach((episode) => {
    // Create elements for episode card
    const card = document.createElement("div");
    // Add class for styling
    card.classList.add("episode-card");

    const titleElem = document.createElement("div");
    titleElem.classList.add("title");

    const imgEpisodeElem = document.createElement("div");
    imgEpisodeElem.classList.add("img-of-episode");

    const episodeContent = document.createElement("div");
    episodeContent.classList.add("episode-content");

    const seasonAndEpisodeElem = document.createElement("div");
    seasonAndEpisodeElem.classList.add("season-and-episode");

    const summaryElem = document.createElement("div");
    summaryElem.classList.add("summary");

    // Title
    titleElem.textContent = episode.name;

    // Image with alt
    imgEpisodeElem.innerHTML = `
      <img src="${episode.image?.medium}" 
           alt="${episode.name || "Episode image"}">
    `;

    // Season + episode
    seasonAndEpisodeElem.textContent = `S${String(episode.season).padStart(2, "0")}
    E${String(episode.number).padStart(2, "0")}`;

    // Summary truncation
    let summaryLength = 152;
    if (episode.summary) {
      summaryElem.innerHTML =
        episode.summary.length > summaryLength
          ? `${episode.summary.substring(0, summaryLength)}...`
          : episode.summary;
    } else {
      summaryElem.textContent = "No summary available.";
    }

    // Build structure
    episodeContent.appendChild(titleElem);
    episodeContent.appendChild(seasonAndEpisodeElem);
    episodeContent.appendChild(summaryElem);

    card.appendChild(imgEpisodeElem);
    card.appendChild(episodeContent);

    container.appendChild(card);
  });
}


window.onload = setup;
