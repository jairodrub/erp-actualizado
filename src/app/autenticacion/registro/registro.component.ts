import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms'
import { AutenticacionService } from '../../servicios/autenticacion.service';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations'; // Animaciones

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  animations: [
    trigger('alerta', [ // alerta la hemos definido en HTML antes
      state('show', style({opacity: 1})), // El estado en el que está
      state('hide', style({opacity: 0})),
      transition('show => hide', animate('500ms ease-out')), // Cuando pasemos de show a hide...
      transition('hide => show', animate('500ms ease-in')) // Cuando pasemos de hide a show...
    ]) 
  ]// Lleva un array por si lleva varias animaciones
})
export class RegistroComponent implements OnInit {

  registroForm: FormGroup;
  usuario: any;
  mensaje: string = 'Error de conexión con el servidor';
  mostrarAlerta:boolean = false;
  enviando:boolean = false;

  constructor(private fr: FormBuilder,
              private autenticacionService: AutenticacionService,
              private router: Router) { }

  ngOnInit() {
    this.registroForm = this.fr.group({
      nombre: ['', Validators.required],
      email: ['', Validators.email],
      password: ['', Validators.required], 
      // Validators.pattern('(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$')]], 
      // Dentro de las comillas el patrón
      confirma: ''
    })
  }

  get estadoAlerta() { // Creamos un método
    return this.mostrarAlerta ? 'show' : 'hide' // si no se cumple, hide (y no se ve)
  }

  registroUsuario() {
    this.mostrarAlerta = false;
    this.enviando = true;
    this.usuario = this.guardarUsuario();
    this.autenticacionService.postUsuario(this.usuario)
                             .subscribe((res:any)=>{
                                this.router.navigate(['/']);
                                this.enviando = false;
                             },(error:any)=>{
                              this.mostrarAlerta = true;
                              this.enviando = false;
                              console.log(error);
                              if (error.error.errores.errors.email.message){
                                this.mensaje = error.error.errores.errors.email.message;
                              }
                             })
  }

  guardarUsuario(){
    const guardarUsuario = {
      nombre: this.registroForm.get('nombre').value,
      email: this.registroForm.get('email').value,
      password: this.registroForm.get('password').value,
    }
    return guardarUsuario;
  }
  
}
