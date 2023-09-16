import express from 'express';
import querystring from 'querystring';
import axios from 'axios';
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, FRONTEND_URI, IS_PRODUCTION } from './config.js';
import { generateRandomString, handleTokenExchange, fetchUserProfile, fetchUserTopData, updateOrCreateUser } from './utils.js';

const router = express.Router();

const stateKey = 'spotify_auth_state';

router.get('/api/login', (req, res) => {
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

router.get("/api/callback", async (req, res) => {
    const code = req.query.code || null;

    try {
        const tokenResponse = await handleTokenExchange(code);
        if (tokenResponse.status === 200) {
            const { access_token, refresh_token, expires_in } = tokenResponse.data;
            const userProfile = await fetchUserProfile(access_token);
            const spotifyId = userProfile.data.id;
            const name = userProfile.data.display_name;
            const currentLoginData = await fetchUserTopData(access_token);
            await updateOrCreateUser(spotifyId, name, currentLoginData);

            res.cookie('access_token', access_token, { httpOnly: true, secure: IS_PRODUCTION, maxAge: expires_in * 1000 });
            res.cookie('refresh_token', refresh_token, { httpOnly: true, secure: IS_PRODUCTION });
            res.redirect(FRONTEND_URI);
        } else {
            res.redirect(`/?${querystring.stringify({ error: 'invalid token' })}`);
        }
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
});

router.get('/api/refresh_token', (req, res) => {
    const refresh_token = req.cookies.refresh_token;
    if (!refresh_token) {
        return res.status(400).send({ error: 'Refresh token not found' });
    }

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
            res.cookie('access_token', access_token, { httpOnly: true, secure: IS_PRODUCTION, maxAge: expires_in * 1000 });
            res.send({ success: true });
        })
        .catch(error => {
            res.status(error.response.status).send(error.response.data);
        });
});

router.get('/api/checkToken', (req, res) => {
    if (req.cookies.access_token) {
        res.json({ tokenExists: true });
    } else {
        res.json({ tokenExists: false });
    }
});

router.get('/api/logout', (req, res) => {
    // Clear the cookies
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    
    res.redirect('/');
});


export default router;
