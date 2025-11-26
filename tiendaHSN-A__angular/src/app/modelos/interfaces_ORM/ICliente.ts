import  IProducto  from "./IProducto";
import  IPedido  from "./IPedido";
import  IDireccion  from "./IDireccion";

export default interface ICliente {
    _id:             string;
    nombre:          string;
    apellidos:       string;
    genero:          string;
    cuenta:          Cuenta;
    direcciones:     IDireccion[];
    pedidos:         IPedido[];
    listaFavoritos:  any[];
    metodosPago:     any[];
    nifcif:          string;
    fechaNacimiento: Date;
    opiniones:       any[];
}


export interface Cuenta {
    email:               string;
    password:            string;
    cuentaActivada:      boolean;
    fechaCreacionCuenta: number;
    telefonoContacto:    string;
    tipoCuenta:          string;
    imagenAvatar:        string;
}
    
