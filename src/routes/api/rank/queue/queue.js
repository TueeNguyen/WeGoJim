const Queue = require('bull');

const rank_song_queue = new Queue('songs ranking');

module.exports = rank_song_queue;
