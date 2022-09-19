const url = 'https://accounts.spotify.com/api/token';
const fetch = require('node-fetch-commonjs');
const logger = require('../logger');

let token = '';

async function fetch_new_token() {
  try {
    token = await fetch(url, {
      headers: {
        Authorization: `Basic ${(process.env.CLIENT_ID + ':' + process.env.SECRET).toString(
          'base64'
        )}`,
      },
      form: {
        grant_type: 'client_credentials',
      },
      json: true,
    });
    return token;
  } catch {
    logger.error("Can't fetch new token");
  }
}

function get_token() {
  return token;
}

module.exports = { fetch_new_token, get_token };
