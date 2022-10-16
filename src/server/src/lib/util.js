require('dotenv').config();

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

module.exports = {
  convert_ms_to_minute,
  does_string_contain_word_from_array,
};
