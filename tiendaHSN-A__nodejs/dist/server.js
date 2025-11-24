"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//modulo de entrada de la apclicacion servidor nodejs en typescript
require("dotenv/config"); //carga las variables de entorno desde el fichero .env
const express_1 = __importDefault(require("express"));
const config_pipeline_js_1 = __importDefault(require("./config_server_express/config_pipeline.js"));
const serverExpress = (0, express_1.default)();
(0, config_pipeline_js_1.default)(serverExpress);
serverExpress.listen(3000, (error) => {
    if (error) {
        console.log(`error al iniciar el servidor: ${error}`);
    }
    else {
        console.log(`...servidor web express iniciado en el puerto 3000....`);
    }
});
//# sourceMappingURL=server.js.map