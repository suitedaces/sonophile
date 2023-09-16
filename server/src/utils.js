import axios from "axios";
import querystring from "querystring";
import { User } from "./mongoDb.js"
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from "./config.js";


// User-related utility functions
export const fetchUserProfile = async (access_token) => {
    return axios.get('https://api.spotify.com/v1/me', {
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    });
};

export const fetchUserTopData = async (access_token) => {
    const timeRanges = ['short_term', 'medium_term', 'long_term'];
    const currentLoginData = {
        timestamp: new Date(),
        data: {
            short_term: {},
            medium_term: {},
            long_term: {}
        }
    };

    for (const range of timeRanges) {
        const topArtistsResponse = await getUsersTopArtistsByRange(range, access_token);
        const topTracksResponse = await getUsersTopTracksByRange(range, access_token);

        currentLoginData.data[range].artists = topArtistsResponse.data.items.map((artist, index) => ({ 
            name: artist.name, 
            rank: index + 1
        }));

        currentLoginData.data[range].songs = topTracksResponse.data.items.map((track, index) => ({ 
            name: track.name, 
            rank: index + 1
        }));
    }

    return currentLoginData;
};

export const getUsersTopArtistsByRange = async (range, access_token) => {
    return axios.get(`https://api.spotify.com/v1/me/top/artists?time_range=${range}&limit=50`, {
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    });
};

export const getUsersTopTracksByRange = async (range, access_token) => {
    return axios.get(`https://api.spotify.com/v1/me/top/tracks?time_range=${range}&limit=50`, {
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    });
};

export const updateOrCreateUser = async (spotifyId, name, currentLoginData) => {
    const existingUser = await User.findOne({ spotifyId: spotifyId });

    if (existingUser) {
        existingUser.logins.push(currentLoginData);
        await existingUser.save();
    } else {
        const newUser = new User({
            spotifyId: spotifyId,
            name: name,
            logins: [currentLoginData]
        });
        await newUser.save();
    }
};



// random
export const generateRandomString = length => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

 export const catchErrors = func => {
    return function (...args) {
        return func(...args).catch((err) => {
            console.error(err)
        })
    }
}

export const formatDuration = ms => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor(((ms % 60000) / 1000));
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}


export const handleTokenExchange = async (code) => {
    return axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: querystring.stringify({
            code: code,
            redirect_uri: REDIRECT_URI,
            grant_type: 'authorization_code'
        }),
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`
        },
    });
};
