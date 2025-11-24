"use strict";
//modulo de codigo para definir el esquema de datos (schema) del modelo Cliente
//para mapear cada documento de la base de datos MongoDB de la coleccion "clientes" 
//con un objeto de la clase "Cliente" typescript
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const cuentaSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true, default: '' },
    password: { type: String, required: true, default: '' },
    fechaCreacionCuenta: { type: Number, required: true, default: Date.now() },
    imageAvatar: String,
    cuentaActivada: { type: Boolean, required: true, default: false },
    tipoCuenta: { type: String, required: true, default: 'particular' },
    telefonoContacto: String
});
//OJO!!!! el tipo de dato dentro de cada propiedad o campo del esquema no es un tipo typescript
//sino es un tipo de mongoose
const ClienteSchema = new mongoose_1.default.Schema({
    nombre: { type: String, required: true, default: '' },
    apellidos: { type: String, required: true, default: '' },
    genero: { type: String, required: true, default: 'Hombre' },
    nifcif: String,
    fechaNacimiento: Number,
    direcciones: [],
    pedidos: [],
    opiniones: [],
    listaFavoritos: [],
    metodosPago: [],
    cuenta: { type: cuentaSchema, required: true }
});
//el metodo mongoose.model() crea una clase mongoose a partir de un esquema mongoose
//y lo exporta para que pueda ser usado en otros modulos typescript
// - el primer parametro es el nombre de la clase mongoose que se va a crear
// - el segundo parametro es el esquema mongoose que define la estructura(propiedades) de la clase
// - el tercer parametro es el nombre de la coleccion en la base de datos MongoDB
exports.default = mongoose_1.default.model('Cliente', ClienteSchema, 'clientes');
//# sourceMappingURL=Cliente_Schema.js.map