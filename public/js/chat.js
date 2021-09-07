const url = window.location.hostname.includes("localhost") //eslint-disable-line
  ? "http://localhost:8080/api/auth/"
  : "https://rest-server-cafe-romel.herokuapp.com/api/auth/";

let usuario = null;//eslint-disable-line
let socket = null;//eslint-disable-line

// Referencias HTML

const txtuid    =document.querySelector("#txtuid");//eslint-disable-line
const txtMensaje=document.querySelector("#txtMensaje");//eslint-disable-line
const ulUsuario =document.querySelector("#ulUsuario");//eslint-disable-line
const ulMensajes=document.querySelector("#ulMensajes");//eslint-disable-line
const btnSalir  =document.querySelector("#btnSalir");//eslint-disable-line

const validarJWT = async () => {
  const token = localStorage.getItem("token") || "";//eslint-disable-line
  if (token.length <= 10) {
    window.location = "index.html";//eslint-disable-line
    throw new Error("No hay token en la peticion");
  }
  const resp=await fetch( url ,{//eslint-disable-line
    headers:{"x-token":token}
  });

  const {usuario:userDB,token:tokenDB}=await resp.json();
  localStorage.setItem("token",tokenDB);//eslint-disable-line
  usuario=userDB;

  document.title=usuario.nombre;//eslint-disable-line

  await conectarSocket();
};

const conectarSocket=async()=>{
    socket=io({//eslint-disable-line
        "extraHeaders":{
            "x-token":localStorage.getItem("token")//eslint-disable-line
        }
    });

    socket.on("connect",()=>{
        console.log("Socket online");
    });
    socket.on("disconnect",()=>{
        console.log("Socket offline");
    });
    
    socket.on("recibir-mensaje",()=>{
        // TODO 
    });

    socket.on("usuarios-activos",(payload)=>{
       console.log(payload);
    });

    socket.on("mensaje-privado",()=>{
        // TODO 
    });
};

const main = async () => {//eslint-disable-line
  await validarJWT();
};

main();

// const socket=io();//eslint-disable-line
