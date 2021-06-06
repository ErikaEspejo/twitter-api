const User = require("../users/model");

const isAdmin = async (userId) => {
  try {
    const userFound = await User.findOne({
      $and: [{ _id: userId }, { role: "admin" }],
    });

    if (userFound) {
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
};

// Find User By Id
const findUserById = async (userId) => {
  const userFound = await User.findOne({ _id: userId })
    .then((user) => user)
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
    });

  return userFound;
};

module.exports = { isAdmin, findUserById };
