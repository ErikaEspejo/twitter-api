const dotenv = require('dotenv');

dotenv.config();

const config = {
  http: {
    host: process.env.HTTP_HOST || '0.0.0.0',
    port: process.env.PORT || process.env.HTTP_PORT,
  },
  logs: {
    access: `../logs/${process.env.LOG_ACCESS}`,
  },
  jwtKey: process.env.JWTKEY,
  apiWeatherKey: process.env.APIWEATHERKEY,
  database: {
    connectionString: process.env.DB_CONNECTION_STRING,
  },
  saltRounds: process.env.parseInt(process.env.SALT_ROUNDS, 10),
};

module.exports = { config };
