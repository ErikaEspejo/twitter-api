const express = require('express');
const {
  list, create, createComment, likes,
} = require('./controller');
const { logger } = require('../middleware/logger');
const { validateTweet, validateComment } = require('../middleware/validator');
const { authenticator } = require('../middleware/authenticator');

const router = express.Router();

router.use(logger);

router.route('/')
  .get(list)
  .post(authenticator, validateTweet, create);

router.route('/comments')
  .post(authenticator, validateComment, createComment);

router.route('/likes')
  .post(authenticator, likes);

module.exports = router;
