const express = require("express");
const debug = require("debug")("facturas:rutas");
const { checkSchema, check, validationResult } = require("express-validator");
const { DateTime } = require("luxon");
const facturasJSON = require("..");

const router = express.Router();

const {
  getFacturas,
  getFactura,
  crearFactura,
  sustituyeFactura,
  borraFactura,
  verificaVencimiento
} = require("../controladores/facturas");

const baseFacturas = facturas => ({
  total: facturas.length,
  datos: facturas
});

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

router.get("/", async (req, res, next) => {
  const queryParams = req.query;
  const listaFacturas = await getFacturas(queryParams);
  res.json(baseFacturas(listaFacturas));
});

router.get("/ingresos", async (req, res, next) => {
  const queryParams = req.query;
  const listaFacturas = await getFacturas(queryParams, "ingreso");
  res.json(baseFacturas(listaFacturas));
});

router.get("/gastos", async (req, res, next) => {
  const queryParams = req.query;
  const listaFacturas = await getFacturas(queryParams, "gasto");
  res.json(baseFacturas(listaFacturas));
});

const compruebaId = id => facturasJSON.find(factura => factura.id === +id);

router.get("/factura/:idFactura", (req, res, next) => {
  const id = +req.params.idFactura;
  const { factura, error } = getFactura(id);
  if (error) {
    return next(error);
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

router.delete("/factura/:idFactura", (req, res, next) => {
  const idFactura = +req.params.idFactura;
  const { factura, error } = borraFactura(idFactura);
  if (error) {
    next(error);
  } else {
    res.json(factura);
  }
});

module.exports = router;
