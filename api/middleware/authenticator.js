const jwt = require("jsonwebtoken");
const { config } = require("../../config");
const { locale } = require("../../locale");

const authenticator = (req, res, next) => {
  // eslint-disable-next-line prefer-destructuring
  const token = req.cookies.token || req.headers.authorization;

  try {
    const decoded = jwt.verify(token, config.jwtKey);
    const { userId } = decoded;
    req.body.userId = userId;

    next();
  } catch (err) {
    res
      .status(401)
      .json({ message: locale.translate("errors.notAuthenticated") });
  }
};

module.exports = { authenticator };
