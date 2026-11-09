//llamar un router de express
const express = require('express');

//llamar al controlador
const control = require('../controllers/producto.controller.js');

//Rutas
const routesProductos = express.Router();

routesProductos.get('/', control.listarProductos);
routesProductos.get('/:id', control.obtenerProductoPorId);
routesProductos.post('/', control.crearProducto);
routesProductos.put('/:id', control.actualizarProducto);
routesProductos.delete('/:id', control.eliminarProducto);


module.exports = routesProductos;