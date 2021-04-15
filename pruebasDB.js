const Factura = require("./db/modelos/factura");

Factura.findOne().then(coso => {
  console.log(coso.toJSON());
});
