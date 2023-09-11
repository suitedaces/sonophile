import axios from "axios";

// Local storage keys
const LOCALSTORAGE_KEYS = {
    accessToken: 'spotify_access_token',
    refreshToken: 'spotify_refresh_token',
    expireTime: 'spotify_token_expire_time',
    timestamp: 'spotify_token_timestamp',
}

// Local storage values
const LOCALSTORAGE_VALUES = {
    accessToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.accessToken),
    refreshToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken),
    expireTime: window.localStorage.getItem(LOCALSTORAGE_KEYS.expireTime),
    timestamp: window.localStorage.getItem(LOCALSTORAGE_KEYS.timestamp),
}

/**
 * Checks if the amount of time that has elapsed between the timestamp in localStorage
 * and now is greater than the expiration time which is 3600 sec (1 hour)
 * @returns {boolean} Wheter or not the access token in localStorage has expired 
 */
const hasTokenExpired = () => {
    const { accessToken, timestamp, expireTime } = LOCALSTORAGE_VALUES;
    if (!accessToken || !timestamp) {
        return false
    }
    const millisecondsElapsed = Date.now() - Number(timestamp); // Get the elapsed time by subtracting the current timestamp to the timestamp that the accessToken has been created on the localStorage.
    return (millisecondsElapsed / 1000) > Number(expireTime)    // Convert the elapse milisec to sec and compare to the expireTime (3600 sec)
}

/**
 * Clear out all localStorage items and reload page
 * @returns {void}
 */
export const logOut = () => {
    for (const property in LOCALSTORAGE_KEYS) {
        window.localStorage.removeItem(LOCALSTORAGE_KEYS[property])
    }
    // Navigate to homepage
    window.location = window.location.origin;
}

/**
 * Use the refresh token stored in localStorage and hit the /refresh_token route in node app, then update values in localStorage
 * using the data from the response
 * @returns {void}
 */
const refreshToken = async () => {
    try {
        // Logout if there's no refresh token stored or we've managed to get into a reload infinite loop
        if (!LOCALSTORAGE_KEYS.refreshToken || LOCALSTORAGE_VALUES.refreshToken === 'undefined' || (Date.now() - Number(LOCALSTORAGE_VALUES.timestamp) / 1000) < 1000) {
            console.error("No refresh token available");
            logOut();
        }

        // Go to 'refresh_token' endpoint or route in our node app where we can get a response of "data" which contains new values
        //  of access and refresh_token, token_type, token_expiry in 3600 seconds, and the scope
        const { data } = await axios.get(`/refresh_token?refresh_token=${LOCALSTORAGE_VALUES.refreshToken}`)

        // update the localStorage using the response data from refresh_token endpoint
        window.localStorage.setItem(LOCALSTORAGE_KEYS.accessToken, data.access_token)
        window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now())

        // reload the page for localStorage updates to be reflected
        window.location.reload();
    } catch (e) {
        console.error(e)
    }
}

const getAccessToken = () => {
    const queryString = window.location.search; // returns the url after "?"
    const urlParams = new URLSearchParams(queryString); // converts the url to an object
    const queryParams = {
        [LOCALSTORAGE_KEYS.accessToken]: urlParams.get('access_token'),
        [LOCALSTORAGE_KEYS.refreshToken]: urlParams.get('refresh_token'),
        [LOCALSTORAGE_KEYS.expireTime]: urlParams.get('expires_in'),
    }

    const hasError = urlParams.get('error');

    if (queryParams[LOCALSTORAGE_KEYS.accessToken]) {
        // If there is a token in the URL query params, then first log in
        // Store the query params in localStorage
        for (const property in queryParams) {
            window.localStorage.setItem(property, queryParams[property])
        }
        // Set timestamp
        window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now());
        // Return access token from query params
        return queryParams[LOCALSTORAGE_KEYS.accessToken];
    }

    // If there is an error or access token has expired or there is no access token, then refresh the token
    if (hasError || hasTokenExpired() || window.localStorage.getItem(LOCALSTORAGE_KEYS.accessToken) === 'undefined') {
        refreshToken()
    }

    if (LOCALSTORAGE_KEYS.accessToken && LOCALSTORAGE_KEYS.accessToken !== 'undefined') {
        // If there is a valid access token in local storage, use that
        return LOCALSTORAGE_VALUES.accessToken
    }

    return false;
}

export const accessToken = getAccessToken();

/**
 * Axios global req headers
 * https://axios-http.com/docs/config_defaults
 */

axios.defaults.baseURL = 'https://api.spotify.com/v1/';
axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
axios.defaults.headers['Content-type'] = 'application/json';
axios.defaults.headers['Accept'] = 'application/json';

