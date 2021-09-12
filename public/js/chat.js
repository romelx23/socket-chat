const url = window.location.hostname.includes("localhost") //eslint-disable-line
  ? "http://localhost:8080/api/auth/"
  : "https://rest-server-cafe-romel.herokuapp.com/api/auth/";

let usuario = null; //eslint-disable-line
let socket = null; //eslint-disable-line

// Referencias HTML

const txtuid = document.querySelector("#txtuid"); //eslint-disable-line
const txtMensaje = document.querySelector("#txtMensaje"); //eslint-disable-line
const ulUsuario = document.querySelector("#ulUsuario"); //eslint-disable-line
const ulMensajes = document.querySelector("#ulMensajes"); //eslint-disable-line
const ulMensajesPrivados = document.querySelector("#ulMensajesPrivados"); //eslint-disable-line
const btnSalir = document.querySelector("#btnSalir"); //eslint-disable-line

const validarJWT = async () => {
  const token = localStorage.getItem("token") || ""; //eslint-disable-line
  if (token.length <= 10) {
    window.location = "index.html"; //eslint-disable-line
    throw new Error("No hay token en la peticion");
  }
  const resp = await fetch(url, {//eslint-disable-line
    headers: { "x-token": token },
  });

  const { usuario: userDB, token: tokenDB } = await resp.json();
  localStorage.setItem("token", tokenDB); //eslint-disable-line
  usuario = userDB;

  document.title = usuario.nombre; //eslint-disable-line

  await conectarSocket();
};

const conectarSocket = async () => {
  socket = io({//eslint-disable-line
    extraHeaders: {
      "x-token": localStorage.getItem("token"), //eslint-disable-line
    },
  });

  socket.on("connect", () => {
    console.log("Socket online");
  });
  socket.on("disconnect", () => {
    console.log("Socket offline");
  });

  socket.on("recibir-mensaje", dibujarMensajes);

  socket.on("usuarios-activos", dibujarUsuarios);

  socket.on("mensaje-privado", (payload) => {
    console.log("Privado",payload);
    dibujarMensajesPrivados(payload);
  });
};

const dibujarUsuarios = (usuarios = []) => {
  let userHTML = "";//eslint-disable-line
  usuarios.forEach(({nombre,uid}) => {
    userHTML += `
    <li>
        <p>
            <h5 class="text-success">${nombre}</h5>
            <span class="fs-6 text-muted">${uid}</span>
        </p>
    </li>
    `;
  });
  ulUsuario.innerHTML=userHTML;
};
const dibujarMensajes = (mensajes = []) => {
  let mensajeHTML = "";//eslint-disable-line
  mensajes.forEach(({nombre,mensaje}) => {
    mensajeHTML += `
    <li>
        <p>
            <span class="text-primary">${nombre}</span>
            <span class="text-success">${mensaje}</span>
        </p>
    </li>
    `;
  });
  ulMensajes.innerHTML=mensajeHTML;
};
const dibujarMensajesPrivados = (mensajes) => {
  console.log(mensajes);
  let mensajeHTML = "";//eslint-disable-line
  mensajes.forEach(({nombre,mensaje}) => {
    mensajeHTML += `
    <li>
        <p>
            <span class="text-primary">${nombre}</span>
            <span class="text-success">${mensaje}</span>
        </p>
    </li>
    `;
  });
  ulMensajesPrivados.innerHTML=mensajeHTML;
};

txtMensaje.addEventListener("keyup",({keyCode})=>{
  const mensaje=txtMensaje.value;
  const uid=txtuid.value;

  if(keyCode!=13){return;}
  if(mensaje.length===0){return;}
  socket.emit("enviar-mensaje",{mensaje,uid});
  txtMensaje.value="";
});

const main = async () => {
  //eslint-disable-line
  await validarJWT();
};

btnSalir.addEventListener("click",()=>{
  localStorage.clear();//eslint-disable-line
  window.location = "index.html";//eslint-disable-line
});

main();

// const socket=io();//eslint-disable-line
