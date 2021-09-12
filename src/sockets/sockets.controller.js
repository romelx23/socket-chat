const { Socket } = require("socket.io");
const ChatMensajes = require("../chat/chat.models");
const { comprobarJWT } = require("../helpers");

const chatMensajes=new ChatMensajes();

const socketController=async(socket= new Socket(),io)=>{

    // console.log("cliente conectado",socket.id);
    const token=socket.handshake.headers["x-token"];
    const usuario=await comprobarJWT(token);

    if(!usuario){
        return socket.disconnect();
    }

    // console.log("Se conecto",usuario.nombre); Agregar el usuario conectado
    chatMensajes.conectarUsuario(usuario);
    io.emit("usuarios-activos",chatMensajes.usuariosArr);
    socket.emit("recibir-mensaje",chatMensajes.ultimos10);

    // Mensaje privado
    // Conectarlo a una sala especial
    socket.join( usuario.id );// global, socket.id, usuario.id


    // Limpiar cuando alguien se desconecta
    socket.on("disconnect",()=>{
        chatMensajes.desconectarUsuario(usuario.id);
        io.emit("usuarios-activos",chatMensajes.usuariosArr);
    });

    socket.on("enviar-mensaje",({uid,mensaje})=>{
       if(uid){
            //    Almacenar los mensajes privados
            chatMensajes.enviarMensajePrivado(usuario.id,usuario.nombre,mensaje);
            // Mensaje privado
            // socket.to(uid).emit("mensaje-privado",{de: usuario.nombre,mensaje});
            socket.emit("mensaje-privado",chatMensajes.ultimosPrivados);
            socket.to(uid).emit("mensaje-privado",chatMensajes.ultimosPrivados);
       }else{
        chatMensajes.enviarMensaje(usuario.id,usuario.nombre,mensaje);
        io.emit("recibir-mensaje",chatMensajes.ultimos10);
       }
    });
};

 module.exports={
    socketController
 };