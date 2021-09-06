const { Router } = require("express");
const { check } = require("express-validator");

const { login, GoogleSignin ,renovarToken } = require("./auth.controller");
const { validarJWT,validarCampos } = require("../middlewares");

const router = Router();

router.post(
  "/login",
  [
      check("correo", "El correo es obligatorio").isEmail(),
      check("password", "El password es obligatorio").not().isEmpty(),
      validarCampos
],
  login
);
router.post(
  "/google",
  [
      check("id_token", "El id_token es necesario").not().isEmpty(),
      validarCampos
],
  GoogleSignin
);

router.get("/",validarJWT,renovarToken);
module.exports = router;
