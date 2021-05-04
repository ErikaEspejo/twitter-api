const express = require('express');
const api = require('../api');
const { config } = require('../config');

const { port, host } = config.http;

const app = express();
app.use(express.json());
app.use('/api', api); // Cuando vaya una peticion a la ruta api, utiliza el metodo api. El cual se encuentra en el index de la carpeta api.
// app.use('/api/v1',api)

const init = () => {
  app.listen(port, host, () => {
    /* eslint-disable no-console */
    console.log(`Servidor iniciado en ${host}:${port}...`);
    /* eslint-enable no-console */
  });
};

module.exports = { init };
