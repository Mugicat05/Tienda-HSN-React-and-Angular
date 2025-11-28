import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot, GuardResult, MaybeAsync, RouterStateSnapshot } from '@angular/router';

export const checkTokenGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> => {
  // inyectar el servicio que maneja el state-global, intentar recuperar accessToken + refreshToken, si existen
  // devuelvo true, sino redirijo al login... El tipo de dato GuardResult: booleano o un UrlTree o RedirectCommand
  // - para crear un objeto UrlTree puedes usar la funcion angular:
  //       createUrlTreeFromSnapshot  <-- usa objeto activatedRouteSnapshot y crea url de redirección
  //return createUrlTreeFromSnapshot(route.root | state.root  ,['/Cliente/Login'])
  //

  console.log('valor del parametro 1, objeto route:ActivatedRouteSnapshot... ',route);
  console.log('valor del parametro 1, objeto state:RouterStateSnapshot... ',state);
  return createUrlTreeFromSnapshot(route.root ,['/Cliente/Login']);

  //return false; // <---- si es true, el guard permite acceso, si es false no permite acceso, pero no muestra error ni nada
};
