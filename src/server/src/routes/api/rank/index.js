const { Router } = require('express');
const { start_ranking } = require('./post');
const { authenticate } = require('../../../authorization/basic-auth.js');
const router = Router();

router.post('/', authenticate(), start_ranking);

// Other routes will go here later on...

module.exports = router;
