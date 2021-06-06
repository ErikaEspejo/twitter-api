const express = require("express");
const cookieParser = require("cookie-parser");
const api = require("../api");
const { config } = require("../config");

const { port, host } = config.http;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api", api);
app.use(express.static("public"));

const init = () => {
  app.listen(port, host, () => {
    /* eslint-disable no-console */
    console.log(`Servidor iniciado en ${host}:${port}...`);
    /* eslint-enable no-console */
  });
};

module.exports = { init };
