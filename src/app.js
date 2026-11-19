
const express = require('express');

// Importar las rutas
const routesProductos = require('./routes/producto.routes.js');
const routesCategorias = require('./routes/categoria.routes.js');
const routesPedidos = require('./routes/pedido.routes.js');
const routesAuth = require('./routes/auth.routes.js');

// Crear una instancia de Express
const app = express();

// Middleware
app.use(express.json());

// Registrar rutas
app.use('/productos', routesProductos);
app.use('/categorias', routesCategorias);
app.use('/pedidos', routesPedidos);
app.use('/auth', routesAuth);

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});

module.exports = app;
