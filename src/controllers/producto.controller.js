// Llamar al modelo de Producto
const Producto = require('../models/model.producto.js');
const categoria = require('../models/model.categoria.js');
 
//Validacion de datos
const datosValidados = d => d.nombre && Number(d.precio) > 0
    && Number(d.stock) >= 0 && idValid(d.categoria_id);
// Validacion de id
const idValid = id => Number(id) > 0;
 
async function listarProductos(req, res) {
res.json(await Producto.listarProductos());
}
 
async function obtenerProductoPorId(req, res) {
    const id = req.params.id;
    if (!idValid(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }
    res.json(await Producto.obtenerProductoPorId(id));
}
 
async function crearProducto(req, res) {
    const { nombre, precio, stock, categoria_id } = req.body ?? {};
    if (!datosValidados({ nombre, precio, stock, categoria_id })) {
        return res.status(400).json({ error: 'Datos inválidos' });
    }
    // ¿Existe la categoria? Se pregunta antes de guardar
    const categoria = await Categoria.obtenerCategoriaPorId(categoria_id);
    if (!categoria) {
        return res.status(400).json({ error: 'La categoría no existe' });
    }
    const nuevo = await Producto.crearProducto(
        nombre, precio, stock, categoria_id);
    res.status(201).json(nuevo);
}

async function actualizarProducto(req, res) {
    const id = Number(req.params.id);
    const { nombre, precio, stock, categoria_id } = req.body ?? {};
    if (!idValid(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }
    if (!datosValidados({ nombre, precio, stock, categoria_id })) {
        return res.status(400).json({ error: 'Datos inválidos' });
    }
    const categoria = await Categoria.obtenerCategoriaPorId(categoria_id);
    if (!categoria) {
        return res.status(400).json({ error: 'La categoría no existe' });
    }
    const actualizado = await Producto.actualizarProducto(
        id, nombre, precio, stock, categoria_id);
    if (!actualizado) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json(actualizado);
}
 
async function eliminarProducto(req, res) {
    const id = req.params.id;
    if (!idValid(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }
    res.json(await Producto.eliminarProducto(id));
}  

async function eliminarProducto(req, res) {

    const id = req.params.id;

    if (!idValid(id)) {
        return res.status(400).json({
            error: "ID inválido"
        });
    }

    const eliminado = await Producto.eliminarProducto(id);

    if (!eliminado) {
        return res.status(404).json({
            error: "Producto no encontrado"
        });
    }

    res.status(204).send();
}


module.exports = {
    listarProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
}