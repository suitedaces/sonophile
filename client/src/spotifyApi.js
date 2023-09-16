import axios from "axios";

export const logOut = () => {
    axios.post(import.meta.env.VITE_API_URL + '/api/logout').then(() => {
        window.location = window.location.origin;
    });
}

axios.defaults.baseURL = 'https://api.spotify.com/v1/';
axios.defaults.headers['Content-type'] = 'application/json';
axios.defaults.headers['Accept'] = 'application/json';

axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401 && error.config.url !== '/api/logout') {
            logOut();
        }
        return Promise.reject(error);
    }
);

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