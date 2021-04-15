const express = require("express");
const debug = require("debug")("proyectos:rutas");
const {
  getProyectos,
  getProyectosPendientes,
  getProyectosEnProgreso,
  getProyectosFinalizados,
  getProyecto
} = require("../controladores/proyectos");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const queryParams = req.query;
  const proyectosDevueltos = await getProyectos(queryParams);
  res.json(proyectosDevueltos);
});

router.get("/pendientes", async (req, res, next) => {
  const queryParams = req.query;
  const proyectosDevueltos = await getProyectosPendientes();
  res.json(proyectosDevueltos);
});

router.get("/en-progreso", async (req, res, next) => {
  const queryParams = req.query;
  const proyectosDevueltos = await getProyectosEnProgreso();
  res.json(proyectosDevueltos);
});

router.get("/finalizados", async (req, res, next) => {
  const queryParams = req.query;
  const proyectosDevueltos = await getProyectosFinalizados();
  res.json(proyectosDevueltos);
});

router.get("/proyecto/:idProyecto", async (req, res, next) => {
  const id = req.params.idProyecto;
  const proyecto = await getProyecto(id);
});

module.exports = router;
