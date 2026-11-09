// Llamar al modelo de Producto
const Producto = require('../models/producto.model.js');
 
//Validacion de datos
const datosValidados = d => d.nombre && Number(d.precio) > 0 && Number(d.stock) >= 0;
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
    const { nombre, precio, stock } = req.body;
    if (!datosValidados({ nombre, precio, stock })) {
        return res.status(400).json({ error: 'Datos inválidos' });
    }
    res.json(await Producto.crearProducto({ nombre, precio, stock }));
}
async function actualizarProducto(req, res) {
    const id = req.params.id;
    const { nombre, precio, stock } = req.body;

    if (!idValid(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    if (!datosValidados({ nombre, precio, stock })) {
        return res.status(400).json({ error: 'Datos inválidos' });
    }

    const producto = await Producto.actualizarProducto(id, {
        nombre,
        precio,
        stock
    });

    if (!producto) {
        return res.status(404).json({
            error: 'Producto no encontrado'
        });
    }

    res.status(200).json(producto);
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