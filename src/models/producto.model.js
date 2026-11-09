const pool = require("../config/db.js");

async function listarProductos() {
    try {
        const result = await pool.query("SELECT * FROM productos");
        return result.rows;
    } catch (error) {
        console.error("Error al consultar productos:", error);
    }
}

async function obtenerProductoPorId(id) {
    try {
        const result = await pool.query("SELECT * FROM productos WHERE id = $1", [id]);
        return result.rows[0];
    } catch (error) {
        console.error("Error al consultar producto:", error);
    }
}


async function crearProducto({ nombre, precio, stock }) {
    try {
        const result = await pool.query(
            "INSERT INTO productos (nombre, precio, stock) VALUES ($1, $2, $3) RETURNING *",
            [nombre, precio, stock]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error al crear producto:", error);
        throw error;
    }
}

async function actualizarProducto(id, { nombre, precio, stock }) {
    try {
        const result = await pool.query(
            "UPDATE productos SET nombre = $1, precio = $2, stock = $3 WHERE id = $4 RETURNING *",
            [nombre, precio, stock, id]
        );

        if (result.rowCount === 0) {
            return null;
        }

        return result.rows[0];

    } catch (error) {
        console.error("Error al actualizar producto:", error);
        throw error;
    }
}

async function eliminarProducto(id) {
    try {
        const result = await pool.query("DELETE FROM productos WHERE id = $1 RETURNING *", [id]);
        return result.rows[0];
    } catch (error) {
        console.error("Error al eliminar producto:", error);
    }
}

module.exports = {
    listarProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
}

