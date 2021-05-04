const express = require('express');
const {
  list,
  create,
  update,
  remove,
  login,
} = require('./controller');
const { validateUser, validateLogin } = require('../middleware/validator');
const { authenticator } = require('../middleware/authenticator');
const { usersRemoveAuth, usersUpdateAuth } = require('../middleware/authorization');
const { logger } = require('../middleware/logger');

const router = express.Router();

router.use(logger);

router
  .route('/')//
  .get(authenticator, list)// list
  .delete(authenticator, usersRemoveAuth, remove) // delete
  .post(validateUser, create);// create

router
  .route('/login')//
  .post(validateLogin, login); // login

router
  .route('/:id') //
  .put(authenticator, usersUpdateAuth, update); // update

module.exports = router;
