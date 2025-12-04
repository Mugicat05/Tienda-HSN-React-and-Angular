import { Component, inject } from '@angular/core';
import { FetchNode } from '../../../../servicios/fetch-node';
import IRespuestaNode from '../../../../modelos/IRespuestaNode';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [ AsyncPipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private fetchNode = inject(FetchNode);

  public categoriasPrincipales$ = this.fetchNode
                                      .GetCategorias('principales')
                                      .pipe(
                                        map( (resp:IRespuestaNode) => resp.codigo==0 ? resp.datos?.categorias : [] )
                                      );
}
