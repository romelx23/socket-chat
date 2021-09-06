const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/connection");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const {createServer} =require("http");//eslint-disable-line
const { socketController } = require("../sockets/sockets.controller");

class Server {
  constructor() {
    this.app = express();
    this.server = require("http").createServer(this.app);
    this.io = require("socket.io")(this.server);

    this.port = process.env.PORT;
    // Rutas de mi aplicacion
    this.paths = {
      auth: "/api/auth",
      buscar: "/api/buscar",
      categorias: "/api/categorias",
      productos: "/api/productos",
      usuarios: "/api/usuarios",
      uploads: "/api/uploads",
    };
    // this.usuariosPath = "/api/usuarios";
    // this.authPath = "/api/auth";

    // Morgan
    this.app.use(morgan("dev"));

    // Conectar a base de datos
    this.conectarDB();

    // Midelwares
    this.middleware();

    // rutas de mi aplicacion
    this.routes();

    // Directorio publico
    // this.app.use(express.static("public"));

    // sockets
    this.sockets();
  }

  async conectarDB() {
    await dbConnection();
  }

  middleware() {
    // Directorio publico
    this.app.use(express.static("public"));
    // Lestura y parseo del codigo
    this.app.use(express.json());
    // CORS
    this.app.use(cors());
    // File upload- Carga de archivo
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.paths.auth, require("../auth/auth.routes"));
    this.app.use(this.paths.buscar, require("../buscar/buscar.routes"));
    this.app.use(
      this.paths.categorias,
      require("../categorias/categorias.routes")
    );
    this.app.use(this.paths.productos, require("../productos/producto.routes"));
    this.app.use(this.paths.usuarios, require("../user/user.routes"));
    this.app.use(this.paths.uploads, require("../archivos/upload.routes"));
  }

  sockets(){
  
    this.io.on("connection",socketController);
    
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log("servidor corriendo el puerto ", this.port);
    });
  }
}

module.exports = Server;
