/**
 * Higher-order function for async-await error handling instead of putting try catch over and over again
 * @param {function} func as an async function
 * @returns {function}
 */

 export const catchErrors = func => {
    return function (...args) {
        return func(...args).catch((err) => {
            console.error(err)
        })
    }
}

/**
 * Format milliseconds to time duration
 * @param {number} ms number of milliseconds
 * @returns {string} formatted duration string
 * @example 216699 -> '3:36'
 */
export const formatDuration = ms => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor(((ms % 60000) / 1000));
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}