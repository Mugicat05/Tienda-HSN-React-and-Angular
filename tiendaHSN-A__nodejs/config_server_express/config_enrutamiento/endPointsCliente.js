const express = require("express");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const bcrypt = require("bcrypt");
const jwtService = require("../servicios/jwtService");
const objetoRoutingCliente = express.Router();

objetoRoutingCliente.post("/Registro", async (req, res) => {
  try {
    await mongoose.connect(process.env.URL_MONGODB);

    const clienteExistente = await mongoose.connection
      .collection("clientes")
      .findOne({ "cuenta.email": req.body.email });
    if (clienteExistente) throw new Error("Ya existe un cliente con ese email");

    const nuevoCliente = {
      nombre: req.body.nombre,
      apellidos: req.body.apellidos,
      genero: req.body.genero,
      cuenta: {
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        cuentaActivada: false,
        imagenAvatar: "",
        fechaCreacionCuenta: Date.now(),
      },
      pedidos: [],
      listaDeseados: [],
      direcciones: [],
      metodosPago: [],
    };

    const resInsert = await mongoose.connection
      .collection("clientes")
      .insertOne(nuevoCliente);
    if (!resInsert.insertedId) throw new Error("Error al registrar el cliente");

    res.status(200).send({ codigo: 0, mensaje: "Registro correcto" });
  } catch (error) {
    res.status(200).send({ codigo: 1, mensaje: error.message });
  }
});

objetoRoutingCliente.get("/ActivarCuenta", async (req, res) => {
  try {
    const { email, idCliente } = req.query;
    if (!email || !idCliente)
      throw new Error("Faltan parámetros en la activación");

    await mongoose.connect(process.env.URL_MONGODB);

    const resUpdate = await mongoose.connection
      .collection("clientes")
      .updateOne(
        { "cuenta.email": email, _id: mongoose.Types.ObjectId(idCliente) },
        { $set: { "cuenta.cuentaActivada": true } }
      );

    res.redirect(
      "http://localhost:5173/Cliente/ActivacionCuenta?operacion=success"
    );
  } catch (error) {
    res.redirect(
      "http://localhost:5173/Cliente/ActivacionCuenta?operacion=failed"
    );
  }
});

objetoRoutingCliente.post("/ActualizarDatos", async (req, res) => {
  try {
    const {
      clienteId,
      nombre,
      apellidos,
      email,
      telefonoContacto,
      fechaNacimiento,
      genero,
      tipoCuenta,
      nombreEmpresa,
      nifcif,
      avatarUsuario,
    } = req.body;

    await mongoose.connect(process.env.URL_MONGODB);

    const resUpdate = await mongoose.connection
      .collection("clientes")
      .updateOne(
        { _id: new mongoose.Types.ObjectId(clienteId) },
        {
          $set: {
            nombre,
            apellidos,
            fechaNacimiento,
            genero,
            tipoCuenta,
            nombreEmpresa,
            nifcif,
            "cuenta.email": email,
            "cuenta.telefonoContacto": telefonoContacto,
            "cuenta.imagenAvatar": avatarUsuario,
          },
        }
      );

    if (resUpdate.modifiedCount === 0)
      throw new Error("No se pudo actualizar el cliente");

    const clienteActualizado = await mongoose.connection
      .collection("clientes")
      .findOne({ _id: new mongoose.Types.ObjectId(clienteId) });

    res.status(200).send({
      codigo: 0,
      mensaje: "Datos actualizados correctamente",
      clienteActualizado,
    });
  } catch (error) {
    res.status(200).send({
      codigo: 1,
      mensaje: `Error al actualizar datos: ${error.message}`,
    });
  }
});

