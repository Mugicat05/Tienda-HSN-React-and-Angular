import {
  HttpEvent,
  HttpEventType,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import IRespuestaNode from '../modelos/IRespuestaNode';

//los interceptores son funciones que se ejecutan antes de enviar una peticion HTTP
// o despues de recibir una respuesta HTTP
// son funciones que toman 2 parametros:
//  - req: HttpRequest<any>  <---- objeto que representa la peticion HTTP que le llega al interceptor y que puede
//                            modificar antes de enviarla al servidor o al siguiente interceptor
//                          OJO!!! este parametro es INMUTABLE, por lo que para modificar la peticion
//                          hay que crear una copia modificada de la peticion usando el metodo "clone()" del objeto HttpRequest

//  - next: HttpHandlerFn  <---- funcion que sirve para pasar la peticion al siguiente interceptor en la cadena de interceptores o bien al backend
//                            y a su vez recibir la respuesta HTTP que devuelve el backend o el siguiente interceptor
//                          a esta funcion le llegan como datos los diferentes eventos del procesamiento de la peticion HTTP, como es un flujo
//                          de datos, esta funcion devuelve un Observable<HttpEvent<any>> que emite los diferentes eventos de la respuesta HTTP

// la funcion del interceptor debe devolver un Observable<HttpEvent<any>>, de eventos de procesamiento de la respuesta
export const addTokensSessionInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  console.log(
    'INTERCEPOR ADD TOKENS SESSION - antes de enviar la peticion HTTP al servidor, valor de req:',
    req
  );
  const accessToken = ''; // aqui iria el codigo para obtener el acces token de la sesion del servicio almacenamiento global
  const refreshToken = ''; // aqui iria el codigo para obtener el refresh token de la sesion del servicio almacenamiento global
  if (accessToken && refreshToken) {
    //si tenemos tokens de inicio sesion, lo añadimos a la cabecera de la peticion HTTP
    req = req.clone({
      headers: req.headers

        .set('Authorization', `Bearer ${accessToken}`)
        .set('X-Refresh-Token', refreshToken),
    });
  }

  //mostramos los eventos de la respuesta HTTP que se reciben en el interceptor o bien desde el servidor o bien desde el siguiente interceptor:

  //esto KASKA!!! yo no puedo devolver un objeto Subscription desde aqui q es lo que hacemos al intentar "pinchar" el observable con el metodo subscribe
  // para ver sus valores:
  //return next(req).subscribe( (ev: HttpEvent<any>) => console.log('INTERCEPTOR ADD TOKENS SESSION - evento de respuesta HTTP recibido:', ev) );

  //para hacerlo tengo q usar los operadores de RXJS para manipular los observables para manipular los datos q van por el observable
  //y devolver otro observable que puede estar modificado o no...para usar los operadores de RXJS tengo q usar el metodo "pipe()" del observable
  //y dentro del metodo usas los operadores de RXJS que quieras utillizar para manipular los datos del observable
  return next(req).pipe(
    //tap <---- operardor de RXJS q recoge el valor del observable, ejecuta la funcion q tiene dentro y lo devuelve sin modificar
    tap((ev: HttpEvent<any>) =>
      console.log('INTERCEPTOR ADD TOKENS SESSION - evento de respuesta HTTP recibido:', ev)
    )
    //map <---- operador de RXJS q recoge el valor del observable, ejecuta la funcion q tiene dentro para modificarlo y lo devuelve modificado
    // map( (ev:HttpEvent<any>) => {
    //   //aqui puedes modificar el evento de respuesta HTTP si quieres
    //   if( ev.type === HttpEventType.Response ){ //<---- asi detectamos que al interceptor le ha llegado el evento de respuesta HTTP final
    //                                             //en el body del evento esta la respuesta HTTP completa y tiene el formato:
    //                                             //IRespuestaNode
    //     //el evento es de respuesta, puedes modificar el cuerpo de la respuesta si quieres
    //
    //ev.body <---- aqui tienes el cuerpo de la respuesta HTTP
    //     console.log('INTERCEPTOR ADD TOKENS SESSION - evento de respuesta HTTP es de tipo RESPONSE, cuerpo de la respuesta:', ev.body );
    //     const { codigo, mensaje, datos } = ev.body as IRespuestaNode;
    //     ev = ev.clone( { body: datos } );
    //     //modificamos el cuerpo de la respuesta para devolver solo los datos al componente que hizo la peticion HTTP
    //     return ev;
    //   }
    //   return ev;
    // }
    //)
    //switchMap
    //mergeMap
    //concatMap
  );
};
