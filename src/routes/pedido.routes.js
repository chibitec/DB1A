
// Llamar un router de express
const express = require('express');

// Llamar al controlador
const control = require('../controllers/pedido.controller.js');

// Crear router
const routesPedidos = express.Router();

// Middleware de autenticación
const verificarToken = require('../middleware/verificarToken.js');

// Rutas protegidas
routesPedidos.post('/', verificarToken, control.crearPedido);
routesPedidos.get('/', verificarToken, control.listarPedidos);
routesPedidos.get('/:id', verificarToken, control.obtenerPedidoPorId);

module.exports = routesPedidos;
