"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = configurePipeline;
//modulo de codigo typescript para configurar el pipeline de funciones middlewares 
//para nuestro servidor web express. Exporta una funcion que recibe la instancia
//de express y configura los middlewares necesarios.
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const endPointsCliente_1 = __importDefault(require("./config_enrutamiento/endPointsCliente"));
function configurePipeline(serverExpress) {
    //configurar modulos MIDDLEWARE de express, cada modulo es una funcion javascript con 3 parametros:
    // 1) request (objeto que representa la peticion http que le llega del cliente si es el primer modulo de la pipeline, sino
    //   request es el objeto modificado por el modulo anterior en la pipeline)
    // 2) response (objeto que representa la respuesta http que se le va a enviar al cliente por el modulo actual)
    // 3) next (funcion que se llama para pasar el control al siguiente modulo de la pipeline), 
    // el metodo .use() de express sirve para configurar/añadir un modulo MIDDLEWARE en la pipeline de express
    //el primer parametro es la RUTA (path) en la que se activa el modulo, si no se pone nada se activa en todas las rutas
    //el segundo parametro es la funcion que define el modulo MIDDLEWARE con los 3 parametros mencionados antes
    //---funciones middleware para todas las rutas, generalmente de paquetes de terceros (modulos npm)---
    //configurar el 1º modulo middleware cookie-parser para gestionar cookies en express, las cookies se van a almacenar en objeto req.cookies
    //console.log(`el valor de la variable cookieParser es: ${cookiesParser}`);
    serverExpress.use((0, cookie_parser_1.default)());
    //configurar el 2º modulo middleware express.json() para gestionar peticiones http POST con cuerpo en formato json, se almacena en req.body
    //console.log(`el valor de la variable express.json es: ${express.json}`);
    serverExpress.use(express_1.default.json());
    //configurar el 3º modulo middleware express.urlencoded() para gestionar peticiones http GET con variables en url, se almacena en req.query
    //console.log(`el valor de la variable express.urlencoded es: ${express.urlencoded}`);
    serverExpress.use(express_1.default.urlencoded({ extended: false })); //{extended:true} para que admita objetos complejos en las variables de url
    //configurar el 4º modulo middleware cors() para gestionar politicas CORS en express
    //console.log(`el valor de la variable cors es: ${cors}`);
    serverExpress.use((0, cors_1.default)());
    //----funciones middleware para rutas personalizadas....
    serverExpress.use('/api/Cliente', endPointsCliente_1.default);
    //serverExpress.use('/api/Tienda', objetoRoutingTienda);
}
//# sourceMappingURL=config_pipeline.js.map