const express = require('express');
const api = require('./../api');
const { config } = require('./../config');
const { port } = config.http;

const app = express();
app.use(express.json());
app.use('/api', api); //Cuando vaya una peticion a la ruta api, utiliza el metodo api. El cual se encuentra en el index de la carpeta api.
//app.use('/api/v1',api)

const init = () => {
  app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto ${port}...`);
  });
};

module.exports = { init };