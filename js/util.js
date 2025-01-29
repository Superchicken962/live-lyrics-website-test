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
    return lyric;
}