//llamar a express
const express = require('express');

//llamar a las rutas de productos
const routesProductos = require('./routes/producto.routes.js');

//llamar a las rutas de categorias
const routesCategorias = require('./routes/categoria.routes.js');


//crear una instancia de express
const app = express();

//middleware
app.use(express.json());

//rutas
app.use('/productos', routesProductos);

//rutas
app.use('/categorias', routesCategorias);

//manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});

// arriba, junto a las otras rutas
const routesAuth = require('./routes/auth.routes.js');

// debajo de app.use('/categorias', ...) y ANTES del 404
app.use('/auth', routesAuth);
//prueba de cambios en git
module.exports = app;