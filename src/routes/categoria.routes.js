//llamar un router de express
const express = require('express');

//llamar al controlador
const control = require('../controllers/categoria.controller.js');

//Rutas
const routesCategorias = express.Router();

const verificarToken = require('../middleware/verificarToken.js');

routesCategorias.get('/', control.listarCategorias);
routesCategorias.get('/:id', control.obtenerCategoriaPorId);
routesCategorias.post('/', verificarToken, control.crearCategoria);
routesCategorias.put('/:id', verificarToken, control.actualizarCategoria);
routesCategorias.delete('/:id', verificarToken, control.eliminarCategoria);


module.exports = routesCategorias;