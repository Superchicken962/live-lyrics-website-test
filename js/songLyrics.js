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

/**
 * Allow use of gaps in lyrics?
 */
const USE_LYRIC_GAPS = true;

async function updateSong(songFileName) {
    if (!songFileName) {
        document.querySelector(".mainContainer").innerHTML = errorHtml(404, "Song Not Found!", "Try selecting one from the list!", true);
        return;
    }

    let song = await fetch(`/data/songs/${songFileName}.json`);

    if (!song.ok) {
        document.querySelector(".mainContainer").innerHTML = errorHtml(404, "Song Not Found!", "Try selecting one from the list!", true);
        return;
    }

    // Catch errors parsing song (invalid data).
    try {
        song = await song.json();
    } catch (error) {
        elements.error.innerHTML = errorHtml(400, "Failed to parse song info", "Ensure the song data is valid and contains no errors");      
        return;
    }

    // const song = songs.find(s => s.filename === songFileName);

    if (!song) {
        elements.error.innerHTML = errorHtml(404, "Song Not Found", `The song '${songFileName}' was not found!`);
        return;
    }

    if (song.colour) {
        elements.lyrics.style.backgroundColor = `rgba(${song.colour}, 0.2)`;
    }

    // Update page details fors song now.
    elements.songAuthor.textContent = song.author;
    elements.songName.textContent = song.name;

    elements.audio.src = `/data/audio/${songFileName}.${song.extension}`;

    elements.audio.ontimeupdate = () => {
        console.debug("at position", elements.audio.currentTime);
        updateLyrics(song);

        // Experimental - re-enable auto scroll if user leaves scroll near current lyrics. Needs adjustment.
        // const played = document.querySelectorAll(".line.played");
            
        // if (isElementInView(played[played.length-1])) {
        //     useAutoScroll = true;
        // }
    }

    // Call it here so that the lyrics are shown before playing.
    updateLyrics(song);

    elements.audio.onvolumechange = () => {
        localStorage.setItem("audioVolume", elements.audio.volume);
    }
}

let useAutoScroll = true;

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
            lyricEl.innerHTML = formatLyricText(lyric.text);
            lyricEl.setAttribute("data-at", lyric.at);

            if (lyric.includeGap && USE_LYRIC_GAPS) {
                lyricEl.classList.add("gap");
            }

            // When lyric line is clicked, go to that point in the song.
            lyricEl.onclick = () => {
                elements.audio.currentTime = lyric.at;
                elements.audio.play();
            }

            elements.lyricLines.appendChild(lyricEl);
        }

        // Disable auto scroll when user manually scrolls.
        elements.lyricLines.addEventListener("scroll", () => {
            useAutoScroll = false;
        });

        return;
    }

    const existingLyrics = elements.lyricLines.querySelectorAll(".line");
    for (const lyric of existingLyrics) {
        const atPoint = parseInt(lyric.getAttribute("data-at"));

        // If lyric has passed "at" time, then add classname to show that. Otherwise remove it.
        if (progress >= atPoint) {
            lyric.classList.add("played");
            if (useAutoScroll) lyric.scrollIntoView({"block": "center"});
        } else {
            lyric.classList.remove("played");
        }
    }
}

/**
 * Gets the length of the longest/largest lyric in the song.
 *
 * @param { Object[] } lyrics - Song lyrics. 
 * @returns { Number } Length of lyric.
 */
function getLongestLyric(lyrics) {
    let maxLength = 0;

    for (const lyric of lyrics) {
        maxLength = Math.max(lyric.text.length, maxLength);
    }

    return maxLength;
}

const presetVolume = localStorage.getItem("audioVolume");
if (presetVolume) {
    elements.audio.volume = presetVolume;
}

const searchParams = new URLSearchParams(window.location.search);
const songToSearch = searchParams.get("song");

updateSong(songToSearch);