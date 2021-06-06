const { verifyIfUserIsOwnsTweet } = require("../services/tweetService");
const { isUserAdmin } = require("../services/userService");
const { locale } = require("../../locale");

const usersAuthorization = async (req, res, next) => {
  const id = req.params.id || req.body.id;
  const { userId } = req.body;

  const isAdmin = await isUserAdmin(userId);

  if (userId === id || isAdmin) {
    next();
  } else {
    res
      .status(403)
      .json({ message: locale.translate("errors.operationNotAllowed") });
  }
};

const tweetsAuthorization = async (req, res, next) => {
  const { userId, tweetId } = req.body;
  const result = await verifyIfUserIsOwnsTweet(userId, tweetId);
  const isAdmin = await isUserAdmin(userId);

  if (result || isAdmin) {
    next();
  } else {
    res.status(403).json({
      message: locale.translate("errors.operationNotAllowed"),
    });
  }
};

module.exports = { usersAuthorization, tweetsAuthorization };
