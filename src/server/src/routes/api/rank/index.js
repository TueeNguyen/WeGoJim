const { Router } = require('express');
const { start_ranking } = require('./post');
const router = Router();

router.post('/', start_ranking);

// Other routes will go here later on...

module.exports = router;
