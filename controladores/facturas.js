const { generaError } = require("../utils/errores");
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

const getFactura = id => {
  const factura = facturasJSON.find(factura => factura.id === id);
  const respuesta = {
    factura: null,
    error: null
  };
  if (factura) {
    respuesta.factura = factura;
  } else {
    const error = generaError("La factura solicitada no existe", 404);
    respuesta.error = error;
  }
  return respuesta;
};

module.exports = {
  getFacturas,
  getIngresos,
  getGastos,
  getFactura
};
