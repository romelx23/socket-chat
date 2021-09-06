const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../user/user.model");

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    res.json({
      msg: "No hay token en la peticion",
    });
  }

  //*   console.log(token);
  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    // leer el usuario que corresponde al uid
    const usuario = await Usuario.findById(uid);

    if(!usuario){
      return res.status(401).json({
        msg: "Token no valido - usuario no existe en BD",
      });
    }

    // Vertificar sui el uid tiene estado true
    if (!usuario.estado) {
      // no tengo permisos status 401
      return res.status(401).json({
        msg: "Token no valido - usuario con estado:false",
      });
    }
    // req.uid=uid;
    req.usuario = usuario;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Token no valido",
    });
  }
};

module.exports = {
  validarJWT,
};
