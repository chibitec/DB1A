//llamar a express
const express = require('express');

//llamar a las rutas de productos
const routesProductos = require('./routes/producto.routes.js');

//crear una instancia de express
const app = express();

//middleware
app.use(express.json());

//rutas
app.use('/productos', routesProductos);

//manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});

module.exports = app;