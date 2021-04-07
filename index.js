require("dotenv").config();
const debug = require("debug")("facturas:root");
const chalk = require("chalk");
const express = require("express");
const options = require("./parametrosCLI");

const app = express();

const puerto = options.puerto || process.env.PUERTO || 5000;

const server = app.listen(puerto, () => {
  debug(chalk.yellow.bold(`Servidor escuchando en el puerto http:// ${puerto}`));
});

server.on("error", err => {
  debug(chalk.red.bold("Ha ocurrido un error en el servidor"));
  if (err.code === "EADDRINUSE") {
    debug(chalk.red.bold(`El puerto ${puerto} esta ocupado`));
  }
});
