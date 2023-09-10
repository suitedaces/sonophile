import dotenv from 'dotenv';
import express from 'express';
import querystring from 'querystring';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const FRONTEND_URI = process.env.FRONTEND_URI;
const PORT = process.env.PORT || 8888;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, './client/build')));

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
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


app.get("/callback", (req, res) => {
    // This happens after the login route is successful, we get the authorization code first using the req.query.code and exchange it for an access token.
    const code = req.query.code || null;

    // Next is to setup a post req to the url endpoint for converting the code to an access token
    // where we pass in the following params (querystring)
    axios({
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
    })
        .then(response => {
            if (response.status === 200) {
                // If successful, then data will be returned which includes, access and refresh token, token type, token expiry in 3600 seconds, and the scope
                const { access_token, refresh_token, expires_in } = response.data;

                // pass along the tokens as params
                const queryParams = querystring.stringify({
                    access_token,
                    refresh_token,
                    expires_in
                })

                // redirect to react app
                res.redirect(`${FRONTEND_URI}?${queryParams}`)
            } else {
                res.redirect(`/?${querystring.stringify({ error: 'invalid token' })}`);
            }
        })
        .catch(err => {
            res.send(err)
            console.log(err)
        })
})


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