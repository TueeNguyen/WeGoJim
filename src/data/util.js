const { default: fetch } = require('node-fetch-commonjs');
const logger = require('../logger');

let token = '';

let total_songs = 0;

/**
 *
 * @param {*} ms
 * @returns { { minutes: number, seconds: number } }
 */
const convert_ms_to_minute = (ms) => {
  const total_seconds = ms / 1000;

  const minutes = Math.floor(total_seconds / 60);
  const seconds = total_seconds % 60;

  return {
    minutes,
    seconds,
  };
};

const does_string_contain_word_from_array = (string, words) => {
  for (const word of words) {
    if (string.toLowerCase().includes(word)) {
      return true;
    }
  }
  return false;
};

const get_playlist = async (id) => {
  const url = `https://api.spotify.com/v1/playlists/${id}`;
  let res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${get_token()}`,
    },
  });
  const playlists_data = await res.json();
  total_songs = total_songs + playlists_data.tracks.items.length;
  return playlists_data;
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

const fetch_token = async () => {
  const url = 'https://accounts.spotify.com/api/token?grant_type=client_credentials';

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization:
        'Basic ZGQ0MDkxYjFiNTM0NGNlNDg3Mzg2NmZjNzZiYWFhM2U6ODc0ZWJmZWM4YTc1NDA3ZmJiMzA0OTBlMmM3OTdiNzE=',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const data = await res.json();
  token = data.access_token;
  return token;
};

const get_token = () => token;

const get_total_songs = () => total_songs;

module.exports = {
  fetch_token,
  get_token,
  convert_ms_to_minute,
  does_string_contain_word_from_array,
  get_artist,
  get_track_audio_features,
  get_playlist,
  get_total_songs,
};
