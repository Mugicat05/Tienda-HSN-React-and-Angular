import { ActivatedRoute, ActivatedRouteSnapshot, ResolveFn, RouterState, RouterStateSnapshot } from '@angular/router';
import IProducto from '../modelos/interfaces_ORM/IProducto';
import { inject } from '@angular/core';
import { FetchNode } from '../servicios/fetch-node';

export const listaProductosResolver: ResolveFn<IProducto[]> = (route:ActivatedRouteSnapshot, state:RouterStateSnapshot) => {
  //inyectamos el servicio de acceso a node, invocamos endpoint para obtener lista de productos de una 
  // categoria dada...
  const fetchNode=inject(FetchNode);
  return [];
};
