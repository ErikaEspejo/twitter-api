const express = require('express');
const { list, create } = require('./controller');
const { logger } = require('./../middleware/logger');
const { validateTweet } = require('./../middleware/validator');
const { authenticator } = require('./../middleware/authenticator');

const router = express.Router();

router.use(logger);

router.route('/')
  .get(list)
  .post(authenticator, validateTweet, create);

module.exports = router;