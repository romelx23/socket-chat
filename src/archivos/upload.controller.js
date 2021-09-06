const { response, request } = require("express");
const { subirArchivo } = require("../helpers");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const Producto = require("../productos/producto.model");
const Usuario = require("../user/user.model");

const cargarArchivos = async (req = request, res = response) => {
  try {
    // Imagenes
    // const nombre = await subirArchivo(req.files, ["txt", "md"],"textos");
    const nombre = await subirArchivo(req.files, undefined, "imgs");

    res.json({
      nombre,
    });
  } catch (error) {
    res.status(400).json({
      msg: "archivo no valido",
    });
  }
};

const actualizarImagen = async (req = request, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }

      break;
    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }

      break;

    default:
      return res.status(500).json({
        msg: "Se me olvido validar esto",
      });
  }

  // Limpiar Imagenes previas

  if (modelo.img) {
    // Ha que borrar la imagen del servidor

    const pathImagen = path.join(
      __dirname,
      "../uploads",
      coleccion,
      modelo.img
    );
    if (fs.existsSync(pathImagen)) {
      // borrar un archivo
      fs.unlinkSync(pathImagen);
    }
  }

  const nombre = await subirArchivo(req.files, undefined, coleccion);
  modelo.img = nombre;
  await modelo.save();

  res.json({
    modelo,
  });
};

const mostrarImagen = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }

      break;
    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }

      break;

    default:
      return res.status(500).json({
        msg: "Se me olvido validar esto",
      });
  }

  // Limpiar Imagenes previas

  if (modelo.img) {
    // Ha que borrar la imagen del servidor

    const pathImagen = path.join(
      // __dirname,
      // "../uploads",
      // coleccion,
      modelo.img
    );
    // console.log(pathImagen);
    // if (fs.existsSync(pathImagen)) {
      // return res.sendFile(pathImagen);
    // }
    return res.json({
      img:pathImagen
    });
  }

  const pathNoImage = path.join(__dirname, "../assets/no-image.jpg");

  res.status(400).sendFile(pathNoImage);
};

const actualizarImagenCloudinary = async (req = request, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }

      break;
    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }

      break;

    default:
      return res.status(500).json({
        msg: "Se me olvido validar esto",
      });
  }

  // Limpiar Imagenes previas

  if (modelo.img) {
    const nombreArr = modelo.img.split("/");
    const nombre = nombreArr[nombreArr.length - 1];
    const [public_id] = nombre.split(".");
    await cloudinary.uploader.destroy(public_id);
    console.log(public_id);
  }

  const { tempFilePath } = req.files.archivo;

  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

  modelo.img = secure_url;
  await modelo.save();

  res.json({
    modelo,
  });
};

module.exports = {
  cargarArchivos,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary,
};
