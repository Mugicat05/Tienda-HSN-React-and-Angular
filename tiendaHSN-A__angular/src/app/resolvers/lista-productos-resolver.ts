import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import IProducto from '../modelos/interfaces_ORM/IProducto';
import { FetchNode } from '../servicios/fetch-node';
import { inject } from '@angular/core';

export const listaProductosResolver: ResolveFn<IProducto[]> = (route:ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  //inyectamos servicio de acceso a node, invocamos endpoint para obtener lista de productos de una 
  // categoria dada...
  const fetchNode=inject(FetchNode);

  return [];
};
