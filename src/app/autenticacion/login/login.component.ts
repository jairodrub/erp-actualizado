import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms'
import { AutenticacionService } from '../../servicios/autenticacion.service';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations'; // Animaciones

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('alerta', [ // alerta la hemos definido en HTML antes
      state('show', style({opacity: 1})), // El estado en el que está
      state('hide', style({opacity: 0})),
      transition('show => hide', animate('500ms ease-out')), // Cuando pasemos de show a hide...
      transition('hide => show', animate('500ms ease-in')) // Cuando pasemos de hide a show...
    ]) 
  ]// Lleva un array por si lleva varias animaciones
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  usuario: any;
  mensaje: string = 'Error de conexión con el servidor';
  mostrarAlerta:boolean = false;
  enviando:boolean = false;
  sesion:any; // any para que no nos moleste

  constructor(private fl: FormBuilder,
    private autenticacionService: AutenticacionService,
    private router: Router) { }

  ngOnInit() {
    this.loginForm = this.fl.group({
      email: ['', Validators.email],
      password: ['', Validators.required]
    })
  }

  get estadoAlerta() { // Creamos un método
    return this.mostrarAlerta ? 'show' : 'hide' // si no se cumple, hide (y no se ve)
  }

  inicioSesion() {
    this.mostrarAlerta = false;
    this.enviando = true;
    this.usuario = this.guardarUsuario();
    this.autenticacionService.login(this.usuario)
                             .subscribe((res:any)=>{
                               this.enviando = false;
                               this.crearSesion();
                              this.router.navigate(['/']);
                             },(error:any)=>{
                               this.mostrarAlerta = true;
                               if(error.error.mensaje){
                                 this.mensaje = error.error.mensaje;
                               }
                             })
  }

  guardarUsuario(){
    const guardarUsuario = {
      email: this.loginForm.get('email').value,
      password: this.loginForm.get('password').value,
    }
    
    return guardarUsuario;
  }

  crearSesion(){
    this.sesion = {
      nombre: this.autenticacionService.nombre,
      login: new Date()
    }
    this.autenticacionService.postSesion(this.sesion) // Espera el argumento sesion
                                                // Ejecutamos el método de servicio
                            .subscribe((resp:any)=>{
                              console.log(resp);
                                },(error:any)=>{
                                  console.log(error)
                                })
  }

}
