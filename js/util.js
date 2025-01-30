/**
 * Remvoes file extension if on github, or keep it if in localhost.
 * 
 * @param { String } str - String with file path/extension.
 */
function removeFileExtensions(str) {
    const isLocal = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

    return (isLocal) ? str : str.replace(".html", "");
}

/**
 * Get inner html for an error.
 * 
 * @param { Number } code - Error code.
 * @param { String } name - Error name.
 * @param { String } message - Error message.
 */
function errorHtml(code, name, message) {
    return `
        <p>Error: ${name}</p>
        <p>${message}</p>
    `;
}

/**
 * Formats lyric - eseentially just converts any special characters.
 *
 * @param { String } lyric - Lyric to format.
 * @returns { String } Lyric.
 */
function formatLyricText(lyric) {
    lyric = lyric.replaceAll("%m", `<i class="fa-solid fa-music"></i>`);

    return censorLyric(lyric);
}

/**
 * Censors lyrics depending on if user has selected to have them uncensored or not.
 * 
 * @param { String } lyric - Lyric to censor.
 */
function censorLyric(lyric) {
    // Do not censor if user has chosen to see uncensored lyrics
    if (localStorage.getItem("uncensored") === "true") return lyric;

    // Well obviously you need to write out the words to be able to censor them.
    const bannedWords = [
        "nigger", "nigga", "fuck", "fag", "faggot", "shit"
    ];

    // Replace each occurance of the word with the appropriate length of asterixes.
    for (const word of bannedWords) {
        lyric = lyric.replaceAll(word, "*".repeat(word.length))
    }

    return lyric;
}

/**
 * Checks if an element is in the viewport.
 * 
 * @param { HTMLElement } element - Element.
 * @returns { Boolean } is it?
 */
function isElementInView(element) {
    const bounds = element.getBoundingClientRect();

    return (
        bounds.top >= 0 && bounds.left >= 0 &&
        bounds.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        bounds.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}