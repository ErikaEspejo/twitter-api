/* eslint-disable eqeqeq */
const { locale } = require('../../locale');
const { isAdmin } = require('../../services/userService');
const User = require('../users/model');

const usersRemoveAuth = async (req, res, next) => {
  const { userId, id } = req.body;

  try {
    const user = await User.findById(id);
    const isAdminValidation = await isAdmin(userId);
    if (user) {
      // eslint-disable-next-line no-underscore-dangle
      if (userId === user._id || isAdminValidation) {
        next();
      } else {
        res
          .status(401)
          .json({ message: locale.translate('errors.notAuthorized') });
      }
    }
    if (!user) {
      res
        .status(401)
        .json({ message: locale.translate('errors.user.userNotExists') });
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
};

const usersUpdateAuth = async (req, res, next) => {
  const idParam = req.params.id;
  const { userId } = req.body;
  const user = await User.findById(idParam);
  const isAdminValidation = await isAdmin(userId);
  if (user) {
    // eslint-disable-next-line no-underscore-dangle
    if (userId == user._id || isAdminValidation) {
      next();
    } else {
      res
        .status(401)
        .json({ message: locale.translate('errors.notAuthorized') });
    }
  }

  if (!user) {
    res
      .status(401)
      .json({ message: locale.translate('errors.user.userNotExists') });
  }
};

module.exports = { usersRemoveAuth, usersUpdateAuth };
