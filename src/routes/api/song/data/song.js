const logger = require('../../../../logger');
const { save_song, sort_songs, set_unix_time_stamp, get_songs } = require('./storage');
const { convert_ms_to_minute, does_string_contain_word_from_array } = require('../lib/util');
const { get_artist, get_track_audio_features, get_total_songs } = require('../data/spotify');

class Song {
  constructor(id, name, link, artists, duration_ms, playlist_name, playlist_link, popularity) {
    if (
      !(
        (id &&
          name &&
          link &&
          artists &&
          duration_ms &&
          playlist_name &&
          playlist_link &&
          popularity) ||
        popularity === 0
      )
    ) {
      logger.debug({
        id,
        name,
        link,
        artists,
        duration_ms,
        playlist_name,
        playlist_link,
        popularity,
      });
      throw new Error("Missing data for Song's constructor");
    }
    this.id = id;
    this.name = name;
    this.link = link;
    // artists will not be saved in redis, instead is artists' names concatenation
    this.artists = artists;
    this.duration = convert_ms_to_minute(duration_ms);
    this.playlist_name = playlist_name;
    this.playlist_link = playlist_link;
    this.popularity = popularity;
  }

  async save() {
    try {
      const { artists, ...altered_song } = this;
      altered_song.artists = artists
        .map((artist) => artist.name.trim())
        .join(', ')
        .slice(0, -2);
      await save_song(altered_song);
    } catch (err) {
      logger.error(err);
    }
  }

  static create_from_object(song_obj) {
    const { id, name, link, artists, duration_ms, playlist_name, playlist_link, popularity } =
      song_obj;
    return new Song(id, name, link, artists, duration_ms, playlist_name, playlist_link, popularity);
  }

  static async analyze(songs) {
    const name_keywords = ['hardstyle', 'dance', 'hardcore'];
    const genres = ['hardstyle', 'edm', 'dance', 'techno', 'work-out'];
    const min_energy_level = 0.5;
    const analyzed_songs = [];
    for (const song of songs) {
      logger.info(`Analyzing song | "${song.id}" | "${song.name}"`);

      // Checking if the song's name has 'hardstyle', 'dance', 'hardcore'
      // if yes add to analyze songs
      const contains_name_keyword = does_string_contain_word_from_array(song.name, name_keywords);
      let added_to_analyzed_songs = false;
      let contains_genre = false;
      if (!added_to_analyzed_songs && contains_name_keyword) {
        analyzed_songs.push(song);
        added_to_analyzed_songs = true;
        logger.info(
          `Added song | "${song.id}" | "${song.name}" as whose name contains hardstyle relevant word`
        );
      }

      // if not added to analyzed songs => keep going
      else if (!added_to_analyzed_songs) {
        const fetched_genres = [];
        for (const artist of song.artists) {
          const artist_data = await get_artist(artist.id);
          if (artist_data.genres.length > 0) {
            fetched_genres.push(...artist_data.genres);
            contains_genre = does_string_contain_word_from_array(
              artist_data.genres.join(''),
              genres
            );
          }
          if (contains_genre) {
            analyzed_songs.push(song);
            added_to_analyzed_songs = true;
            logger.info(
              `Added song | "${song.id}" | "${song.name}" as whose artist(s) is harstyle relevant`
            );
            break;
          }
        }
        if (!contains_genre && fetched_genres.length == 0) {
          const audio_features = await get_track_audio_features(song.id);
          if (audio_features.energy > min_energy_level) {
            analyzed_songs.push(song);
            added_to_analyzed_songs = true;
            logger.info(`Added song | "${song.id}" | "${song.name}" as whose energy is above 0.5`);
          }
        } else if (!added_to_analyzed_songs) {
          logger.warn(
            `Skipping song | "${song.id}" | "${song.name}", because not sure it is hardstyle/good work out song`
          );
        }
      }
    }
    return analyzed_songs;
  }

  static async analyze_songs(playlist) {
    try {
      const songs = [];
      for (const item of playlist.tracks.items) {
        const { track } = item;
        const song_obj = {
          id: track.id,
          name: track.name,
          link: track.external_urls.spotify,
          artists: track.artists,
          duration_ms: track.duration_ms,
          playlist_name: playlist.name,
          playlist_link: playlist.external_urls.spotify,
          popularity: track.popularity,
        };
        songs.push(Song.create_from_object(song_obj));
      }
      const analyzed_songs = await this.analyze(songs);
      await this.save_songs(analyzed_songs);
    } catch (err) {
      logger.error(err);
    }
  }

  static async save_songs(analyzed_songs) {
    try {
      const all_songs_save = analyzed_songs.map((analyzed_song) => analyzed_song.save());
      set_unix_time_stamp();
      await Promise.all(all_songs_save);
      await sort_songs();
      const saved_songs = await get_songs();
      logger.info(
        `Finish analyzing and adding ${saved_songs.length}/${get_total_songs()} songs to redis`
      );
    } catch (err) {
      logger.error(err);
    }
  }
}

module.exports = Song;
