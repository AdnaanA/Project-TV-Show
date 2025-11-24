//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const titleElem = document.getElementById("title");
  const imgEpisodeElem = document.getElementById("img-of-episode");
  const seasonAndEpisodeElem = document.getElementById("season-and-episode");
  const summaryElem = document.getElementById("summary");
  

  titleElem.textContent = episodeList[0].name;
  imgEpisodeElem.innerHTML = `<img src="${episodeList[0].image.medium}" alt="${episodeList[0].name || "Episode image"}">`;
  seasonAndEpisodeElem.textContent = `S${String(episodeList[0].season).padStart(2, "0")}E${String(episodeList[0].number).padStart(2, "0")}`;
  let summaryLength = 152;
  if (episodeList[0].summary.length > summaryLength) {
    summaryElem.innerHTML = `${episodeList[0].summary.substring(0, summaryLength)}...`;
  }
  

}



window.onload = setup;
