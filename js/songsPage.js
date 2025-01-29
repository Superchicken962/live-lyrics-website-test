async function updateSongsList() {
    const songsData = await (await fetch("/data/songs.json")).json();

    const songsContainer = document.querySelector(".songs");

    if (songsData?.length === 0) {
        // TODO: Handle better.
        console.warn("No songs");
        return;
    }

    for (const song of songsData) {
        const element = document.createElement("a");
        element.className = "song";
        element.setAttribute("href", removeFileExtensions(`lyrics.html?song=${song.filename}`));
        
        element.setAttribute("data-name", song.name);
        element.setAttribute("data-author", song.author);

        element.innerHTML = `
            <p>
                <span class="author">${song.author}</span> - <span class="name">${song.name}</span>
            </p>
        `;

        songsContainer.appendChild(element);
    }
}

updateSongsList();