const params = new URLSearchParams(window.location.search);

const title = params.get("title") || "Unknown Station";
const streamUrl = params.get("streamUrl") || "";
const description = params.get("description") || "Live radio stream";
const image = params.get("image") || "";
const language = params.get("language") || "Radio Station";
const stationIndex = Number.parseInt(params.get("index") || "-1", 10);
const tamilStations = Array.isArray(window.TAMIL_RADIOS) ? window.TAMIL_RADIOS : [];

const descriptionNode = document.getElementById("station-description");
const imageNode = document.getElementById("station-image");
const playerNode = document.getElementById("station-player");
const previousButton = document.getElementById("previous-station");
const nextButton = document.getElementById("next-station");
const playbackButton = document.getElementById("toggle-playback");
const playbackIcon = document.getElementById("playback-icon");
const breadcrumbCurrent = document.getElementById("breadcrumb-current");
const favoriteButton = document.getElementById("toggle-favorite");
const shareButton = document.getElementById("share-station");
const shareMenu = document.getElementById("share-menu");
const shareWhatsapp = document.getElementById("share-whatsapp");
const shareTwitter = document.getElementById("share-twitter");
const shareFacebook = document.getElementById("share-facebook");
const shareTelegram = document.getElementById("share-telegram");
const copyShareLinkButton = document.getElementById("copy-share-link");

function updatePlaybackIcon() {
  const isPaused = playerNode.paused;
  playbackIcon.innerHTML = isPaused ? "&#9654;" : "&#10074;&#10074;";
  playbackButton.setAttribute("aria-label", isPaused ? "Play station" : "Pause station");
}

function updateFavoriteIcon(station) {
  const favorite = isFavoriteStation(station.streamUrl);
  favoriteButton.classList.toggle("icon-btn-active", favorite);
  favoriteButton.setAttribute("aria-label", favorite ? "Remove from favorites" : "Add to favorites");
}

function updateStationDetails(station) {
  descriptionNode.textContent = station.description || "Live radio stream";
  breadcrumbCurrent.textContent = station.title;
  imageNode.src = station.image || "";
  imageNode.alt = station.title;

  if (station.streamUrl) {
    playerNode.src = station.streamUrl;
    playerNode.play().catch(() => {});
  } else {
    playerNode.removeAttribute("src");
    descriptionNode.textContent = "This station is missing a valid stream URL.";
  }

  updatePlaybackIcon();
  updateFavoriteIcon(station);
  updateShareLinks(station);
}

function updateNavButtons(index) {
  if (!tamilStations.length) {
    previousButton.disabled = true;
    nextButton.disabled = true;
    return;
  }

  previousButton.disabled = index <= 0;
  nextButton.disabled = index >= tamilStations.length - 1;
}

function resolveStation(station) {
  const parsedIndex = Number.parseInt(station.index, 10);
  const normalizedStreamUrl = (station.streamUrl || "").trim();

  if (normalizedStreamUrl) {
    const matchingIndex = tamilStations.findIndex(
      (candidate) => (candidate.streamUrl || "").trim() === normalizedStreamUrl
    );

    if (matchingIndex >= 0) {
      return {
        ...tamilStations[matchingIndex],
        language: station.language || "Tamil",
        index: matchingIndex
      };
    }
  }

  if (Number.isInteger(parsedIndex) && parsedIndex >= 0 && parsedIndex < tamilStations.length) {
    return {
      ...tamilStations[parsedIndex],
      language: station.language || "Tamil",
      index: parsedIndex
    };
  }

  return {
    index: Number.isInteger(parsedIndex) ? parsedIndex : -1,
    title: station.title || "Unknown Station",
    streamUrl: station.streamUrl || "",
    description: station.description || "Live radio stream",
    image: station.image || "",
    language: station.language || "Tamil"
  };
}

