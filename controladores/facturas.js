const { DateTime } = require("luxon");
const chalk = require("chalk");
const { generaError, generalError } = require("../utils/errores");
const options = require("../parametrosCLI");
const facturasJSON = require("../facturas.json").facturas;
const Factura = require("../db/modelos/factura");

const getFacturas = async (reqQuery, tipo) => {
  let listaFacturas = facturasJSON;
  if (options.datos.toLowerCase() === "json") {
    console.log(chalk.yellow.bold("has elegido que los datos provengan del JSON"));
    if (tipo) {
      listaFacturas = facturasJSON.filter(factura => factura.tipo === tipo);
    } else {
      listaFacturas = facturasJSON;
    }
  } else if (options.datos.toLowerCase() === "mysql") {
    console.log(chalk.yellow.bold("has elegido que los datos provengan de la base de datos de MySql"));
    if (tipo) {
      listaFacturas = await Factura.findAll(
        {
          where: {
            tipo
          }
        }
      );
    } else {
      listaFacturas = Factura.findAll();
    }
  } else {
    return generalError("el parámetro de entrada tiene que ser 'json' o 'mysql'", 400);
  }
  if (reqQuery.abonadas === "true") {
    listaFacturas = listaFacturas.filter(factura => factura.abonada === true);
    console.log(chalk.red(listaFacturas));
  } else if (reqQuery.abonadas === "false") {
    listaFacturas = listaFacturas.filter(factura => factura.abonada === false);
  }
  if (reqQuery.vencidas === "true") {
    listaFacturas = listaFacturas.filter(factura => verificaVencimiento(factura.vencimiento) === true);
  } else if (reqQuery.vencidas === "true") {
    listaFacturas = listaFacturas.filter(factura => verificaVencimiento(factura.vencimiento) === false);
  }
  if (reqQuery.ordenPor === "fecha") {
    if (reqQuery.orden === "desc") {
      listaFacturas = listaFacturas.sort((a, b) => DateTime.fromMillis(+b.fecha) - DateTime.fromMillis(+a.fecha));
    } else { listaFacturas = listaFacturas.sort((a, b) => DateTime.fromMillis(+a.fecha) - DateTime.fromMillis(+b.fecha)); }
  } else if (reqQuery.ordenPor === "base") {
    if (reqQuery.orden === "desc") {
      listaFacturas = listaFacturas.sort((a, b) => +b.base - +a.base);
    } else { listaFacturas = listaFacturas.sort((a, b) => +a.base - +b.base); }
  }
  if (reqQuery.nPorPagina) {
    if (reqQuery.pagina) {
      listaFacturas = listaFacturas.slice(+reqQuery.pagina * +reqQuery.nPorPagina, (+reqQuery.pagina + 1) * +reqQuery.nPorPagina);
    } else {
      listaFacturas = listaFacturas.slice(0, +reqQuery.nPorPagina);
    }
  } return listaFacturas;
};

const getFactura = async id => {
  let factura;
  if (options.datos.toLowerCase() === "json") {
    factura = facturasJSON.find(factura => factura.id === id);
  } else if (options.datos.toLowerCase() === "mysql") {
    factura = await Factura.findByPk(id);
  }
  const respuesta = {
    factura: null,
    error: null
  };
  if (factura) {
    respuesta.factura = factura;
  } else {
    const error = generaError("La factura no existe", 404);
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

const sustituyeFactura = (id, facturaModificada) => {
  const factura = facturasJSON.find(factura => factura.id === id);
  console.log(factura);
  const respuesta = {
    factura: null,
    error: null
  };
  if (factura) {
    facturaModificada.id = factura.id;
    facturasJSON[facturasJSON.indexOf(factura)] = facturaModificada;
    respuesta.factura = facturaModificada;
  } else {
    const { error, factura } = crearFactura(facturaModificada);
    if (error) {
      respuesta.error = error;
    } else {
      respuesta.factura = factura;
    }
  }
  return respuesta;
};

const borraFactura = id => {
  const factura = facturasJSON.find(factura => factura.id === id);
  const respuesta = {
    factura: null,
    error: null
  };
  if (factura) {

  } else {
    const error = generaError("La factura solicitado no existe", 404);
    respuesta.error = error;
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
  getFactura,
  crearFactura,
  sustituyeFactura,
  borraFactura,
  verificaVencimiento
};
