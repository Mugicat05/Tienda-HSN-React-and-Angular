//modulo de codigo q exporta un objeto js con metodos para crear y verificar JWTs
const jwt = require("jsonwebtoken");
module.exports = {
  //metodo para crear un JWT
  crearToken: (payload, opcionesToken = {}) => {
    //payload: objeto js con los datos q quiero guardar en el token
    //opcionesToken: objeto js con opciones del token (caducidad, algoritmo cifrado...)
    const token = jwt.sign(
      payload, // <--- 1º parametro payload
      process.env.FIRMA_JWT_SERVER, // <--- 2º parametro clave secreta para cifrar y firmar el token
      opcionesToken // <--- 3º parametro opciones del token (caducidad, algoritmo cifrado...).
    );
    return token;
  },
  //metodo para verificar un JWT y aprovechamos y le vamos a reutiliar para renovar.
verificarTokenYRenovar: (tokenAcceso, tokenRefresh) => {
    try {
      const payload = jwt.verify(tokenAcceso, process.env.FIRMA_JWT_SERVER);
      return { clienteId: payload.clienteId, nuevoAccessToken: null };
    } catch (error) {
      console.error("AccessToken inválido:", error.message);

      try {
        const payloadRefresh = jwt.verify(tokenRefresh, process.env.FIRMA_JWT_SERVER);

        if (!payloadRefresh.clienteId) return null;

        const nuevoAccessToken = jwt.sign(
          { clienteId: payloadRefresh.clienteId },
          process.env.FIRMA_JWT_SERVER,
          { expiresIn: "15m" } //por ponerle un limite de tiempo
        );

        return { clienteId: payloadRefresh.clienteId, nuevoAccessToken };
      } catch (error2) {
        console.error("RefreshToken inválido:", error2.message);
        return null;
      }
    }
  },


  extraerTokenCabecera: (cabeceras) => {
    const valorTokenAcceso = cabeceras["authorization"]?.split(" ")[1] || "";
    const valorTokenRefresh = cabeceras["x-refresh-token"] || "";

    console.log("AccessToken recibido:", valorTokenAcceso);
    console.log("RefreshToken recibido:", valorTokenRefresh);

    return { valorTokenAcceso, valorTokenRefresh };
  },
};
