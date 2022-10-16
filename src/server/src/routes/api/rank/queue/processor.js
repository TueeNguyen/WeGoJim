const Song = require('../../../../data/song');
const { fetch_token, get_playlist } = require('../../../../data/spotify');
const logger = require('../../../../logger');
const rank_song_queue = require('./queue');

//const playlists = ['09rSmfgujjE9uNev9tGGCJ', '766wQ733vRmpmKqIU5fyvR'];
const playlists = ['4mu7aeypRUeCUsJJWzzLad'];
const add_jobs = async () => {
  playlists.forEach(async (playlist) => {
    try {
      await rank_song_queue.add({ playlist_id: playlist });
    } catch (err) {
      logger.error(err);
    }
  });
  logger.info(`Finish adding ${playlists.length} jobs to queue`);
};

const processor = async (job) => {
  logger.info(`Start job for playlist "${job.data.playlist_id}"`);
  try {
    const playlist = await get_playlist(job.data.playlist_id);
    if (!playlist) {
      return Promise.reject(`Can't find playlist ${job.data.playlist_id}`);
    } else {
      await Song.analyze_songs(playlist);
    }
  } catch (err) {
    logger.error(`Error fetching playlist ${job.data.playlist_id}`);
    logger.error(err);
  }
};

const start_queue = async () => {
  try {
    await fetch_token();
    await add_jobs();
    rank_song_queue.process(processor);
  } catch (err) {
    logger.error(err);
  }
};

module.exports = { processor, add_jobs, start_queue };
