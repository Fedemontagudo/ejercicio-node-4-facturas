const express = require("express");
const debug = require("debug")("facturas:rutas");

const router = express.Router();

const {
  getFacturas, getIngresos, getGastos, getFactura
} = require("../controladores/facturas");

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

module.exports = router;
