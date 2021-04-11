const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  host: "localhost",
  database: "facturas",
  username: "fedemontagudo",
  password: "Fedemontagudo",
  dialect: "mysql"

});

sequelize
  .authenticate()
  .then(() => console.log("Conectado a BD"))
  .catch(err => {
    console.log(err);
    console.log("Ha ocurrido un error al conectar la BD ");
  });

module.exports = sequelize;
