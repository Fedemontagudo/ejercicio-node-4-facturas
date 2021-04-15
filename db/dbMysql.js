const chalk = require("chalk");
const { Sequelize } = require("sequelize");
const debug = require("debug")("facturas:dbMysql");

const sequelize = new Sequelize({
  host: "localhost",
  database: "facturas",
  username: "fedemontagudo",
  password: "Fedemontagudo",
  dialect: "mysql"

});
debug(chalk.green("Iniciando MySql"));

module.exports = sequelize;
