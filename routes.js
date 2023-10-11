var SpotifyWebApi = require('spotify-web-api-node');

// spotifyApi.getMe().then(
//   function (data) {
//     return 'Some information about the authenticated user', data.body;
//   },
//   function (err) {
//     return 'Something went wrong!', err;
//   }
// );

async function getAuthenticatedUserData(spotifyApi) {
  try {
    const data = await spotifyApi.getMe();
    console.log('Data of User Fetched');
    return data.body;
  } catch (err) {
    console.log("Data of User couldn't be fetched!");
    return err;
  }
}

// async function getUsersPlaylists(spotifyApi, userName) {
//   try {
//     const data = await spotifyApi.getUserPlaylists(userName);
//     console.log('User Playlists Fetched');
//     return data.body;
//   } catch (err) {
//     console.log("User Playlists couldn't be fetched!");
//     throw err;
//   }
// }

async function getUsersPlaylists(token) {
  try {
    const headers = { Authorization: `Bearer ${token}` };
    const res = await fetch('https://api.spotify.com/v1/me/playlists', {
      headers,
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log("User Playlists couldn't be fetched!");
    throw err;
  }
}

async function getSavedTracks(spotifyApi) {
  try {
    const data = await spotifyApi.getMySavedTracks();
    const result = data.body;
    console.log('User Saved Tracks Fetched');
    return result;
  } catch (err) {
    console.log("User's saved tracks couldn't be fetched!");
    throw err;
  }
}

module.exports = {
  getAuthenticatedUserData,
  getUsersPlaylists,
  getSavedTracks,
};