function goToStation(index) {
  const station = tamilStations[index];
  if (!station) {
    return;
  }

  const nextParams = new URLSearchParams({
    index: String(index),
    title: station.title,
    streamUrl: station.streamUrl,
    description: station.description || "Live radio stream",
    image: station.image || "",
    language: "Tamil"
  });

  window.location.href = `radio-player.html?${nextParams.toString()}`;
}

function buildStationUrl(station) {
  const shareParams = new URLSearchParams({
    index: String(station.index ?? -1),
    title: station.title,
    streamUrl: station.streamUrl,
    description: station.description || "Live radio stream",
    image: station.image || "",
    language: station.language || "Tamil"
  });

  return `${window.location.origin}${window.location.pathname}?${shareParams.toString()}`;
}

function updateShareLinks(station) {
  if (!shareWhatsapp || !shareTwitter || !shareFacebook || !shareTelegram || !copyShareLinkButton) {
    return;
  }

  const shareUrl = buildStationUrl(station);
  const shareText = `${station.title} - Listen on Radio Star`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);

  shareWhatsapp.href = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
  shareTwitter.href = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
  shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  shareTelegram.href = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
  copyShareLinkButton.dataset.shareUrl = shareUrl;
}

const currentStation = resolveStation({
  index: stationIndex,
  title,
  streamUrl,
  description,
  image,
  language
});
const currentStationIndex = Number.isInteger(currentStation.index) ? currentStation.index : stationIndex;

updateStationDetails(currentStation);
updateNavButtons(currentStationIndex);
updatePlaybackIcon();

previousButton.addEventListener("click", () => {
  if (currentStationIndex > 0) {
    goToStation(currentStationIndex - 1);
  }
});

nextButton.addEventListener("click", () => {
  if (currentStationIndex >= 0 && currentStationIndex < tamilStations.length - 1) {
    goToStation(currentStationIndex + 1);
  }
});

playbackButton.addEventListener("click", () => {
  if (!playerNode.src) {
    return;
  }

  if (playerNode.paused) {
    playerNode.play().catch(() => {});
  } else {
    playerNode.pause();
  }
});

favoriteButton.addEventListener("click", () => {
  const nextFavoriteState = toggleFavoriteStation({
    index: currentStation.index,
    title: currentStation.title,
    streamUrl: currentStation.streamUrl,
    description: currentStation.description || "Live radio stream",
    image: currentStation.image || "",
    language: currentStation.language || "Tamil"
  });

  favoriteButton.classList.toggle("icon-btn-active", nextFavoriteState);
  favoriteButton.setAttribute("aria-label", nextFavoriteState ? "Remove from favorites" : "Add to favorites");
});

if (shareButton && shareMenu) {
  shareButton.addEventListener("click", () => {
    const isHidden = shareMenu.hasAttribute("hidden");
    if (isHidden) {
      shareMenu.removeAttribute("hidden");
      shareButton.setAttribute("aria-expanded", "true");
    } else {
      shareMenu.setAttribute("hidden", "");
      shareButton.setAttribute("aria-expanded", "false");
    }
  });
}

if (copyShareLinkButton) {
  copyShareLinkButton.addEventListener("click", async () => {
    const shareUrl = copyShareLinkButton.dataset.shareUrl || buildStationUrl(currentStation);

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        copyShareLinkButton.textContent = "Copied";
        setTimeout(() => {
          copyShareLinkButton.textContent = "Copy Link";
        }, 1500);
        return;
      }
    } catch {
    }

    window.prompt("Copy this station link:", shareUrl);
  });
}

document.addEventListener("click", (event) => {
  if (shareMenu && shareButton && !shareMenu.contains(event.target) && !shareButton.contains(event.target)) {
    shareMenu.setAttribute("hidden", "");
    shareButton.setAttribute("aria-expanded", "false");
  }
});

playerNode.addEventListener("play", updatePlaybackIcon);
playerNode.addEventListener("pause", updatePlaybackIcon);

if (!tamilStations.length || currentStationIndex < 0) {
  previousButton.disabled = true;
  nextButton.disabled = true;
}
