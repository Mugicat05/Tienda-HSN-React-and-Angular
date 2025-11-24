import mongoose from 'mongoose';
declare const _default: mongoose.Model<{
    nombre: string;
    apellidos: string;
    genero: string;
    direcciones: any[];
    pedidos: any[];
    opiniones: any[];
    listaFavoritos: any[];
    metodosPago: any[];
    cuenta: {
        email: string;
        password: string;
        fechaCreacionCuenta: number;
        cuentaActivada: boolean;
        tipoCuenta: string;
        imageAvatar?: string | null;
        telefonoContacto?: string | null;
    };
    nifcif?: string | null;
    fechaNacimiento?: number | null;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    nombre: string;
    apellidos: string;
    genero: string;
    direcciones: any[];
    pedidos: any[];
    opiniones: any[];
    listaFavoritos: any[];
    metodosPago: any[];
    cuenta: {
        email: string;
        password: string;
        fechaCreacionCuenta: number;
        cuentaActivada: boolean;
        tipoCuenta: string;
        imageAvatar?: string | null;
        telefonoContacto?: string | null;
    };
    nifcif?: string | null;
    fechaNacimiento?: number | null;
}, {}, mongoose.DefaultSchemaOptions> & {
    nombre: string;
    apellidos: string;
    genero: string;
    direcciones: any[];
    pedidos: any[];
    opiniones: any[];
    listaFavoritos: any[];
    metodosPago: any[];
    cuenta: {
        email: string;
        password: string;
        fechaCreacionCuenta: number;
        cuentaActivada: boolean;
        tipoCuenta: string;
        imageAvatar?: string | null;
        telefonoContacto?: string | null;
    };
    nifcif?: string | null;
    fechaNacimiento?: number | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    nombre: string;
    apellidos: string;
    genero: string;
    direcciones: any[];
    pedidos: any[];
    opiniones: any[];
    listaFavoritos: any[];
    metodosPago: any[];
    cuenta: {
        email: string;
        password: string;
        fechaCreacionCuenta: number;
        cuentaActivada: boolean;
        tipoCuenta: string;
        imageAvatar?: string | null;
        telefonoContacto?: string | null;
    };
    nifcif?: string | null;
    fechaNacimiento?: number | null;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    nombre: string;
    apellidos: string;
    genero: string;
    direcciones: any[];
    pedidos: any[];
    opiniones: any[];
    listaFavoritos: any[];
    metodosPago: any[];
    cuenta: {
        email: string;
        password: string;
        fechaCreacionCuenta: number;
        cuentaActivada: boolean;
        tipoCuenta: string;
        imageAvatar?: string | null;
        telefonoContacto?: string | null;
    };
    nifcif?: string | null;
    fechaNacimiento?: number | null;
}>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<{
    nombre: string;
    apellidos: string;
    genero: string;
    direcciones: any[];
    pedidos: any[];
    opiniones: any[];
    listaFavoritos: any[];
    metodosPago: any[];
    cuenta: {
        email: string;
        password: string;
        fechaCreacionCuenta: number;
        cuentaActivada: boolean;
        tipoCuenta: string;
        imageAvatar?: string | null;
        telefonoContacto?: string | null;
    };
    nifcif?: string | null;
    fechaNacimiento?: number | null;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default _default;
//# sourceMappingURL=Cliente_Schema.d.ts.map