import { Component, ElementRef, inject, OnDestroy, OnInit, viewChild } from '@angular/core';
import { FormsModule, NgForm, NgModel, Validators } from '@angular/forms';
import { FetchNode } from '../../../servicios/fetch-node';
import IRespuestaNode from '../../../modelos/IRespuestaNode';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule], //<--- modulo necesario para trabajar con template-forms y directivas ngModel, ngForm, ....
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit, OnDestroy {
  
  private fetchNode=inject(FetchNode);
  private router:Router=inject(Router);

  private loginSubscriptor:Subscription | null=null;


  showPassword: boolean = false;
  
  //definimos propiedad objeto modelo a mapear con inputs del formulario basados en TEMPLATE-FORMS
  //OJO!!! todas las validaciones se basan en atributos HTML5 y directivas Angular (ngModel, ngForm, required, pattern, minlength, etc...)
  //si quieres validaciones mas complejas puedes convertir el formulario a REACTIVE-FORMS <==== pero para esto usas directamente ya ReactiveFormsModule
  modeloLogin:{ email:string, password:string } = { email:'', password:'' };
  
  //si quiero añadir validaciones personalizadas a las variables template de los inputs, puedo mapearlos contra objetos FormControl al uso de los formularios reactivos
  //usas funcion "viewChild" para mapear las variables template de los inputs a objetos FormControl
  emailFormControl=viewChild<NgModel>('email');
  passwordFormControl=viewChild<NgModel>('password');
  divErrores=viewChild<ElementRef>('divErrores'); //<---- referencia al div donde mostrar errores de login
 
  
  ngOnInit(): void {
    //aqui añado validaciones personalizadas a los inputs del formulario basados en TEMPLATE-FORMS
    //si necesitas ya hacer esto usa mejor REACTIVE-FORMS <==== pero para esto usas directamente ya ReactiveFormsModule
    //this.emailFormControl()?.control.setValidators([ Validators.email, Validators.required ]); //aqui puedes añadir validadores personalizados si quieres
    //this.passwordFormControl()?.control.setValidators([ Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&]).{6,}$/), Validators.required ]); //aqui puedes añadir validadores personalizados si quieres
  }
 
ngOnDestroy(): void {
    if (this.loginSubscriptor) {
      this.loginSubscriptor.unsubscribe();
    }
  }
  

 SubmitLogin(datosFormulario: NgForm) {
    // console.log('Formulario enviado con datos: ', datosFormulario.value);
    // console.log('Estado validaciones formulario: ', datosFormulario.valid);
    // console.log('Modelo login mapeado: ', this.modeloLogin);
    this.loginSubscriptor = this.fetchNode
                                .Login(this.modeloLogin.email, this.modeloLogin.password)
                                .subscribe(
                                  ( respuesta:IRespuestaNode ) => {
                                      console.log('Respuesta del servidor Node.js: ', respuesta);
                                      if ( respuesta.codigo === 0 ) {
                                        //login correcto almaceno datos cliente en el state-global con accessToken y refreshToken...
                                        
                                        //redirecciono a la tienda...
                                        //this.router.navigate(['/Tienda/MostrarProducto', idProducto]); <---- /Tiemda/MostrarProducto/1234534324
                                        //this.router.navigateByUrl(`/Tienda/MostrarProducto/${idProducto}`);
                                        this.router.navigateByUrl('/Tienda/Home');
                                      } else {
                                        //muestro mensaje de error al usuario...o con sweetalert2 o en la vista en un div para mostrar el error...
                                        // Swal.fire({
                                        //   icon: 'error',
                                        //   title: 'Error en login',
                                        //   text: respuesta.mensaje
                                        // });
                                        this.divErrores()!.nativeElement.innerText = respuesta.mensaje;

                                      }
                                  }
                                );
  }
 
  LoginWithGoogle() {}
}
