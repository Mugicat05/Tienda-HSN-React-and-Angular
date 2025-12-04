import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot, GuardResult, MaybeAsync, RedirectCommand, Router, RouterStateSnapshot } from '@angular/router';

export const checkTokenGuard: CanActivateFn = (route:ActivatedRouteSnapshot, state:RouterStateSnapshot):MaybeAsync<GuardResult> => {
  //inyectar el servicio que maneja el state-global, intentar recuperar accessToken + refreshToken, si existen
  //devuelvo true, sino redirijo al Login...El tipo de dato GuardResult: booleano o un UrlTree o RedirectCommand
  // - para crear un objeto UrlTree puedes usar la funcion angular:
  //          createUrlTreeFromSnapshot  <--- usa objeto activatedRouteSnapshot y crea url de redireccion https://angular.dev/api/router/createUrlTreeFromSnapshot    
  //  return createUrlTreeFromSnapshot(route.root || state.root, ['/Cliente/Login']);
  //
  // - tambien puedes devolver un objeto RedirectCommand: https://angular.dev/api/router/RedirectCommand
  //  const router=inject(Router);
  //  return new RedirectCommand( router.parseUrl('/Cliente/Login'));
  
  console.log('valor del parametro 1, objeto route:ActivatedRouteSnapshot...', route);
  console.log('valor del parametro 2, objeto state:RouterStateSnapshot...', state);
  
  //return true; //<---- si es true, el guard permite acceso, si es false no permite acceso, pero no muestra error ni nada
  //return createUrlTreeFromSnapshot(route.root, ['/Cliente/Login']);
  return true;
};
