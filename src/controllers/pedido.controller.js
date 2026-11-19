
const Pedido = require('../models/model.pedido.js');

// Validar que el ID sea un entero positivo
const idValido = id =>
    Number.isInteger(Number(id)) && Number(id) > 0;

// Validar los productos y sus cantidades
const detallesValidos = detalles =>
    Array.isArray(detalles) &&
    detalles.length > 0 &&
    detalles.every(d =>
        idValido(d.producto_id) &&
        Number.isInteger(d.cantidad) &&
        d.cantidad > 0
    );

// Crear pedido
async function crearPedido(req, res) {
    const { detalles } = req.body;
    const cliente_id = req.usuario.id;

    if (!detallesValidos(detalles)) {
        return res.status(400).json({
            error: 'Los detalles del pedido son inválidos'
        });
    }

    try {
        const nuevoPedido = await Pedido.crearPedido(
            cliente_id,
            detalles
        );

        return res.status(201).json(nuevoPedido);

    } catch (error) {
    console.error(error);

    return res.status(error.statusCode || 500).json({
        error: error.statusCode
            ? error.message
            : 'Error al crear el pedido'
    });
}
}

// Listar pedidos del cliente autenticado
async function listarPedidos(req, res) {
    const cliente_id = req.usuario.id;

    try {
        const pedidos = await Pedido.listarPedidos(cliente_id);

        return res.status(200).json(pedidos);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Error al consultar los pedidos'
        });
    }
}

// Obtener un pedido específico del cliente autenticado
async function obtenerPedidoPorId(req, res) {
    const id = req.params.id;
    const cliente_id = req.usuario.id;

    if (!idValido(id)) {
        return res.status(400).json({
            error: 'ID de pedido inválido'
        });
    }

    try {
        const pedido = await Pedido.obtenerPedidoPorId(id, cliente_id);

        if (pedido.length === 0) {
            return res.status(404).json({
                error: 'Pedido no encontrado'
            });
        }

        return res.status(200).json(pedido);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Error al consultar el pedido'
        });
    }
}

module.exports = {
    crearPedido,
    listarPedidos,
    obtenerPedidoPorId
};