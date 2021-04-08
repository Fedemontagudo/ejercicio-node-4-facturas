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
  verificaVencimiento
} = require("../controladores/facturas");

const getFacturaSchema = type => {
  const numero = {
    isLength: {
      errorMessage: "El número tiene que tener 4 carácteres como mínimo",
      options: {
        min: 4
      }
    }
  };
  const fecha = {
    errorMessage: "Es necesario pasar una fecha",
    notEmpty: true
  };
  const base = {
    isFloat: {
      errorMessage: "Base no válida, el mínimo tiene que ser",
      options: {
        min: 0,
      }
    }
  };
  const tipoIva = {
    isInt: {
      errorMessage: "El tipo de IVA debe ser positivo",
      notEmpty: true
    }
  };
  const tipo = {
    isLength: {
      errorMessage: "El tipo ingresado no es válido",
      notEmpty: true
    }
  };
  switch (type) {
    case "completo":
      numero.exists = {
        errorMessage: "Falta el numero de la factura",
      };
      fecha.exists = true;
      base.exists = {
        errorMessage: "Falta la base de la factura"
      };
      tipoIva.exists = true;
      tipo.exists = true;
      break;
    case "parcial":
    default:
      numero.optional = true;
      fecha.optional = true;
      base.optional = true;
      tipoIva.optional = true;
      tipo.optional = true;
      break;
  }
};

const getFacturaCompleta = getFacturaSchema("completo");
const getFacturaParcial = getFacturaSchema("parcial");

router.get("/", (req, res, next) => {
  let listaFacturas = getFacturas();
  if (req.query.abonadas === "true") {
    listaFacturas = listaFacturas.filter(factura => factura.datos.abonada === true);
  } else if (req.query.abonadas === "false") {
    listaFacturas = listaFacturas.filter(factura => factura.datos.abonada === false);
  }
  if (req.query.vencidas === "true") {
    listaFacturas = listaFacturas.filter(factura => verificaVencimiento(factura.datos.vencimiento) === true);
  } else if (req.query.vencidas === "true") {
    listaFacturas = listaFacturas.filter(factura => verificaVencimiento(factura.datos.vencimiento) === false);
  }
  if (req.query.ordenPor === "fecha") {
    if (req.query.orden === "desc") {
      listaFacturas = listaFacturas.sort((a, b) => DateTime.fromMillis(+b.datos.fecha) - DateTime.fromMillis(+a.datos.fecha));
    } else { listaFacturas = listaFacturas.sort((a, b) => DateTime.fromMillis(+a.datos.fecha) - DateTime.fromMillis(+b.datos.fecha)); }
  } else if (req.query.ordenPor === "base") {
    if (req.query.orden === "desc") {
      listaFacturas = listaFacturas.sort((a, b) => +b.datos.base - +a.datos.base);
    } else { listaFacturas = listaFacturas.sort((a, b) => +a.datos.base - +b.datos.base); }
  }
  res.json(listaFacturas);
});

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

module.exports = router;
