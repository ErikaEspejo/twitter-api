const express = require('express');
const { list, create, getUser, update, login, remove } = require('./controller');
const { validateUser, validateLogin } = require('./../middleware/validator');
const { authenticator } = require('./../middleware/authenticator');
const { userAuthorization } = require('./../middleware/authorization');
const { logger } = require('./../middleware/logger');
const router = express.Router();

router.use(logger);

router
  .route('/')//
  .get(authenticator, list)//list
  .delete(authenticator, userAuthorization, remove) //delete
  .post(validateUser, create);//create

router
  .route('/login')//
  .post(validateLogin, login); //login

router
  .route('/:username') //
  .get(getUser) //
  .put(authenticator, userAuthorization, update); //update

module.exports = router;