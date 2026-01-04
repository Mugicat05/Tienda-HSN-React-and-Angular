import { Injectable, signal, WritableSignal } from '@angular/core';
import ICliente from '../modelos/interfaces_ORM/ICliente';
import IJwtTokens from '../modelos/IJwtTokens';
import IPedido from '../modelos/interfaces_ORM/IPedido';

@Injectable({
  providedIn: 'root',
})
export class StorageGlobal {
  //definimos como props. privadas las variables de almacenamiento global para datos del cliente y tokens...
  //lo hacemos con señales para versiones actuales de Angular, antiguas usaban BehaviorSubject
  private _cliente:WritableSignal<ICliente|null> = signal<ICliente|null>(null);
  private _tokens: WritableSignal<IJwtTokens | null> = signal<IJwtTokens | null>(null);

  private _inicioCarrito:IPedido={ itemsPedido:[], subtotal:0, gastosEnvio:0, total:0 };
  private _carrito:WritableSignal<IPedido>=signal<IPedido>(this._inicioCarrito); // <---- señal para almacenar el pedido/carrito actual

  //#region ------ metodos para manipular los datos del alamacenamiento global ------
  GetDatosCliente(): WritableSignal<ICliente | null> {
    //tengo q comprobar q si por la señal no hay datos del cliente, ha podido haber un REFRESH de la pagina
    //y en ese caso, recuperar los datos del cliente del localStorage
    //y los almaceno en la señal 2 formas: 
    // con set(nuevo_Valor) ==> asignando directamente a la propiedad de la señal
    // o con update( (valorAntiguo:tipo)=> { ....; return nuevovalor; } );
    if (this._cliente() == null) {
      const datosCliente = JSON.parse(localStorage.getItem('cliente') || 'null');
      this._cliente.set(datosCliente);
    }
    return this._cliente;
  }

  GetTokens(): WritableSignal<IJwtTokens | null> {
    if (this._tokens() == null) {
      const tokens = JSON.parse(localStorage.getItem('tokens') || 'null');
      this._tokens.set(tokens);
    }
    return this._tokens;
  }

  EstablecerDatosCliente(cliente: ICliente | null): void {
    //this._cliente.set(cliente); <----- con .set() machaca directamente el valor de la señal antiguo por el nuevo
    this._cliente.update((datosClienteViejos:ICliente | null) =>  {
      if(datosClienteViejos){
        return {...datosClienteViejos, ...cliente};
      } else {
        return cliente;
      }
    }); // <---- con .update() podemos actualizar el valor antiguo
    //lo almacenamos tambien en el localStorage para persistencia ante refresh de pagina
    if (cliente) {
      localStorage.setItem('cliente', JSON.stringify(cliente));
    } else {
      localStorage.removeItem('cliente');
    }
  }

  EstablecerTokens(tokens: IJwtTokens | null): void {
    //this._tokens.set(tokens);
    this._tokens.update((tokensViejos: IJwtTokens | null) => {
      if (tokensViejos) {
        return { ...tokensViejos, ...tokens };
      } else {
        return tokens;
      }
    });
    if (tokens) {
      localStorage.setItem('tokens', JSON.stringify(tokens));
    } else {
      localStorage.removeItem('tokens');
    }
  }

  GetCarrito(): WritableSignal<IPedido> {
    //si no hay carrito en la señal, puede ser por refresh de pagina, lo recupero del localStorage
    if (this._carrito().itemsPedido.length === 0) {
      const carrito = JSON.parse(localStorage.getItem('carrito') || 'null');
      this._carrito.set(carrito);
    }
    return this._carrito;
  }

  EstablecerItemsCarrito( operacion:string, item:{producto:any, cantidad:number} ): void {
    //operacion puede ser 'add' para añadir item al carrito o 'remove' para eliminar item del carrito y 'modify' para modidicar cantidad
    const posItem= this._carrito().itemsPedido.findIndex( it => it.producto._id === item.producto._id );
    let itemsPedidoActual= this._carrito().itemsPedido;

    switch(operacion){
      case 'add':
        posItem == -1 ? itemsPedidoActual.push(item) : itemsPedidoActual[posItem].cantidad += item.cantidad;  
        break;
      
      case 'modify':
        if(posItem !== -1){
          itemsPedidoActual[posItem].cantidad = item.cantidad;
        }
        break;

      case 'remove':
        if(posItem !== -1){
          itemsPedidoActual=itemsPedidoActual.filter( i => i.producto._id !== item.producto._id );
          //itemsPedidoActual.splice(posItem, 1);
        }
        break;
    }
    //recalculo subtotal, gastos de envio y total
    const _Subtotal= itemsPedidoActual.reduce( (acum, it) => acum + ( it.producto.Precio * (1 - it.producto.Oferta/100) * it.cantidad), 0 );
    const _total=_Subtotal + this._carrito().gastosEnvio;

    //actualizo la señal del carrito, para hacerlo usas metodos o .set() <---- necesitas pasar un nuevo objeto
    //  o .update() <------ pasas una funcion q recibe el valor antiguo y devuelve el nuevo
    this._carrito.set( 
                      { 
                        ...this._carrito(),
                        itemsPedido: itemsPedidoActual, 
                        subtotal: _Subtotal, 
                        total: _total 
                    }
   );
   //almaceno tambien en localStorage para persistencia ante refresh de pagina
   localStorage.setItem('carrito', JSON.stringify( this._carrito() ) );

  }

  //#endregion
}
