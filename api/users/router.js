const express = require('express');
const {
  list,
  create,
  update,
  remove,
  login,
  logout,
} = require('./controller');
const { validateUser, validateLogin } = require('../middleware/validator');
const { authenticator } = require('../middleware/authenticator');
const { usersRemoveAuth, usersUpdateAuth } = require('../middleware/authorization');
const { logger } = require('../middleware/logger');

const router = express.Router();

router.use(logger);

router
  .route('/')
  .get(list)
  .delete(authenticator, usersRemoveAuth, remove)
  .post(validateUser, create);

router
  .route('/login')
  .post(validateLogin, login);

router
  .route('/logout')
  .get(logout);

router
  .route('/:id') //
  .put(authenticator, usersUpdateAuth, update); // update

module.exports = router;
