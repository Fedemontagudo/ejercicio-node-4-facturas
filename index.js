require("dotenv").config();
const debug = require("debug")("facturas:index");
const chalk = require("chalk");
const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
let options = require("./parametrosCLI");
const rutasFacturas = require("./rutas/facturas");
const rutasProyectos = require("./rutas/proyectos");

const {
  generaError, serverError, notFoundError, generalError
} = require("./utils/errores");

options = { datos: "mysql" };
require("./db/dbMongo");

console.log(options);

const app = express();

const puerto = options.puerto || process.env.PUERTO || 5000;

const server = app.listen(puerto, () => {
  debug(chalk.yellow.bold(`Servidor escuchando en el puerto http:// ${puerto}`));
});

server.on("error", err => serverError(err, puerto));

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/facturas", rutasFacturas);
app.use("/proyectos", rutasProyectos);
app.get("/", (req, res, next) => {
  res.redirect("/facturas");
});
app.use(notFoundError);
app.use(generalError);
