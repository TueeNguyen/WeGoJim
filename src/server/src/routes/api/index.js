const express = require('express');
const { authenticate } = require('../../authorization/basic-auth.js');
const router = express.Router();

/**
 * Expose all of our API routes on /v1/* to include an API version.
 */
const rank = require('./rank');
router.use(`/rank`, authenticate(), rank);

module.exports = router;
