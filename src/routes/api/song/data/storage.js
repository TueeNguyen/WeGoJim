const logger = require('../../../../logger');
const redis = require('../lib/redis');

const song_prefix = 'song:';
const songs_prefix = 'songs:';

const create_song_key = (id) => song_prefix.concat(id);
const create_songs_key = (time) => songs_prefix.concat(time);

let unix_timestamp = 0;

const set_unix_time_stamp = () => (unix_timestamp = Date.now());

const save_song = async (song) => {
  try {
    const song_key = create_song_key(song.id);
    await redis.hset(song_key, song);

    const songs_key = create_songs_key(unix_timestamp);
    await redis.sadd(songs_key, song_key);

    logger.info(`Add hash ${song_key} | Add ${song_key} to set ${songs_key}`);
  } catch (err) {
    logger.error(err);
  }
};

const sort_songs = async () => {
  const songs_key = create_songs_key(unix_timestamp);
  try {
    await redis.sort(songs_key, 'BY', 'popularity');
    logger.info(`Sorted set "${songs_key}" by songs' popularity`);
  } catch (err) {
    logger.error(err);
  }
};

const get_songs = async () => {
  try {
    const songs_key = create_songs_key(unix_timestamp);
    const set = await redis.smembers(songs_key);
    return set;
  } catch (err) {
    logger.error(err);
  }
};

// const actions = async () => {
//   try {
//     const song_obj = {
//       name: 'tue',
//       duration: '3:46',
//       id: '123',
//       popularity: 10,
//       artists: [
//         {
//           name: 'tue',
//           really: '2',
//         },
//       ],
//     };
//     const song_key = create_song_key(song_obj.id);
//     await redis.hset(song_key, JSON.stringify(song_obj));

//     const song_obj2 = {
//       name: 'tue',
//       duration: '3:46',
//       id: '1223',
//       popularity: 12,
//       artists: [
//         {
//           name: 'tue2',
//           really: '21',
//         },
//       ],
//     };
//     const song_key2 = create_song_key(song_obj2.id);
//     await redis.hset(song_key2, JSON.stringify(song_obj2));

//     const hash = await redis.hgetall(song_key);
//     const hash2 = await redis.hgetall(song_key2);

//     const songs_key = create_songs_key(Date.now());
//     await redis.sadd(songs_key, [song_key, song_key2]);
//     const set = await redis.smembers(songs_key);

//     const sorted_set = await redis.sort(songs_key, 'BY', 'popularity');

//     console.log(hash);
//     console.log(songs_key);
//     console.log(sorted_set);
//   } catch (err) {
//     console.error(err);
//   }
// };

module.exports = { set_unix_time_stamp, sort_songs, save_song, get_songs };
