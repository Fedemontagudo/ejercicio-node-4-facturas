const express = require("express");
const debug = require("debug")("facturas:rutas");
const { checkSchema, check, validationResult } = require("express-validator");
const { DateTime } = require("luxon");

const router = express.Router();

const {
  getFacturas,
  getIngresos,
  getGastos,
  getFactura,
  crearFactura,
  sustituyeFactura,
  verificaVencimiento
} = require("../controladores/facturas");

const getFacturaSchema = () => {
  const numero = {
    errorMessage: "Debes poner un número",
    notEmpty: true
  };
  const fecha = {
    errorMessage: "Falta La fecha de la factura",
    notEmpty: true
  };
  const vencimiento = {
    errorMessage: "Debes poner una fecha de vencimiento en formato Timestamp",
  };
  const concepto = {
    errorMessage: "Falta el concepto de la factura",
  };
  const base = {
    isFloat: {
      errorMessage: "La base imponible debe ser mayor a 0",
      notEmpty: true,
      options: {
        min: 0
      },
    }
  };
  const tipoIva = {
    isInteger: {
      errorMessage: "El tipo del iva tiene que ser un entero",
      notEmpty: true
    }
  };
  const tipo = {
    errorMessage: "Falta el tipo de la factura",
    notEmpty: true
  };
  const abonada = {
    errorMessage: "Se debe de poner si la factura está abonada o no",
    notEmpty: true
  };
  return {
    numero,
    fecha,
    vencimiento,
    concepto,
    base,
    tipoIva,
    tipo,
    abonada
  };
};

router.get("/", (req, res, next) => {
  const listaFacturas = getFacturas();
  res.json(listaFacturas);
});

router.get("/ingresos", (req, res, next) => {
  const ingresos = getIngresos();
  res.json(ingresos);
});

router.get("/gastos", (req, res, next) => {
  const gastos = getGastos();
  res.json(gastos);
});

router.get("/factura/:idFactura", (req, res, next) => {
  const idFactura = +req.params.idFactura;
  const { factura, error } = getFactura(idFactura);
  if (error) {
    next(error);
  } else {
    res.json(factura);
  }
});

router.post("/factura", (req, res, next) => {
  const nuevaFactura = req.body;
  const { factura, error } = crearFactura(nuevaFactura);
  if (error) {
    next(error);
  } else {
    res.json(factura);
  }
});

router.put("/factura/:idFactura", (req, res, next) => {
  const id = +req.params.id;
  const facturaModificada = req.body;
  const { error, factura } = sustituyeFactura(id, facturaModificada);
  if (error) {
    next(error);
  } else {
    res.json(factura);
  }
});

module.exports = router;
