import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { Registro } from './app/componentes/zonaCliente/Registro/registro';
//import { App } from './app/app';

bootstrapApplication(Registro, appConfig)
  .catch((err) => console.error(err));
