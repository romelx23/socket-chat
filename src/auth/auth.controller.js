const { request, response } = require("express");

const Usuario = require("../user/user.model");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req = request, res = response) => {
  const { correo, password } = req.body;

  try {
    // Verificar si el email Existe

    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario /Password no son correctos-correo",
      });
    }

    // Si el usuario esta activo

    if (!usuario.estado) {
      return res.status(400).json({
        msg: "Usuario /Password no son correctos-estado:false",
      });
    }

    // Verificar la contraseña

    const validarPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validarPassword) {
      return res.status(400).json({
        msg: "Usuario /Password no son correctos-password",
      });
    }

    // Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Hable con el admnistrador",
    });
  }
};

// Google SignIn

const GoogleSignin = async (req = request, res = response) => {
  const { id_token } = req.body;
  const { correo, nombre, img } = await googleVerify(id_token);

  let usuario = await Usuario.findOne({ correo });

  
  try {

  if (!usuario) {
    // Tengo que crearlo
    const data = {
      nombre,
      correo,
      password: ":P",
      img,
      google:true
    };

    usuario = new Usuario(data);
    await usuario.save();
  }

  // Si el usuario en DB 
  if(!usuario.estado){
    return res.status(401).json({
      msg: "Hable con el admnistrador, usuario bloqueado",
    });
  }

  // Generar el JWT
  const token = await generarJWT(usuario.id);

    res.json({
     usuario,
     token
    });
    
  } catch (error) {
    res.status(401).json({
      msg: "token de Google no es valido",
    });
  }
};

const renovarToken=async(req=request,res=response)=>{

  const {usuario}=req; 

   // Generar el JWT
   const token = await generarJWT(usuario.id);

  res.json({
    usuario,
    token
  });

};

module.exports = {
  login,
  GoogleSignin,
  renovarToken,
};
