//You can edit ALL of the code here
function setup() {
	const allEpisodes = getAllEpisodes();
	makePageForEpisodes(allEpisodes);
	populateSelectOptions();

	// Event listeners for search and select
	document
		.getElementById('searchInput')
		.addEventListener('input', handleQueries);
	document.getElementById('select').addEventListener('change', handleQueries);
}

function makePageForEpisodes(episodeList) {
	// Get container element to hold episode cards the html structure
	const container = document.getElementById('episodes-container');
	container.innerHTML = ''; // clear old cards

	// Create episode cards and append to container
	episodeList.forEach((episode) => {
		generateEpisodeCard(episode, container);
	});
}

// Create episode card - extracted function for clarity
function generateEpisodeCard(episode, container) {
	const card = document.createElement('div');
	card.classList.add('episode-card');

	const titleElem = document.createElement('div');
	titleElem.classList.add('title');

	const imgEpisodeElem = document.createElement('div');
	imgEpisodeElem.classList.add('img-of-episode');

	const episodeContent = document.createElement('div');
	episodeContent.classList.add('episode-content');

	const seasonAndEpisodeElem = document.createElement('div');
	seasonAndEpisodeElem.classList.add('season-and-episode');

	const summaryElem = document.createElement('div');
	summaryElem.classList.add('summary');

	// Title
	titleElem.textContent = episode.name;

	// Image with alt
	imgEpisodeElem.innerHTML = `
      <img src="${episode.image?.medium}" 
           alt="${episode.name || 'Episode image'}">
    `;

	// Season + episode
	seasonAndEpisodeElem.textContent = 
  `S${String(episode.season).padStart(2,'0')} E${String(episode.number).padStart(2, '0')}`;

	// Summary truncation
	let summaryLength = 152;
	if (episode.summary) {
		summaryElem.innerHTML =
			episode.summary.length > summaryLength
				? `${episode.summary.substring(0, summaryLength)}...`
				: episode.summary;
	} else {
		summaryElem.textContent = 'No summary available.';
	}

	// Build structure
	episodeContent.appendChild(titleElem);
	episodeContent.appendChild(seasonAndEpisodeElem);
	episodeContent.appendChild(summaryElem);

	card.appendChild(imgEpisodeElem);
	card.appendChild(episodeContent);

	container.appendChild(card);
}

function handleQueries() {
	const searchInput = document
		.getElementById('searchInput')
		.value.toLowerCase();
	const select = document.getElementById('select').value;

	let filteredEpisodes = getAllEpisodes();

	if (select !== 'all-episodes') {
		filteredEpisodes = filteredEpisodes.filter(
			(episode) => episode.id === parseInt(select)
		);
	}

	if (searchInput && select == 'all-episodes') {
		filteredEpisodes = filteredEpisodes.filter(
			(episode) =>
				episode.name.toLowerCase().includes(searchInput) ||
				(episode.summary &&
					episode.summary.toLowerCase().includes(searchInput))
		);
	}
	makePageForEpisodes(filteredEpisodes);
}

function populateSelectOptions() {
	const select = document.getElementById('select');
	const episodes = getAllEpisodes();

	episodes.forEach((episode) => {
		const option = document.createElement('option');
		option.value = episode.id;
		option.textContent = `S${String(episode.season).padStart(
			2,
			'0'
		)} E${String(episode.number).padStart(2, '0')} - ${episode.name}`;
		select.appendChild(option);
	});
}

function getEpisodeCode(episode) {
  return `S${String(episode.season).padStart(2, '0')}E${String(
    episode.number
  ).padStart(2, '0')}`;
} 


window.onload = setup;