const express = require('express');
const morgan = require('morgan'); //log predeterminado
const fs = require('fs'); //se usa con morgan para crear logs en archivos
const path = require('path'); //se usa con morgan para crear logs en archivos
const helmet = require('helmet');
const { localization } = require('./middleware/localization');

const users = require('./users/router');
const tweets = require('./tweets/router');
const weather = require('./weather/router');

const { config } = require('../config'); //como se requiere el uso del archivo de config se llama

const router = express.Router();
const accessLogDir = config.logs.access; //se crea la direccion donde se guarda el log en el archivo config, y directamente en las variables de entorno

const logStream = fs.createWriteStream(path.join(__dirname, accessLogDir), { flags: 'a' }); //crear logs en archivos

router.use(helmet);
router.use(morgan('combined', { stream: logStream }));
router.use(localization);

router.use('/users', users);
router.use('/tweets', tweets);
router.use('/weather', weather);
/*
router.get('/', (req, res) => {
  res.send('hello from api')
});
router.post('/', (req, res) => {
  res.send('hello from api')
});
*/

/*
router
1- router.use
2- router.get
3- router.route('/ruta').get
*/

//otra manera de hacerlo es para cada ruta establecer todos los metodos
/*router
  .route('/')
  .get((req, res) => {})
  .post((req, res) => {})
  .put((req, res) => {})
  .delete((req, res) => {});
*/

module.exports = router;