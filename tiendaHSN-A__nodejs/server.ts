//modulo de entrada de la apclicacion servidor nodejs en typescript
import 'dotenv/config'; //carga las variables de entorno desde el fichero .env
import express, { Express } from 'express';
import configurePipeline from './config_server_express/config_pipeline.js';

const serverExpress:Express=express();
configurePipeline(serverExpress);

serverExpress.listen(
    3000,
    (error: Error | undefined):void=>{
        if(error) { 
            console.log(`error al iniciar el servidor: ${error}`);
        } else {
            console.log(`...servidor web express iniciado en el puerto 3000....`);
        }
    }
);