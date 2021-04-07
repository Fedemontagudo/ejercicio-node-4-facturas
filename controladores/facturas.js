const facturasJSON = require("../facturas.json").facturas;

const getFacturas = () => ({
  total: facturasJSON.length,
  datos: facturasJSON
});

const getIngresos = () => ({
  total: facturasJSON.filter(factura => factura.tipo === "ingreso").length,
  datos: facturasJSON.filter(factura => factura.tipo === "ingreso")
});

const getGastos = () => ({
  total: facturasJSON.filter(factura => factura.tipo === "gasto").length,
  datos: facturasJSON.filter(factura => factura.tipo === "gasto")
});

module.exports = {
  getFacturas,
  getIngresos,
  getGastos
};
