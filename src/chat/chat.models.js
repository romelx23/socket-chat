class Mensaje{
    constructor(uid,nombre,mensaje){
        this.nombre=nombre;
        this.uid=uid;
        this.mensaje=mensaje;
    }
}

class ChatMensajes{//eslint-disable-line
    constructor(){
        this.mensajes=[];
        this.usuarios={};
    }

    get ultimos10(){
        this.mensajes=this.mensajes(0,10);
        return this.mensajes;
    }

    get usuariosArr(){
        return Object.values(this.usuarios);//[{}{}{}]
    }

    enviarMensaje(uid,nombre,mensaje){
        this.mensajes.unshift(
            new Mensaje(uid,nombre,mensaje)
        );
    }
    conectarUsuario(usuario){
        this.usuarios[usuario.id]=usuario;
    }
    desconectarUsuario(id){
        delete this.usuarios[id];
    }
}

module.exports=ChatMensajes;