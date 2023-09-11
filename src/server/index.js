import dotenv from 'dotenv';
import express from 'express';
import querystring from 'querystring';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mongoose from 'mongoose';

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const FRONTEND_URI = process.env.FRONTEND_URI;
const PORT = process.env.PORT || 8888;
const MONGO_URI = process.env.MONGO_URI;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let User;

const artistSchema = new mongoose.Schema({
    name: String,
    rank: Number
});

const songSchema = new mongoose.Schema({
    name: String,
    rank: Number
});

const timeRangeDataSchema = new mongoose.Schema({
    short_term: {
        artists: [artistSchema],
        songs: [songSchema]
    },
    medium_term: {
        artists: [artistSchema],
        songs: [songSchema]
    },
    long_term: {
        artists: [artistSchema],
        songs: [songSchema]
    }
});

const loginSchema = new mongoose.Schema({
    timestamp: Date,
    data: timeRangeDataSchema
});

const userSchema = new mongoose.Schema({
    spotifyId: String,
    name: String,
    logins: [loginSchema]
});

if (mongoose.models.User) {
    User = mongoose.model('User');
} else {
    User = mongoose.model('User', userSchema);
}


const app = express();

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, './client/build')));

const generateRandomString = length => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const stateKey = 'spotify_auth_state';

app.get('/login', (req, res) => {
    const state = generateRandomString(16);
    res.cookie(stateKey, state);

    const scope = [
        'user-read-private',
        'user-read-email',
        'user-top-read',
        'user-read-recently-played',
        'user-follow-read',
        'user-follow-modify',
        'playlist-read-private',
        'playlist-read-collaborative',
        'playlist-modify-public',
        'user-library-read',
        'user-read-playback-position',
        'user-library-read'
    ].join(' ');

    const queryParams = querystring.stringify({
        client_id: CLIENT_ID,
        response_type: 'code',
        redirect_uri: REDIRECT_URI,
        state: state,
        scope: scope,
    });

    res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

const getUsersTopArtistsByRange = async (range, access_token) => {
    return axios.get(`https://api.spotify.com/v1/me/top/artists?time_range=${range}&limit=50`, {
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    });
};

const getUsersTopTracksByRange = async (range, access_token) => {
    return axios.get(`https://api.spotify.com/v1/me/top/tracks?time_range=${range}&limit=50`, {
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    });
};

app.get("/callback", async (req, res) => {
    const code = req.query.code || null;
    const timeRanges = ['short_term', 'medium_term', 'long_term'];

    try {
        const response = await axios({
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

        if (response.status === 200) {
            const { access_token, refresh_token, expires_in } = response.data;

            // Fetch user's Spotify profile using the access token
            const userProfile = await axios.get('https://api.spotify.com/v1/me', {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });

            const spotifyId = userProfile.data.id;
            const name = userProfile.data.display_name;

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

            // Continue with your existing redirect logic
            const queryParams = querystring.stringify({
                access_token,
                refresh_token,
                expires_in
            });
            res.redirect(`${FRONTEND_URI}?${queryParams}`);
        } else {
            res.redirect(`/?${querystring.stringify({ error: 'invalid token' })}`);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});


app.get('/refresh_token', (req, res) => {
    const { refresh_token } = req.query;

    axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: querystring.stringify({
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        }),
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        },
    })
        .then(response => {
            const { access_token, expires_in } = response.data;
            res.send({
                access_token,
                expires_in
            });
        })
        .catch(error => {
            console.error("Error refreshing token: ", error.response.data);
            res.status(error.response.status).send(error.response.data);
        });
});

app.listen(PORT, () => {
    console.log(`Express app listening at http://localhost:${PORT}`);
});

export { app };