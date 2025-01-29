const container = document.querySelector(".mainContainer");

const elements = {
    songAuthor: container.querySelector(".info .songAuthor"),
    songName: container.querySelector(".info .songName"),
    lyrics: container.querySelector(".lyrics"),
    lyricLines: container.querySelector(".lyrics .lines"),
    controls: container.querySelector(".audioControls"),
    error: container.querySelector(".error"),
    audio: container.querySelector("audio") || document.createElement("audio")
};

async function updateSong(songFileName) {
    let song;
    
    try {
        song = await (await fetch(`/data/songs/${songFileName}.json`)).json();
    } catch (error) {
        elements.error.innerHTML = errorHtml(400, "Failed to parse song info", "Ensure the song data is valid and contains no errors");      
        return;
    }

    // const song = songs.find(s => s.filename === songFileName);

    if (!song) {
        elements.error.innerHTML = errorHtml(404, "Song Not Found", `The song '${songFileName}' was not found!`);
        return;
    }

    // Update page details fors song now.
    elements.songAuthor.textContent = song.author;
    elements.songName.textContent = song.name;

    elements.audio.src = `/data/audio/${songFileName}.${song.extension}`;

    elements.audio.ontimeupdate = () => {
        updateLyrics(song);
    }

    // Call it here so that the lyrics are shown before playing.
    updateLyrics(song);

    elements.audio.onvolumechange = () => {
        localStorage.setItem("audioVolume", elements.audio.volume);
    }
}

/**
 * Updates the lyrics according to the position in the audio.
 * 
 * @param { Object } song - Song details.
 */
function updateLyrics(song) {
    const lyrics = song.lyrics;
    const progress = Math.floor(elements.audio.currentTime);

    // If lyrics are not already shown, then create them.
    if (elements.lyricLines.querySelectorAll(".line").length === 0) {
        for (const lyric of lyrics) {
            const lyricEl = document.createElement("p");
            lyricEl.className = "line";
            lyricEl.textContent = formatLyricText(lyric.text);
            lyricEl.setAttribute("data-at", lyric.at);

            // When lyric line is clicked, go to that point in the song.
            lyricEl.onclick = () => {
                elements.audio.currentTime = lyric.at;
                elements.audio.play();
            }

            elements.lyricLines.appendChild(lyricEl);
        }

        return;
    }

    const existingLyrics = elements.lyricLines.querySelectorAll(".line");
    for (const lyric of existingLyrics) {
        const atPoint = parseInt(lyric.getAttribute("data-at"));

        // If lyric has passed "at" time, then add classname to show that. Otherwise remove it.
        if (elements.audio.currentTime >= atPoint) {
            lyric.classList.add("played");
        } else {
            lyric.classList.remove("played");
        }
    }
}

const presetVolume = localStorage.getItem("audioVolume");
if (presetVolume) {
    elements.audio.volume = presetVolume;
}

const searchParams = new URLSearchParams(window.location.search);
const songToSearch = searchParams.get("song");

updateSong(songToSearch);