// Axios Configuration
const headers = {
    'Authorization': `Bearer ${getAccessToken()}`,
    'Content-type': 'application/json',
    'Accept': 'application/json',
};

// User API Calls
export const getUser = () => axios.get('me', { headers });
export const getUsersTopArtistsByRange = (timeRange) => axios.get(`me/top/artists?limit=50&time_range=${timeRange}`, { headers });
export const getUsersTopTracksByRange = (timeRange) => axios.get(`me/top/tracks?limit=50&time_range=${timeRange}`, { headers });
export const getUsersTop9Artists = () => axios.get('me/top/artists?limit=9&time_range=long_term', { headers });
export const getUsersTopArtists = () => axios.get('me/top/artists?limit=50', { headers });
export const getUsersTopArtistsSinceWeeks = () => axios.get('me/top/artists?limit=50&time_range=short_term', { headers });
export const getUsersTopArtistsSinceAYear = () => axios.get('me/top/artists?limit=50&time_range=long_term', { headers });
export const getUsersTop5Tracks = () => axios.get('me/top/tracks?limit=9&time_range=long_term&limit=4', { headers });
export const getUsersTopTracks = () => axios.get('me/top/tracks?limit=50', { headers });
export const getUsersTopTracksSinceWeeks = () => axios.get('me/top/tracks?limit=50&time_range=short_term', { headers });
export const getUsersTopTracksSinceAYear = () => axios.get('me/top/tracks?limit=50&time_range=long_term', { headers });
export const getFollowing = () => axios.get('me/following?type=artist', { headers });
export const getRecentlyPlayed = () => axios.get('me/player/recently-played?limit=20', { headers });
export const getPlaylists = () => axios.get('me/playlists', { headers });

// Artists API Calls
export const getArtist = (id) => axios.get(`artists/${id}`, { headers });
export const getArtistsTopTracks = (id) => axios.get(`artists/${id}/top-tracks?market=IN`, { headers });
export const getArtistsAlbums = (id) => axios.get(`artists/${id}/albums?limit=30&include_groups=album`, { headers });
export const getArtistsRelatedArtists = (id) => axios.get(`artists/${id}/related-artists?limit=5`, { headers });
export const isArtistFollowedByUser = (id) => axios.get(`me/following/contains?type=artist&ids=${id}`, { headers });
export const followArtist = (id) => axios.put(`me/following?type=artist`, { ids: [id] }, { headers });
export const unfollowArtist = (id) => axios.delete(`me/following?type=artist&ids=${id}`, { headers });

// Track API Calls
export const getSong = (id) => axios.get(`tracks/${id}`, { headers });
export const getSongFeatures = (id) => axios.get(`audio-features/${id}`, { headers });
export const getTracksFeatures = (ids) => axios.get(`audio-features?ids=${ids}`, { headers });

// Library API Calls
export const getLikedSongs = () => axios.get('me/tracks?limit=50', { headers });
export const getUsersPodcasts = () => axios.get('me/shows', { headers });
export const getUsersPlaylists = () => axios.get('me/playlists', { headers });
export const getAPodcast = (id) => axios.get(`shows/${id}`, { headers });
export const getAPlaylist = (id) => axios.get(`playlists/${id}`, { headers });
export const getAPlaylistsTracks = (id) => axios.get(`playlists/${id}/tracks`, { headers });
export const getAnAlbum = (id) => axios.get(`albums/${id}`, { headers });
export const getAnAlbumsTracks = (id) => axios.get(`albums/${id}/tracks`, { headers });

// Recommendations
export const getRecommendations = (genre, props) => axios.get(`recommendations?min_popularity=50&market=US&seed_genres=${genre}&${props}`, { headers });

// Search
export const search = (query) => axios.get(`search/?q=${query}&type=artist,track&limit=3`, { headers });


export const aggregateTopGenres = async () => {
    try {
      // Fetch top artists and tracks
      const topArtistsResponse = await getUsersTopArtists();
      const topTracksResponse = await getUsersTopTracks();
  
      // Extract genres from both responses
      const artistGenres = topArtistsResponse.data.items.flatMap(artist => artist.genres);
      const trackGenres = topTracksResponse.data.items.flatMap(track => track.artists[0].genres);
  
      // Combine genres from both artists and tracks
      const allGenres = [...artistGenres, ...trackGenres];
  
      // Use reduce to accumulate genre counts
      const genreCounts = allGenres.reduce((acc, genre) => {
        acc[genre] = (acc[genre] || 0) + 1;
        return acc;
      }, {});
  
      return genreCounts;
    } catch (error) {
      console.error("Error aggregating top genres:", error);
      return {};
    }
  };