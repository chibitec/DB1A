// 1. Importar la conexión a la base de datos
const pool = require('../config/db.js');

async function listarCategorias(){
    const r = await pool.query('SELECT * FROM categorias ORDER BY id');
    return r.rows;
}

async function obtenerCategoriaPorId(id){
    const r = await pool.query('SELECT * FROM categorias WHERE id = $1', [id]);
    return r.rows[0];
}

async function crearCategoria(nombre){
    const r = await pool.query(
        'INSERT INTO categorias (nombre) VALUES ($1) RETURNING *',
        [nombre]);
    return r.rows[0];
}

async function actualizarCategoria(id, nombre){
    const r = await pool.query(
        'UPDATE categorias SET nombre = $1 WHERE id = $2 RETURNING *',
        [nombre, id]);
    return r.rows[0];
}

async function eliminarCategoria(id){
    const r = await pool.query(
        'DELETE FROM categorias WHERE id = $1 RETURNING *',
        [id]);
    return r.rows[0];
}

module.exports = {
    listarCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
}