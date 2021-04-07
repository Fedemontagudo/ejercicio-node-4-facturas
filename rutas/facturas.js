const express = require("express");

const router = express.Router();

const { getFacturas, getIngresos, getGastos } = require("../controladores/facturas");

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

module.exports = router;
