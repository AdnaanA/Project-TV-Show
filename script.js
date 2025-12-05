// =======================================
// GLOBAL STORAGE FOR FETCHED EPISODES
// =======================================
let _episodes = []; // holds GOT episodes once fetched

// =======================================
// SHOW / HIDE SPINNER HELPERS
// =======================================
function showSpinner() {
  document.getElementById("loading-spinner").classList.remove("hidden");
}

function hideSpinner() {
  document.getElementById("loading-spinner").classList.add("hidden");
}

// =======================================
// ERROR MESSAGE HELPERS
// =======================================
function showError(message) {
  const box = document.getElementById("error-message");
  box.textContent = message;
  box.classList.remove("hidden");
}

function hideError() {
  document.getElementById("error-message").classList.add("hidden");
}

// =======================================
// SETUP (runs on page load)
// =======================================
async function setup() {
  showSpinner(); // show spinner immediately
  hideError(); // hide old errors if any

  // 1. Fetch real episodes from TVMaze API
  _episodes = await loadEpisodes();

  // 2. Render cards
  makePageForEpisodes(_episodes);

  // 3. Populate dropdown
  populateSelectOptions();

  // 4. Setup events
  document
    .getElementById("searchInput")
    .addEventListener("input", handleQueries);
  document.getElementById("select").addEventListener("change", handleQueries);
}

// =======================================
// FETCH EPISODES FOR GAME OF THRONES (ID 82)
// =======================================
async function loadEpisodes() {
  try {
    showSpinner();
    hideError(); // clear previous messages

    const response = await fetch("https://api.tvmaze.com/shows/82/episodes");

    // If HTTP error (404, 500, etc.)
    if (!response.ok) {
      showError(`Server error: ${response.status} ${response.statusText}`);
      return [];
    }

    // Convert to JSON
    const episodes = await response.json();
    return episodes;
  } catch (err) {
    // Network error (offline, no DNS, etc.)
    showError(
      "Failed to load episodes. Please check your internet connection, try again later. or report to admin."
    );
    console.error("Fetch error:", err);
    return [];
  } finally {
    hideSpinner(); // hide spinner no matter what
  }
}

// =======================================
// Return stored episodes
// =======================================
function getAllEpisodes() {
  return _episodes || [];
}

// =======================================
// RENDER ALL EPISODE CARDS
// =======================================
function makePageForEpisodes(episodeList) {
  const container = document.getElementById("episodes-container");
  container.innerHTML = "";

  const frag = document.createDocumentFragment();

  (episodeList || []).forEach((episode) => {
    const card = makeEpisodeCard(episode);
    frag.appendChild(card);
  });

  container.appendChild(frag);
}

// =======================================
// BUILD A SINGLE EPISODE CARD
// =======================================
function makeEpisodeCard(episode) {
  const card = document.createElement("article");
  card.classList.add("episode-card");

  // Title
  const titleElem = document.createElement("h2");
  titleElem.classList.add("title");
  titleElem.textContent = episode?.name || "Untitled";

  // Image
  const imgEpisodeElem = document.createElement("figure");
  imgEpisodeElem.classList.add("img-of-episode");

  const img = document.createElement("img");
  img.src = episode?.image?.medium || "https://placehold.co/600x400";
  img.alt = episode?.name ? `${episode.name} thumbnail` : "Episode image";
  imgEpisodeElem.appendChild(img);

  // Content wrapper
  const episodeContent = document.createElement("div");
  episodeContent.classList.add("episode-content");

  // Episode code
  const seasonAndEpisodeElem = document.createElement("p");
  seasonAndEpisodeElem.classList.add("season-and-episode");
  seasonAndEpisodeElem.textContent = getEpisodeCode(episode);

  // Summary
  const summaryElem = document.createElement("p");
  summaryElem.classList.add("summary");

  const summaryLength = 152;

  if (episode?.summary) {
    const tmp = document.createElement("div");
    tmp.innerHTML = episode.summary;
    const text = (tmp.textContent || "").trim();

    summaryElem.textContent =
      text.length > summaryLength
        ? text.substring(0, summaryLength) + "..."
        : text;
  } else {
    summaryElem.textContent = "No summary available.";
  }

  episodeContent.appendChild(titleElem);
  episodeContent.appendChild(seasonAndEpisodeElem);
  episodeContent.appendChild(summaryElem);

  // Clickable card
  if (episode?.url) {
    const link = document.createElement("a");
    link.href = episode.url;
    link.classList.add("episode-link");
    link.setAttribute(
      "aria-label",
      `${episode.name} - ${getEpisodeCode(episode)}`
    );

    link.appendChild(imgEpisodeElem);
    link.appendChild(episodeContent);
    card.appendChild(link);
  } else {
    card.appendChild(imgEpisodeElem);
    card.appendChild(episodeContent);
  }

  return card;
}

// =======================================
// SEARCH + FILTER
// =======================================
function handleQueries() {
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const select = document.getElementById("select").value;

  let filteredEpisodes = getAllEpisodes() || [];

  if (select !== "all-episodes") {
    filteredEpisodes = filteredEpisodes.filter(
      (episode) => episode.id === parseInt(select)
    );
  }

  if (searchInput && select === "all-episodes") {
    filteredEpisodes = filteredEpisodes.filter((episode) => {
      const name = (episode.name || "").toLowerCase();

      let summaryText = "";
      if (episode.summary) {
        const tmp = document.createElement("div");
        tmp.innerHTML = episode.summary;
        summaryText = (tmp.textContent || "").toLowerCase();
      }

      return name.includes(searchInput) || summaryText.includes(searchInput);
    });
  }

  makePageForEpisodes(filteredEpisodes);
}

// =======================================
// POPULATE DROPDOWN
// =======================================
function populateSelectOptions() {
  const select = document.getElementById("select");
  const episodes = getAllEpisodes() || [];

  select.innerHTML = `<option value="all-episodes">All Episodes</option>`;

  episodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = String(episode.id);
    option.textContent = `S${getEpisodeCode(episode)} - ${episode.name}`;
    select.appendChild(option);
  });
}

// =======================================
// EPISODE CODE (e.g. S02 E07)
// =======================================
function getEpisodeCode(episode) {
  return `S${String(episode.season).padStart(2, "0")} E${String(
    episode.number
  ).padStart(2, "0")}`;
}

// =======================================
window.onload = setup;
