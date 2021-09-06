const Categoria = require("../categorias/categoria.model");
const Producto = require("../productos/producto.model");
const Rol = require("../rol/rol.models");
const Usuario = require("../user/user.model");


const esRoleValido = async (rol = "") => {
  const existeRol = await Rol.findOne({ rol });

  if (!existeRol) {
    throw new Error(`El rol ${rol} no esta registrado`);
  }
};

const emailExiste=async(correo="")=>{
    const existeEmail=await Usuario.findOne({ correo });
    if (existeEmail) {
      throw new Error(`El correo ${correo} ya está registrado`);
    }
};

const existeUsuarioPorId=async(id)=>{
    // Verificar si el usuario existe
    const existeUsuario=await Usuario.findById(id);
    if (!existeUsuario) {
      throw new Error(`El id: ${id} no esta registrado`);
    }
};

const existeCategoriaPorId=async(id)=>{
    // Verificar si la categoria existe
    const existeCategoria=await Categoria.findById(id);
    if (!existeCategoria) {
      throw new Error(`El id: ${id} no esta registrado`);
    }
};

const existeProductoPorId=async(id)=>{
    // Verificar si el producto existe
    const existeProducto=await Producto.findById(id);
    if (!existeProducto) {
      throw new Error(`El id: ${id} no esta registrado`);
    }
};

/**
 * Validar colecciones permitidas
 */

const coleccionesPermitidas=(coleccion="",colecciones=[])=>{

  const incluida=colecciones.includes(coleccion);
  if(!incluida){
    throw new Error(`La coleccion ${coleccion} no es permitida, ${colecciones}`);
  }
  return true;

};

module.exports = {
  esRoleValido,
  emailExiste,
  existeUsuarioPorId,
  existeCategoriaPorId,
  existeProductoPorId,
  coleccionesPermitidas
};
