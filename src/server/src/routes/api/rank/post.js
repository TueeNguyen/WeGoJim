const { findSuperUser } = require('../../../lib/mongo-db');
const logger = require('../../../logger');
const { createSuccessResponse, createErrorResponse } = require('../../../response');
const { start_queue } = require('./queue/processor');
const rank_song_queue = require('./queue/queue');

const start_ranking = async (req, res) => {
  try {
    logger.info('Req');
    logger.info(req.user);
    res
      .status(200)
      .json(createSuccessResponse({ message: "Finish fetching and ranking all playlists' songs" }));
    // await start_queue();
    // rank_song_queue
    //   .on('drained', () => {
    //     res
    //       .status(200)
    //       .json(
    //         createSuccessResponse({ message: "Finish fetching and ranking all playlists' songs" })
    //       );
    //   })
    //   .on('error', (err) => {
    //     logger.debug({ err });
    //     res.status(500).json(createErrorResponse(500, err));
    //   });
  } catch (err) {
    logger.error({ err }, 'Error when starting job queue');
    res.status(500).json(createErrorResponse(500, err));
  }
};
module.exports = { start_ranking };
