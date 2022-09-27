const logger = require('../../../../logger');
const fetch = require('node-fetch-commonjs');

let token = '';
const get_token = () => token;

let total_songs = 0;
const get_total_songs = () => total_songs;

const fetch_token = async () => {
  const url = 'https://accounts.spotify.com/api/token?grant_type=client_credentials';
  const basic_token = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic_token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const data = await res.json();
  token = data.access_token;
  return token;
};

const get_playlist = async (id) => {
  try {
    const url = `https://api.spotify.com/v1/playlists/${id}`;
    let res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${get_token()}`,
      },
    });
    const playlist_data = await res.json();
    if (playlist_data.error) {
      logger.error(`Playlist ${id}, ${playlist_data.error.message}`);
      return null;
    }
    total_songs = total_songs + playlist_data.tracks.items.length;
    return playlist_data;
  } catch (err) {
    logger.error(err);
  }
};

const get_artist = async (id) => {
  try {
    const url = `https://api.spotify.com/v1/artists/${id}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${get_token()}`,
      },
    });
    const artist = await res.json();
    return artist;
  } catch (err) {
    logger.error(err);
  }
};

const get_track_audio_features = async (id) => {
  try {
    const url = `https://api.spotify.com/v1/audio-features/${id}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${get_token()}`,
      },
    });
    const audio_features = await res.json();
    logger.debug(`Fetched audio_features of track ${id}`);
    return audio_features;
  } catch (err) {
    logger.error(err);
  }
};

module.exports = {
  fetch_token,
  get_token,
  get_artist,
  get_track_audio_features,
  get_playlist,

  get_total_songs,
};
