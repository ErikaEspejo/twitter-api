const database = require('../database');
const User = require('../api/users/model');
const { users } = require('./data');

(async () => {
  await database.init();
  try {
    User.collection.drop();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }

  users.forEach(async (user) => {
    const password = Date.now().toString();
    // eslint-disable-next-line no-param-reassign
    user.password = password;

    // eslint-disable-next-line no-console
    console.log('user', user);
    const newUser = new User(user);
    try {
      await newUser.save();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log("couldn't create the user:", user);
    }
  });
})();
