const stoppable = require('stoppable');
const logger = require('./logger');
const app = require('./app');
const { createDefaultSuperUser } = require('./lib/mongo-db');
const port = parseInt(process.env.PORT || 8080, 10);

const server = stoppable(
  app.listen(port, async () => {
    // Log a message that the server has started, and which port it's using.
    try {
      await createDefaultSuperUser();
      logger.info('Created default super users');
    } catch (err) {
      logger.error(err);
    }

    logger.info({ port }, `Server started`);
  })
);

module.exports = server;
