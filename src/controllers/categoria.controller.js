//Llamar a el modelo de Categoria
 
const Categoria = require('../models/model.categoria.js');
 
//Validacion de datos
const datosValidados = d => d.nombre && d.nombre.trim() !== '';
const idValido = id => !isNaN(parseInt(id)) && parseInt(id) > 0;
 
//Funciones de listar, obtener por ID,crear, actualizar y eliminar
 
async function listarCategorias(){
    const r = await pool.query(
        `SELECT id, nombre FROM categorias
         WHERE activo = true ORDER BY id`);
    return r.rows;
}
 
async function obtenerCategoriaPorId(id){
    const r = await pool.query(
        `SELECT id, nombre FROM categorias
         WHERE id = $1 AND activo = true`, [id]);
    return r.rows[0];
}
 
async function crearCategoria(req, res) {
    const { nombre } = req.body;
    if (!datosValidados({ nombre })) {
        return res.status(400).json({ error: 'Datos inválidos' });
    }
    try {
        const nuevaCategoria = await Categoria.crearCategoria(nombre);
        res.status(201).json(nuevaCategoria);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
 
async function actualizarCategoria(req, res) {
    const id = req.params.id;
    const { nombre } = req.body;
    if (!idValido(id)) {
        return res.status(400).json({ error: 'ID no existe' });
    }
    try {
        const categoriaActualizada = await Categoria.actualizarCategoria(id, nombre);
        if (!categoriaActualizada) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.status(200).json(categoriaActualizada);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
 
async function eliminarCategoria(id){
    const r = await pool.query(
        `UPDATE categorias SET activo = false
         WHERE id = $1 AND activo = true RETURNING *`, [id]);
    return r.rows[0];
}

async function contarProductosActivos(id){
    const r = await pool.query(
        `SELECT COUNT(*)::int AS total FROM productos
         WHERE categoria_id = $1 AND activo = true`, [id]);
    return r.rows[0].total;
}
 
module.exports = {
    listarCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
    contarProductosActivos
};