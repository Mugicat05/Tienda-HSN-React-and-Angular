const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();
const BASE_URL = "http://apiv1.geoapi.es";

router.post("/geoapi", async (req, res) => {
  try {
    const { accion, codigoProvincia } = req.body;

    switch (accion) {
      case "obtenerProvincias":
        {
          const response = await axios.get(`${BASE_URL}/provincias`, {
            params: {
              key: process.env.GEOAPI_KEY,
              format: "json",
              version: process.env.GEOAPI_VERSION
            }
          });
          const provincias = response.data?.data || [];
          res.json(provincias);
        }
        break;

      case "obtenerMunicipios":
        {
          if (!codigoProvincia) throw new Error("Falta el código de provincia");
          const response = await axios.get(`${BASE_URL}/municipios`, {
            params: {
              CPRO: codigoProvincia,
              key: process.env.GEOAPI_KEY,
              format: "json",
              version: process.env.GEOAPI_VERSION
            }
          });
          const municipios = response.data?.data || [];
          res.json(municipios);
        }
        break;

      default:
        res.status(400).send("Acción no reconocida");
    }
  } catch (error) {
    console.error("Error en /geoapi:", error.message);
    res.status(500).send(`Error en /geoapi: ${error.message}`);
  }
});

module.exports = router;
