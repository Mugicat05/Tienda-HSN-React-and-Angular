import { Routes } from '@angular/router';
import { Productos } from './componentes/zonaTienda/Productos/productos';
import { listaProductosResolver } from './resolvers/lista-productos-resolver';
import { checkTokenGuard } from './guards/check-token-guard';
/*
modulo de codigo donde se definen las rutas de navegacion
de la aplicacion angular para el servicio Router de enrutamiento de angular
 se exporta un array de objetos "Route" de angular: https://angular.dev/api/router/Route
cada objeto "Route" define una ruta de navegacion
propiedades mas importantes de un objeto "Route":
    - path: string  <---- ruta de navegacion, puede tener segmentos estaticos y dinamicos, para indicarlos
        se usan los dos puntos ":" delante del nombre del segmento dinamico
        ej: /Tienda/MostrarProducto/:idProducto/:categoria
    - component: Type<any>  <---- componente angular que se renderiza cuando se navega a esa ruta  
    - loadComponent: () => Type<any> | Promise<Type<any>>  <---- funcion que carga dinamicamente los componentes segun se demanda: LAZY LOADING
    - children: Routes[]  <---- array de objetos "Route" que define rutas hijas para rutas anidadas
    - redirectTo: string  <---- ruta a la que se redirige cuando se navega a esta ruta

otras propiedades importantes:
    - resolve: ResolveData  <---- objeto que define los RESOLVERS(loaders de react) funciones que se ejecutan antes de activar la ruta para 
                                cargar datos necesarios para el componente; es un objeto de esta forma:
                                    { nombreDatos: nombreResolver, nombreDatos2: nombreResolver2, ....}

                                para recuperar los datos en el componente necesitas del servicio ActivatedRoute
    - canActivate, canActivateChild,... <---- son arrays de funciones GUARD; un "guard" es una funcion que bloquea el acceso a una ruta
                                            en funcion del codigo q tiene implementado; si devuelve:
                                            -  "true" permite el acceso y carga el componente de la ruta
                                            -  "false" no permite el acceso y no carga el componente de la ruta
                                            - puede devolver un objeto UrlTree o un string con la ruta a redireccionar (en vez de devolver false)
*/
export const misRutas: Routes = [
    { path: 'Cliente', 
      children:[
        { path:'Login', loadComponent: () => import('./componentes/zonaCliente/Login/login').then(m => m.Login) },
        { path:'Registro', loadComponent: () => import('./componentes/zonaCliente/Registro/registro').then(m => m.Registro) },
        { path: 'Cuenta',
          canActivate:[ checkTokenGuard ],
          children:[
                { path: 'MisDatos', loadComponent: ()=> import('./componentes/zonaCliente/Cuenta/MisDatos/misdatos').then( m=>m.Misdatos) }
            ]
        }
      ]
    },
    { path: 'Tienda', 
      children:[
        { path:'Productos/:pathCategoria', component: Productos, resolve:{ listaProductos: listaProductosResolver } }
      ]
    }
];
