//You can edit ALL of the code here
function setup() {
	// Load all episodes (fallback to empty array)
	const allEpisodes = getAllEpisodes() || [];
	makePageForEpisodes(allEpisodes);
	populateSelectOptions();

	// Event listeners for search and select
	document
		.getElementById('searchInput')
		.addEventListener('input', handleQueries);
	document.getElementById('select').addEventListener('change', handleQueries);
}

function makePageForEpisodes(episodeList) {
	// Episodes container
	const container = document.getElementById('episodes-container');
	container.innerHTML = ''; // clear old cards

	// Use DocumentFragment for batch append
	const frag = document.createDocumentFragment();
	(episodeList || []).forEach((episode) => {
		const card = makeEpisodeCard(episode);
		frag.appendChild(card);
	});
	container.appendChild(frag);
}

// Return a DOM node for an episode card (pure; does not append)
function makeEpisodeCard(episode) {
	// Root card element (semantic article)
	const card = document.createElement('article');
	card.classList.add('episode-card');

	// Title element (semantic heading)
	const titleElem = document.createElement('h2');
	titleElem.classList.add('title');
	titleElem.textContent = episode?.name || 'Untitled';

	// Image wrapper (semantic figure)
	const imgEpisodeElem = document.createElement('figure');
	imgEpisodeElem.classList.add('img-of-episode');

	// Create <img> safely (set src/alt)
	const img = document.createElement('img');
	img.src = episode?.image?.medium || 'https://placehold.co/600x400';
	img.alt = episode?.name ? `${episode.name} thumbnail` : 'Episode image';
	imgEpisodeElem.appendChild(img);

	// Content wrapper (title, season/episode, summary)
	const episodeContent = document.createElement('div');
	episodeContent.classList.add('episode-content');

	// Season and episode info
	const seasonAndEpisodeElem = document.createElement('p');
	seasonAndEpisodeElem.classList.add('season-and-episode');
	seasonAndEpisodeElem.textContent = getEpisodeCode(episode);

	// Summary (paragraph)
	const summaryElem = document.createElement('p');
	summaryElem.classList.add('summary');
	const summaryLength = 152;
	if (episode?.summary) {
		// Convert HTML to plain text before truncating
		const tmp = document.createElement('div');
		tmp.innerHTML = episode.summary; // parse HTML into the DOM
		const text = (tmp.textContent || '').trim();
		summaryElem.textContent =
			text.length > summaryLength
				? `${text.substring(0, summaryLength)}...`
				: text;
	} else {
		summaryElem.textContent = 'No summary available.';
	}

	// Assemble content
	episodeContent.appendChild(titleElem);
	episodeContent.appendChild(seasonAndEpisodeElem);
	episodeContent.appendChild(summaryElem);

	// If episode has a URL, wrap the entire visual card content in a single link
	if (episode?.url) {
		const link = document.createElement('a');
		link.href = episode.url;
		link.classList.add('episode-link');
		link.setAttribute(
			'aria-label',
			`${episode.name || 'Episode'} - ${getEpisodeCode(episode)}`
		);

		// move both image and content inside the link so the whole card is clickable
		link.appendChild(imgEpisodeElem);
		link.appendChild(episodeContent);
		card.appendChild(link);
	} else {
		card.appendChild(imgEpisodeElem);
		card.appendChild(episodeContent);
	}

	return card;
}

function handleQueries() {
	const searchInput = document
		.getElementById('searchInput')
		.value.toLowerCase();
	const select = document.getElementById('select').value;

	// Defensive: get episodes (default to empty array if provider missing)
	let filteredEpisodes = getAllEpisodes() || [];

	if (select !== 'all-episodes') {
		filteredEpisodes = filteredEpisodes.filter(
			(episode) => episode.id === parseInt(select)
		);
	}

	if (searchInput && select == 'all-episodes') {
		filteredEpisodes = filteredEpisodes.filter((episode) => {
			const name = (episode.name || '').toLowerCase();
			let summaryText = '';
			if (episode.summary) {
				const tmp = document.createElement('div');
				tmp.innerHTML = episode.summary;
				summaryText = (
					tmp.textContent ||
					tmp.innerText ||
					''
				).toLowerCase();
			}
			return (
				name.includes(searchInput) || summaryText.includes(searchInput)
			);
		});
	}
	makePageForEpisodes(filteredEpisodes);
}

function populateSelectOptions() {
	const select = document.getElementById('select');
	const episodes = getAllEpisodes() || [];

	episodes.forEach((episode) => {
		const option = document.createElement('option');
		option.value = String(episode.id);
		option.textContent = `S${getEpisodeCode(episode)} - ${episode.name}`;
		select.appendChild(option);
	});
}

function getEpisodeCode(episode) {
	return `S${String(episode.season).padStart(2, '0')} E${String(
		episode.number
	).padStart(2, '0')}`;
}

window.onload = setup;
