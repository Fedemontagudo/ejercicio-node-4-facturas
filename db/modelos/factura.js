const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Factura = sequelize.define("Factura", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  numero: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  fecha: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  vencimiento: DataTypes.STRING(15),
  concepto: DataTypes.TEXT,
  base: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  tipoIva: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tipo: {
    type: DataTypes.ENUM("ingreso", "gasto"),
    allowNull: false
  },
  abonada: {
    type: DataTypes.TINYINT(1),
    allowNull: false
  }
}, {
  tableName: "facturas",
  timestamps: false
});

module.exports = Factura;
