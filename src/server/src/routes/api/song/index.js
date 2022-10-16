const { Router } = require('express');
const { get } = require('./get');
const router = Router();

router.post('/', get);

// Other routes will go here later on...

module.exports = router;
