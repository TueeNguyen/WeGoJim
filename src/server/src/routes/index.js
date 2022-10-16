const express = require('express');

const router = express.Router();

/**
 * Expose all of our API routes on /v1/* to include an API version.
 */
const api = require('./api');
router.use(`/api/v1`, api);

// Define a simple health check route. If the server is running
// we'll respond with a 200 OK.  If not, the server isn't healthy.
router.get('/', (req, res) => {
  // Clients shouldn't cache this response (always request it fresh)
  // See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching#controlling_caching
  res.setHeader('Cache-control', 'no-cache');

  res.status(200).json({
    status: 'ok',
  });
});

module.exports = router;
