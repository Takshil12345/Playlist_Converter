const express = require('express');
const app = express();
var SpotifyWebApi = require('spotify-web-api-node');
const {
  getAuthenticatedUserData,
  getUsersPlaylists,
  getSavedTracks,
} = require('./routes');

var scopes = ['user-read-private', 'user-read-email', 'user-library-read'],
  redirectUri = 'http://localhost:3000/callback',
  clientId = '7b4f4a575d0741038c41c07f0e5ce137',
  state = 'TakshilRastogi12';

var spotifyApi = new SpotifyWebApi({
  redirectUri: redirectUri,
  clientId: clientId,
});

var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

app.get('/', (req, res) => {
  res.redirect(authorizeURL);
});

app.get('/callback', (req, res) => {
  const error = req.query.error;
  const code = req.query.code;
  const state = req.query.state;

  if (error) {
    console.error('Callback Error:', error);
    res.send(`Callback Error: ${error}`);
    return;
  }

  var credentials = {
    clientId: '7b4f4a575d0741038c41c07f0e5ce137',
    clientSecret: 'b6b503dbfb374261a9b57e491754de79',
    redirectUri: 'http://localhost:3000/callback',
  };

  var spotifyApi = new SpotifyWebApi(credentials);
  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      console.log('The token expires in ' + data.body['expires_in']);
      console.log('The access token is ' + data.body['access_token']);
      console.log('The refresh token is ' + data.body['refresh_token']);

      spotifyApi.setAccessToken(data.body['access_token']);
      spotifyApi.setRefreshToken(data.body['refresh_token']);

      console.log('Nigga work Done');

      getUserAndHandleErrors(spotifyApi)
        .then(() => {
          getTracks(spotifyApi);
        })
        .catch((err) => {
          console.log('Error Encountered: ' + err);
        });

      setInterval(async () => {
        spotifyApi
          .refreshAccessToken()
          .then((data) => {
            console.log('The access token has been refreshed!');

            spotifyApi.setAccessToken(data.body['access_token']);
          })
          .catch((err) => {
            console.log('Could not refresh access token', err);
          });
      }, (data.body['expires_in'] / 1.5) * 1000);
    })
    .catch((err) => {
      console.log('Something went wrong!', err);
    });
});

async function getUserAndHandleErrors(spotifyApi) {
  try {
    const result = await getAuthenticatedUserData(spotifyApi);
    console.log('User : ' + result.display_name);
  } catch (err) {
    throw err;
  }
}

async function getPlaylists(accessToken) {
  try {
    const playlists = await getUsersPlaylists(accessToken);
    console.log("Playlist's Data : " + JSON.stringify(playlists));
  } catch (err) {
    console.log('Error Encountered: ' + err);
  }
}

async function getTracks(spotifyApi) {
  try {
    const result = await getSavedTracks(spotifyApi);
    const jsondata = JSON.stringify(result);
    for (let i = 0; i < jsondata.total; i++) {
      console.log(jsondata.items[i].name);
    }
  } catch (err) {
    throw err;
  }
}

app.listen(3000, () => console.log('Server Started'));