objetoRoutingCliente.post("/Login", async (req, res) => {
  try {
    const { email, password } = req.body;
    await mongoose.connect(process.env.URL_MONGODB);

    const cliente = await mongoose.connection
      .collection("clientes")
      .findOne({ "cuenta.email": email });
    if (!cliente) throw new Error("Email no registrado");

    if (!bcrypt.compareSync(password, cliente.cuenta.password))
      throw new Error("Password incorrecta");

    if (!cliente.cuenta.cuentaActivada)
      throw new Error("Cuenta no activada. Revisa tu email.");
    const payload = {
      clienteId: cliente._id.toString(),
      email: cliente.cuenta.email,
    };

    const accessToken = jwtService.crearToken(payload, { expiresIn: "15m" });
    const refreshToken = jwtService.crearToken(payload, { expiresIn: "7d" });

    res.status(200).send({
      codigo: 0,
      mensaje: "Login correcto",
      datosCliente: cliente,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(200).send({ codigo: 3, mensaje: error.message });
  }
});

objetoRoutingCliente.post("/Direccion", async (req, res) => {
  try {
    //verificamos el token
    const { valorTokenAcceso, valorTokenRefresh } =
      jwtService.extraerTokenCabecera(req.headers);
    const resultado = jwtService.verificarTokenYRenovar(
      valorTokenAcceso,
      valorTokenRefresh
    );

    if (!resultado) {
      return res
        .status(401)
        .send({ codigo: 401, mensaje: "Token inválido. Requiere login." });
    }

    const { clienteId, nuevoAccessToken } = resultado;
    if (nuevoAccessToken) res.setHeader("X-ACCESS-TOKEN", nuevoAccessToken);

    if (!ObjectId.isValid(clienteId)) {
      return res
        .status(400)
        .send({ codigo: 1, mensaje: "El ID del cliente no es válido" });
    }

    //obtenemos cliente
    await mongoose.connect(process.env.URL_MONGODB);
    const cliente = await mongoose.connection
      .collection("clientes")
      .findOne({ _id: new ObjectId(clienteId) });
    if (!cliente)
      return res
        .status(404)
        .send({ codigo: 1, mensaje: "Cliente no encontrado" });

    let direcciones = cliente.direcciones || [];

    // en caso de que tiene id, pues no le hacemos nada.  Y en caso de que no tiene lo buca como _id
    direcciones = direcciones.map((d) => {
      if (!d._id) d._id = d.id || new ObjectId();
      return d;
    });

    //funcion del switch
    const { accion, payload } = req.body;
    switch (accion) {
      case "añadirDireccion":
        if (!payload) throw new Error("Falta el payload para añadir");
        if (payload.esPrincipal)
          direcciones = direcciones.map((d) => ({ ...d, esPrincipal: false }));
        if (payload.esFacturacion)
          direcciones = direcciones.map((d) => ({
            ...d,
            esFacturacion: false,
          }));
        payload._id = payload._id || new ObjectId();
        direcciones.push(payload);
        break;

      case "modificarDireccion":
        if (!payload) throw new Error("Falta el payload para modificar");
        let idParaModificar = payload._id || payload.id;
        if (!idParaModificar)
          throw new Error("No se pudo encontrar la dirección a modificar.");
        if (payload.esPrincipal)
          direcciones = direcciones.map((d) => ({ ...d, esPrincipal: false }));
        if (payload.esFacturacion)
          direcciones = direcciones.map((d) => ({
            ...d,
            esFacturacion: false,
          }));
        direcciones = direcciones.map((d) =>
          d._id?.toString() === idParaModificar ? { ...d, ...payload } : d
        );
        break;

      case "eliminarDireccion":
        if (!payload)
          throw new Error("Falta el payload de la dirección a eliminar");
        let idParaBorrar = payload._id || payload.id;
        if (!idParaBorrar)
          throw new Error("No se pudo encontrar la dirección a eliminar.");
        direcciones = direcciones.filter(
          (d) => d._id?.toString() !== idParaBorrar
        );
        break;

      default:
        throw new Error("Acción no reconocida");
    }

    //guardar cambios
    await mongoose.connection.collection("clientes").updateOne(
      { _id: new ObjectId(clienteId) }, //no se porque pone esa linea de ObjectId, no he sido capaz de quitarlo,
        { $set: { direcciones } }                //  segun la ia, el visual quiere ponerlo de esta manera
    );                                            /*const { Types } = require("mongoose");
                                                   Types.ObjectId(clienteId); 
                                                       */             
     
    const clienteActualizado = await mongoose.connection
      .collection("clientes")
      .findOne({ _id: new ObjectId(clienteId) });

    res.status(200).send({
      codigo: 0,
      mensaje: "Acción ejecutada correctamente",
      clienteActualizado,
    });
  } catch (error) {
    console.error(`Error en /Direccion: ${error.message}`);
    res.status(400).send({ codigo: 1, mensaje: error.message });
  }
});

module.exports = objetoRoutingCliente;
