class Mensaje{
    constructor(uid,nombre,mensaje){
        this.nombre=nombre;
        this.uid=uid;
        this.mensaje=mensaje;
    }
}
class MensajePrivado{
    constructor(uid,nombre,mensaje){
        this.nombre=nombre;
        this.uid=uid;
        this.mensaje=mensaje;
    }
}

class ChatMensajes{//eslint-disable-line
    constructor(){
        this.mensajes=[];
        this.privados=[];
        this.usuarios={};
    }

    get ultimos10(){
        this.mensajes=this.mensajes.splice(0,10);
        return this.mensajes;
    }
    
    get ultimosPrivados(){
        this.privados=this.privados.splice(0,20);
        return this.privados;
    }

    get usuariosArr(){
        return Object.values(this.usuarios);//[{}{}{}]
    }

    enviarMensaje(uid,nombre,mensaje){
        this.mensajes.unshift(
            new Mensaje(uid,nombre,mensaje)
        );
    }
    enviarMensajePrivado(uid,nombre,mensaje){
        this.privados.unshift(
            new MensajePrivado(uid,nombre,mensaje)
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