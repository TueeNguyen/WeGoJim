const express = require('express');

const router = express.Router();

/**
 * Expose all of our API routes on /v1/* to include an API version.
 */
const rank = require('./rank');
router.use(`/rank`, rank);

module.exports = router;
