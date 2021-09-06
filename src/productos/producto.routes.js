const { Router } = require("express");
const { check } = require("express-validator");
const { existeProductoPorId, existeCategoriaPorId } = require("../helpers/db-validators");
const { validarJWT, validarCampos, esAdminRole } = require("../middlewares");
const {
  obtenerProducto,
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  borrarProducto,
} = require("./producto.controller");
const router = Router();

// obtener todos los productos
router.get("/",obtenerProductos);

// obtener productos por id
router.get("/:id", [
    check("id", "No es un mongo ID").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos
], obtenerProducto);

// Crear un producto
router.post("/", [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("categoria", "No es un Mongo ID").isMongoId(),
    check("categoria").custom(existeCategoriaPorId),
    validarCampos,
], crearProducto);

// Actualizar Producto
router.put("/:id", [
    validarJWT,
    check("categoria", "No es un Mongo ID").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos,
], actualizarProducto);

// Borrar Producto
router.delete("/:id", [
    validarJWT,
    esAdminRole,
    check("id").custom(existeProductoPorId),
    check("id", "No es un mongo ID").isMongoId(),
    validarCampos,
], borrarProducto);

module.exports = router;
