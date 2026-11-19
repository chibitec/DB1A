const pool = require("../config/db.js");


async function crearPedido(cliente_id, detalles) {
    const client = await pool.connect();

    try {
        // Iniciar transacción
        await client.query("BEGIN");

        // 1. Crear la cabecera del pedido (con total inicial 0)
        const pedido = await client.query(
            `INSERT INTO pedidos (cliente_id, total)
             VALUES ($1, 0)
             RETURNING id, cliente_id, total, creado_en`,
            [cliente_id]
        );

        const pedido_id = pedido.rows[0].id;
        let total = 0;

        // 2. Registrar los productos del pedido y actualizar stock
        for (const detalle of detalles) {
            // Bloqueo pesimista con FOR UPDATE para evitar condiciones de carrera (concurrencia)
            const productoResult = await client.query(
                `SELECT id, precio, stock
                 FROM productos
                 WHERE id = $1 AND activo = true
                 FOR UPDATE`,
                [detalle.producto_id]
            );

            if (productoResult.rows.length === 0) {
                const error = new Error(
                    `El producto ${detalle.producto_id} no existe o está inactivo`
                );
                error.statusCode = 400;
                throw error;
            }

            const producto = productoResult.rows[0];

            if (producto.stock < detalle.cantidad) {
                const error = new Error(
                    `Stock insuficiente para el producto ${detalle.producto_id}`
                );
                error.statusCode = 400;
                throw error;
            }

            const precio = Number(producto.precio);
            const subtotal = Number((precio * detalle.cantidad).toFixed(2));

            // Insertar el detalle del pedido
            await client.query(
                `INSERT INTO detalle_pedido
                 (pedido_id, producto_id, cantidad, precio_unitario, subtotal)
                 VALUES ($1, $2, $3, $4, $5)`,
                [
                    pedido_id,
                    detalle.producto_id,
                    detalle.cantidad,
                    precio,
                    subtotal
                ]
            );

            // Descontar del inventario (stock)
            await client.query(
                `UPDATE productos
                 SET stock = stock - $1
                 WHERE id = $2`,
                [detalle.cantidad, detalle.producto_id]
            );

            total += subtotal;
        }

        total = Number(total.toFixed(2));

        // 3. Actualizar el total definitivo en la cabecera del pedido
        await client.query(
            `UPDATE pedidos
             SET total = $1
             WHERE id = $2`,
            [total, pedido_id]
        );

        // Confirmar la transacción
        await client.query("COMMIT");

        return {
            id: pedido_id,
            cliente_id,
            total,
            detalles
        };

    } catch (error) {
        // En caso de cualquier error, revertir todas las operaciones
        await client.query("ROLLBACK");
        throw error;
    } finally {
        // Liberar el cliente de vuelta al pool
        client.release();
    }
}


async function listarPedidos(cliente_id) {
    const r = await pool.query(
        `SELECT p.id, p.cliente_id, c.nombre AS cliente,
                p.total, p.creado_en
         FROM pedidos p
         JOIN clientes c ON c.id = p.cliente_id
         WHERE p.cliente_id = $1
         ORDER BY p.id DESC`,
        [cliente_id]
    );

    return r.rows;
}

async function obtenerPedidoPorId(id, cliente_id) {
    const r = await pool.query(
        `SELECT p.id, p.cliente_id, c.nombre AS cliente,
                p.total, p.creado_en,
                dp.producto_id, pr.nombre AS producto,
                dp.cantidad, dp.precio_unitario, dp.subtotal
         FROM pedidos p
         JOIN clientes c ON c.id = p.cliente_id
         JOIN detalle_pedido dp ON dp.pedido_id = p.id
         JOIN productos pr ON pr.id = dp.producto_id
         WHERE p.id = $1 AND p.cliente_id = $2
         ORDER BY dp.id`,
        [id, cliente_id]
    );

    return r.rows;
}

module.exports = {
    crearPedido,
    listarPedidos,
    obtenerPedidoPorId
};