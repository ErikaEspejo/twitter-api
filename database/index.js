const mongoose = require('mongoose');
const { config } = require('../config');

const init = async () => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  };
  try {
    await mongoose.connect(config.database.connectionString, options, () => {
      /* eslint-disable no-console */
      console.log('connected to database');
      /* eslint-enable no-console */
    });
  } catch (err) {
    // eslint-disable-next-line no-unused-expressions
    `Error connecting to database ->
    Error code: ${err.code}, error reference: ${err.codeName}, message: ${err.message}`;
  }
};

module.exports = { init };
