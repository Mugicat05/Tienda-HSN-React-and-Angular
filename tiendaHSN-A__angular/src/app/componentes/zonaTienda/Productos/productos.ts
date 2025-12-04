import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import IProducto from '../../../modelos/interfaces_ORM/IProducto';

@Component({
  selector: 'app-productos',
  imports: [],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {
 //para recuperar los datos del RESOLVER asociado a la ruta que carga el componente, necesito inyectar el servicio ActivatedRoute
 //la ruta que carga el componente tiene este formato:  /Tienda/Productos/:pathCategoria
 
 //el servicio tambien sirve para capturar los parametros pasados en el queryString:
 //si la ruta tiene este formato: /Tienda/Productos/:pathCategoria ? oferta=valor & publico=valor & ...
 //las variables: "oferta", "publico" <---- se recuperan por metodo .queryParamMap
 private activatedRoute=inject(ActivatedRoute);

 //recuperacion datos resolver:
 protected readonly productos:IProducto[] | [] = this.activatedRoute.snapshot.data['listaProductos'];
 
 //recuperacion segmento dinamico:
 protected readonly pathCategoria: string | null = this.activatedRoute.snapshot.paramMap.get('pathCategoria');
 
 //recuperacion parametros querystring:
 protected readonly oferta:string | null = this.activatedRoute.snapshot.queryParamMap.get('oferta');
 protected readonly publico:string | null = this.activatedRoute.snapshot.queryParamMap.get('publico');


 ngOnInit(): void {
  console.log('Productos cargados por el resolver....', this.productos);
  console.log('Segmento dinamico en la url, pathCategoria....', this.pathCategoria);
  console.log('variable querystring oferta....', this.oferta);
  console.log('variable querystring publico....', this.publico);
}


}
