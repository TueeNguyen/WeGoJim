const Queue = require('bull');

const rank_song_queue = new Queue('songs ranking', { redis: { port: 6379, host: 'redis' } });

module.exports = rank_song_queue;
