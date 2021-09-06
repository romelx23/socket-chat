const { Router} = require("express");
const { check } = require("express-validator");
const { validarJWT, validarCampos, esAdminRole } = require("../middlewares");
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require("./categorias.controller");
const {existeCategoriaPorId} = require("../helpers/db-validators");
const router = Router();

// Obtener todas las cateogrias - publico
router.get("/",obtenerCategorias);

// Obtener una cateogria por id - publico
router.get("/:id",[
    check("id", "No es un mongo ID").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    validarCampos
] ,obtenerCategoria);

// Crear categoria -privado -cualquiera persona con token valido
router.post(
  "/",
  [validarJWT, 
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos
],
    crearCategoria
);

// Actulaizar po id - privado-con token valido
router.put("/:id",[
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("id", "No es un mongo ID").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    validarCampos,
] ,actualizarCategoria);

// borrar cateogira-admin
router.delete("/:id",[
    validarJWT,
    esAdminRole,
    check("id").custom(existeCategoriaPorId),
    check("id", "No es un mongo ID").isMongoId(),
    validarCampos,
],borrarCategoria);

module.exports = router;
