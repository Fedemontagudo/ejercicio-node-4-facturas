const { DateTime } = require("luxon");
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

const crearFactura = nuevaFactura => {
  const respuesta = {
    factura: null,
    error: null
  };
  if (facturasJSON.find(factura => factura.id === nuevaFactura.id)) {
    const error = generaError("Ya existe la factura", 409);
    respuesta.error = error;
  }
  if (!respuesta.error) {
    nuevaFactura.id = facturasJSON[facturasJSON.length - 1].id + 1;
    facturasJSON.push(nuevaFactura);
    respuesta.factura = nuevaFactura;
  }
  return respuesta;
};

const verificaVencimiento = (vencimiento) => {
  const fechaHoy = DateTime.local();
  const fechaVencimiento = DateTime.fromMillis(+vencimiento);
  if (fechaVencimiento > fechaHoy) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  getFacturas,
  getIngresos,
  getGastos,
  getFactura,
  crearFactura,
  verificaVencimiento
};
