import { inject, Injectable } from '@angular/core';
import IRespuestaNode from '../modelos/IRespuestaNode';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//---si definees todas las interfaces en un solo archivo: 
//import { IRespuestaNode, IFormRegistro } from '../modelos/Interfaces';

//la definicion del metodo Registro seria asi:
//public Registro( datosRegistro: IFormRegistro ): IRespuestaNode {}


//---si defines las interfaces en este archivo de forma local, no visibles para otros archivos:
// interface IRespuestaNode {
//   codigo: string,
//   mensaje: string,
//   datos?: any
// }


@Injectable({ //<---------decorador que nada mas arrancar la app se crea una instancia de la clase y la introduce en el DI 
  providedIn: 'root', //<----- esta propiedad indica que el servicio estara disponible en toda la aplicacion
})
export class FetchNode {
  
  //solicitamos al DI que nos inyecte el servicio HttpClient para hacer peticiones HTTP al servidor Node.js
  //usualmente se hace en el constructor de la clase servicio
  //constructor( private http: HttpClient ) {} //<---- ojo private para que se cree la propiedad http en la clase

  private http=inject(HttpClient);

  public Registro( datosRegistro: { 
                                    nombre:string,
                                    apellidos: string,
                                    email: string,
                                    password: string,
                                    planAmigo?: string,
                                    genero: string                                    
                                   } ): Observable<IRespuestaNode> {
      //para hacer la petcion HTTP-REQUEST al servidor Node.js angular obliga a uar un servicio predefinido
      //llamado: HttpClient  <--- HAY QUE HABILITARLO en app.config.ts en providers
      
      //#region ----esto no funciona porque las peticiones HTTP son asincronas y el metodo Registro es sincrono ----
      // let respuesta:IRespuestaNode | null=null;
      
      // this.http
      //     .post<IRespuestaNode>(
      //             'http://localhost:3000/api/Cliente/Registro', 
      //             datosRegistro,
      //             { 
      //               headers: {
      //                    'Content-Type': 'application/json' 
      //                   }
      //              }
      //             )
      //     .subscribe( //<----- metodo que "pincha" el observable y recupera los datos que viajan por el flujo de datos, en nuestro caso objetos IRespuestaNode
      //               //al objeto q manipula los datos del observable se le llama "observer" y tiene 3 metodos:
      //       {
      //         next: (dato:IRespuestaNode) => { console.log('Respuesta del servidor Node.js: ', dato); respuesta = dato;},
      //         error: (mensajeError:any) => { console.log('Error en la peticion HTTP: ', mensajeError); },
      //         complete: ()=> { console.log('Peticion HTTP completada, no hay mas datos'); }
      //       }
      //     );

      //     return respuesta!;
      //#endregion
    
      return this.http
                  .post<IRespuestaNode>(
                          'http://localhost:3000/api/Cliente/Registro', 
                          datosRegistro,
                          { 
                            headers: {
                                'Content-Type': 'application/json' 
                                }
                          }
                          );

  }

  public Login( email: string, password: string ): Observable<IRespuestaNode> {
    return this.http
                .post<IRespuestaNode>(
                        'http://localhost:3000/api/Cliente/Login', 
                        { email, password },
                        {
                          headers: {
                              'Content-Type': 'application/json' 
                              }
                        }
                  );
  }  

}
