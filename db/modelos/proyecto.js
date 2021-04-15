const { Schema, model } = require("mongoose");

const ProyectoSchema = new Schema({
  nombre: {
    type: String,
    required: true
  },
  estado: String,
  aprobado: String,
  tecnologias: [String]
});

const Proyecto = model("Proyecto", ProyectoSchema, "proyectos");

module.exports = Proyecto;
