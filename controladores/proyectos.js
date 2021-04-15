const Proyecto = require("../db/modelos/proyecto");

const getProyectos = async estado => {
  const proyectos = await Proyecto.find();
  return proyectos;
};

const getProyectosPendientes = async () => {
  const proyectosPendientes = await Proyecto.find({ estado: "pendiente" },).select("-_id -__v");
  return proyectosPendientes;
};

const getProyectosEnProgreso = async () => {
  const proyectosPendientes = await Proyecto.find({ estado: "wip" },).select("-_id -__v");
  return proyectosPendientes;
};

const getProyectosFinalizados = async () => {
  const proyectosPendientes = await Proyecto.find({ estado: "finalizado" },).select("-_id -__v");
  return proyectosPendientes;
};

const getProyecto = async id => {
  const proyecto = await Proyecto.findById(id);
};

module.exports = {
  getProyectos,
  getProyectosPendientes,
  getProyectosEnProgreso,
  getProyectosFinalizados,
  getProyecto
};
