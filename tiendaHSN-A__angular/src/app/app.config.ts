import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { misRutas } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { addTokensSessionInterceptor } from './interceptors/add-token-session-interceptor';
import { cacheRequestsInterceptor } from './interceptors/cache-requests-interceptor';

//modulo de codigo donde se configura la inyeccion de dependencias
//de objetos globlales para la aplicacion: servicios, ....
//por defecto angular ya proporciona algunos,
//el mas importante es el Router <---- servicio para invocar modulo de enrutamiento de angular
//y se configura con: provideRouter(routes)
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(misRutas), //<---- configuracion del servicio de enrutamiento en el modulo de inyeccion de dependencias
    provideHttpClient(withInterceptors([cacheRequestsInterceptor,addTokensSessionInterceptor])) //<------ configuracion del servicio HttpClient para hacer peticiones HTTP al servidor de nodejs
  ]
};
