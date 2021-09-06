const { request, response } = require("express");
const Categoria = require("../categorias/categoria.model");
const Producto = require("./producto.model");

// Obtener Todos los Productos

const obtenerProductos = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };
  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .populate("usuario", "nombre")
      .populate("categoria", "nombre")
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);

  res.json({
    total,
    productos,
  });
};

// Obtener Producto por id

const obtenerProducto = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const producto = await Producto.findById(id)
      .populate("usuario", "nombre")
      .populate("categoria", "nombre");

    if (!producto.estado) {
      return res.status(401).json({
        msg: "producto no encontrada",
      });
    }

    res.json({
      producto,
    });
  } catch (error) {
    console.log(error);
  }
};

// Crear Producto
const crearProducto = async (req = request, res = response) => {
  const { estado, usuario, ...body } = req.body; //eslint-disable-line
  body.nombre = body.nombre.toUpperCase();
  const { nombre } = body;

  // Si el producto ya existe en BD
  const productoDB = await Producto.findOne({ nombre });

  if (productoDB) {
    return res.status(400).json({
      msg: `La Producto ${productoDB.nombre}, ya existe`,
    });
  }

  // generar la data a guardar
  const data = {
    ...body,
    usuario: req.usuario._id,
  };

  const producto = new Producto(data);

  // GuardarDB
  await producto.save();
  res.status(201).json(producto);
};

// Actualizar Producto
const actualizarProducto = async (req = request, res = response) => {
  // capturando query params
  const { id } = req.params;

  const { estado, usuario, ...data } = req.body; //eslint-disable-line

  data.nombre = data.nombre.toUpperCase();
  const { nombre } = data;
  data.usuario = req.usuario._id;
  const { categoria } = data; //eslint-disable-line
  // Si no viene el nombre
  if (data.nombre) {
    data.nombre = data.nombre.toUpperCase();
  }

  // Si el producto existe
  const productoDB = await Producto.findOne({ nombre });

  if (productoDB) {
    return res.status(400).json({
      msg: `La Producto ${productoDB.nombre}, ya existe`,
    });
  }
  // Si la categoria existe
  const categoriaBD = await Categoria.findOne({ _id:categoria,estado:true});

  if (!categoriaBD) {
    return res.status(400).json({
      msg: `La categoria ${data.categoria}, no existe`,
    });
  }
  // actualizamos el producto
  const producto = await Producto.findByIdAndUpdate(id, data, { new: true }); //eslint-disable-line

  if (!producto.estado) {
    return res.status(401).json({
      msg: "producto no encontrado",
      producto,
    });
  }

  res.status(200).json({
    msg: "put API - productoPut",
    producto,
    categoria: data.categoria,
  });
};

// Borrar Producto
const borrarProducto = async (req = request, res = response) => {
  const { id } = req.params;

  // actualizamos el estado del producto
  const producto = await Producto.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );

  res.json({
    producto,
  });
};

module.exports = {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  borrarProducto,
};
