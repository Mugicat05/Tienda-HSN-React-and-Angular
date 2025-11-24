//modulo de codigo de definicion de los endpoints (rutas) de la zona cliente
// para el servidor web express con las funciones middleware que los gestionan
import express,{Router} from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Cliente from '../../modelos/modelos_ORM_mongoose/Cliente_Schema.js';
import IDatosRegistro from '../../modelos/interfaces/IDatosRegistro.js';

const objetoRoutingCliente:Router=express.Router();

objetoRoutingCliente.post('/Registro', async (req, res) => {
    //logica para gestionar el endpoint /api/Cliente/Registro
    try {
        //1º recuperar los datos enviados por el cliente en el cuerpo de la peticion http POST del req.body
        //conectarnos a la base de datos y guardar los datos del cliente
        //const datos:IDatosRegistro=req.body;
        const { nombre, apellidos, genero, email, password, planAmigo } = req.body as IDatosRegistro;
        await mongoose.connect(process.env.URL_MONGDOB!);

        const nuevoCliente=new Cliente(
            {
                nombre,
                apellidos,
                genero,
                cuenta: {
                    email,
                    password: bcrypt.hashSync(password, 10), //cifrar la password con bcrypt
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
            }
        );
        const resInsert:any=await nuevoCliente.save();
        console.log('Resultado de insertar nuevo cliente en la BBDD:', resInsert);
        //2º enviar email de activacion de la cuenta al email del cliente

        //3º enviar respuesta al cliente con codigo de exito
        res.status(200).send({ codigo:0,  mensaje: 'Registro de datos cliente exitoso' });        

    } catch (error) {
        console.error('Error en /api/Cliente/Registro:', error);
        res.status(200).send({ codigo:1,  mensaje: 'Error interno del servidor al registrar datos cliente' });        
    }
});

export default objetoRoutingCliente;