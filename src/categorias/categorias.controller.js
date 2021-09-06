const { request, response } = require("express");
const Categoria = require("../categorias/categoria.model");

const crearCategoria = async (req = request, res = response) => {
  const nombre = req.body.nombre.toUpperCase();

  const categoriaDB = await Categoria.findOne({ nombre });

  if (categoriaDB) {
    return res.status(400).json({
      msg: `La Categoria ${categoriaDB.nombre}, ya existe`,
    });
  }
  // generar la dataa guardar
  const data = {
    nombre,
    usuario: req.usuario._id,
  };

  const categoria = new Categoria(data);

  // GuardarDB
  await categoria.save();
  res.status(201).json(categoria);
};

// Obtener Categorias - paginados - total - populate

const obtenerCategorias = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };
  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query)
      .populate("usuario", "nombre")
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);

  res.json({
    total,
    categorias,
  });
};

// Obtener Categoria populate{} por id

const obtenerCategoria = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const categoria = await Categoria.findById(id).populate("usuario","nombre");

    if (!categoria.estado) {
      return res.status(401).json({
        msg: "categoria no encontrada",
      });
    }

    res.json({
      categoria,
    });
  } catch (error) {
    console.log(error);
  }
};

// Actualizar Categoria

const actualizarCategoria = async (req = request, res = response) => {
  // capturando query params
  const { id } = req.params;

  const {estado,usuario,...data} = req.body; //eslint-disable-line

  data.nombre=data.nombre.toUpperCase();
  const {nombre}=data;
  data.usuario=req.usuario._id;

  const categoriaDB = await Categoria.findOne({ nombre });

  if (categoriaDB) {
    return res.status(400).json({
      msg: `La Categoria ${categoriaDB.nombre}, ya existe`,
    });
  }

  const categoria = await Categoria.findByIdAndUpdate(
    id,
    data,
    {new:true}
  ); //eslint-disable-line

  if (!categoria.estado) {
    return res.status(401).json({
      msg: "categoria no encontrada",
      categoria,
    });
  }

  res.status(200).json({
    msg: "put API - categoriaPut",
    categoria,
  });
};

// Borrar Categoria estado :false

const borrarCategoria = async (req = request, res = response) => {
  const { id } = req.params;

  const categoria = await Categoria.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );

  res.json({
    categoria,
  });
};

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  borrarCategoria,
};
