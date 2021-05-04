const User = require('../api/users/model');

const isAdmin = async (userId) => {
  const foundUser = await User.findOne({ _id: userId });
  try {
    if (foundUser) {
      const { role } = foundUser;
      if (role === 'admin') {
        return true;
      }
    }
    return false;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
};

module.exports = { isAdmin };
