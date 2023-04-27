const express = require('express');
require('dotenv').config()
const SpotifyWebApi = require('spotify-web-api-node');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken;
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken,
    })

    spotifyApi.refreshAccessToken().then(
        (data) => {
            // console.log(data.body)
            res.json({
                accessToken: data.body.access_token,
                expiresIn: data.body.expires_in,
            })
        })
        .catch(err => {
            console.log("server.js")
            console.log(err)
            res.sendStatus(400)
        }
    )
})

app.post('/login', (req, res) => {
    const code = req.body.code; // extract code payload from HTTP POST request
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
    })

    spotifyApi.authorizationCodeGrant(code).then(data => {
        // console.log(data.body)
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        })
    })
    .catch(() => {
        res.status(400).send('Something went wrong :(')
    })
})



app.listen(3001)

/* 
Explanation:

app.post('/login', (req, res) => {}) creates an API endpoint at /login that handles HTTP POST requests. The second parameter is a callback function that handles the response that handles the request and response objs. 



*/