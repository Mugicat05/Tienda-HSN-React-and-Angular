"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//modulo de codigo de definicion de los endpoints (rutas) de la zona cliente
// para el servidor web express con las funciones middleware que los gestionan
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const Cliente_Schema_js_1 = __importDefault(require("../../modelos/modelos_ORM_mongoose/Cliente_Schema.js"));
const objetoRoutingCliente = express_1.default.Router();
objetoRoutingCliente.post('/Registro', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //logica para gestionar el endpoint /api/Cliente/Registro
    try {
        //1º recuperar los datos enviados por el cliente en el cuerpo de la peticion http POST del req.body
        //conectarnos a la base de datos y guardar los datos del cliente
        //const datos:IDatosRegistro=req.body;
        const { nombre, apellidos, genero, email, password, planAmigo } = req.body;
        yield mongoose_1.default.connect(process.env.URL_MONGDOB);
        const nuevoCliente = new Cliente_Schema_js_1.default({
            nombre,
            apellidos,
            genero,
            cuenta: {
                email,
                password: bcrypt_1.default.hashSync(password, 10), //cifrar la password con bcrypt
                cuentaActivada: false,
                tipoCuenta: 'particular',
                imageAvatar: '',
                telefonoContacto: '',
                fechaCreacionCuenta: Date.now()
            },
            direcciones: [],
            pedidos: [],
            opiniones: [],
            listaFavoritos: [],
            metodosPago: [],
            nifcif: '',
            fechaNacimiento: 0
        });
        const resInsert = yield nuevoCliente.save();
        console.log('Resultado de insertar nuevo cliente en la BBDD:', resInsert);
        //2º enviar email de activacion de la cuenta al email del cliente
        //3º enviar respuesta al cliente con codigo de exito
        res.status(200).send({ codigo: 0, mensaje: 'Registro de datos cliente exitoso' });
    }
    catch (error) {
        console.error('Error en /api/Cliente/Registro:', error);
        res.status(200).send({ codigo: 1, mensaje: 'Error interno del servidor al registrar datos cliente' });
    }
}));
exports.default = objetoRoutingCliente;
//# sourceMappingURL=endPointsCliente.js.map