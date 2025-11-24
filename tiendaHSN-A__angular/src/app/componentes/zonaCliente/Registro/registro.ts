import { JsonPipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FetchNode } from '../../../servicios/fetch-node';
import { Subscription } from 'rxjs';
import IRespuestaNode from '../../../modelos/IRespuestaNode';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-registro',
  imports: [ ReactiveFormsModule, JsonPipe],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro implements OnInit, OnDestroy {
  //inputs: Array<string>= [ 'nombre', 'apellidos', 'email', 'password', 'planAmigo' ] //string[]
  //FormGroup de registro de usuario a mapear con <form...>
  
  //inyectamos el servicio FetchNode para hacer peticiones HTTP al servidor Node.js
  //constructor( private fetchNode: FetchNode ) {}
  private fetchNode=inject(FetchNode);
  private idFlujoRegistro:Subscription | null=null;
  private respuestaRegistro:IRespuestaNode | null=null;
  
  miform:FormGroup=new FormGroup(
    {
      nombre: new FormControl('',[ Validators.required, Validators.minLength(3),Validators.maxLength(20)] ), //<--- objeto FormControl mapea a <input name='nombre' usando directiva FormControlName: formControlName="nombre_FormControl"
      apellidos: new FormControl( '',[ Validators.required, Validators.minLength(3),Validators.maxLength(50)] ),
      email: new FormControl('',[ Validators.required, Validators.email ] ),
      password: new FormControl( '',[ Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$')] ),
      planAmigo: new FormControl(),
      genero: new FormControl('',[ Validators.required]),
    }
  );
  
  ngOnDestroy(): void {
    console.log('Componente Registro destruido...');
    //si existe la subscripcion al flujo de datos de registro la cancelamos/cerramos
    if( this.idFlujoRegistro ){
      this.idFlujoRegistro.unsubscribe();
      console.log('Subscripcion al flujo de datos de registro cancelada');
    }
  }

  async ngOnInit(): Promise<void> {
    console.log('Componente Registro cargado y listo...');
    let respuestaAlert:any=await Swal.fire(
      {
        title:'Componente Registro cargado y listo',
        icon:'info',
        timer: 2000,
        timerProgressBar:true,
        showConfirmButton:false
      }
    );
    console.log('Respuesta alerta Swal.fire(): ', respuestaAlert);
  }

  SubmitRegistro(){
    console.log('datos del formulario de registro a mandar a nodejs...', this.miform.value);
    console.log('controles del formulario ...', this.miform.controls);
    this.idFlujoRegistro=this.fetchNode
                            .Registro( this.miform.value )
                            .subscribe(
                              (datos:IRespuestaNode) => {
                                console.log('Respuesta del servidor Node.js: ', datos);
                                this.respuestaRegistro=datos;
                                //inspeccionamos la propiedad 'codigo' de la respuesta, si es 0 es que el registro ha sido correcto
                                //podemos redireccionalar al usuario a la pagina de login
                                if( this.respuestaRegistro.codigo===0 ){
                                  console.log('Registro correcto, redireccionamos a login...');
                                } else {
                                  //sino mostramos el mensaje de error en la vista  

                                  }
                              }
                            )
  }
}
