const jwt = require('jsonwebtoken');
const { config } = require('../../config');
const { locale } = require('../../locale');

const authenticator = (req, res, next) => {
  const token = req.headers['x-access-token'];

  try {
    const decoded = jwt.verify(token, config.jwtKey);
    const { userId } = decoded;
    req.body.id = userId;

    next();
  } catch (err) {
    res
      .status(401)
      .json({ message: locale.translate('errors.notAuthenticated') });
  }
};

module.exports = { authenticator };
