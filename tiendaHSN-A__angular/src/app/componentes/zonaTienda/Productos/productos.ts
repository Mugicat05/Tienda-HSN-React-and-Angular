import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import IProducto from '../../../modelos/interfaces_ORM/IProducto';

@Component({
  selector: 'app-productos',
  imports: [],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit{
 //Para recuperar los componentes de Resolver asociado a la ruta que carga el componente, necesito inyectar el servicio ActivateRoute
 //la ruta que carga el componente tiene este formato: /tienda/Productos/:pathCategoria
 // el servicio tambien sirve para capturar los parametros pasados enqueryString:
 //si la ruta tiene este formato: /Tienda/Productos/:pathCategoria ? oferta=valor & publico=valor & ....
 // las variables: "oferta", "publico" <---- se recuperan por metodo .queryParaMap

 

 private activationRoute=inject(ActivatedRoute);
 
 //recuperacion datos resolver
 protected readonly productos:IProducto[] | [] = this.activationRoute.snapshot.data['listaProductos']
  
 //recuperacion segmento dinamico:
 protected readonly pathCategoria:string | null = this.activationRoute.snapshot.paramMap.get('pathCategoria');
  
  //recuperaciond e parametros queryString
  protected readonly oferta:string | null = this.activationRoute.snapshot.queryParamMap.get('oferta')
  protected readonly publico:string | null = this.activationRoute.snapshot.queryParamMap.get('publico')
 
 
 
  ngOnInit(): void {
   console.log('Productos cargados por el Resolve: ',this.productos)
   console.log('Seguimiento dinamico en la url, pathCategoria: ',this.pathCategoria)
   console.log('Obtencion de oferta: ',this.oferta)
   console.log('Obtencion de publico: ',this.publico)
 }
}
