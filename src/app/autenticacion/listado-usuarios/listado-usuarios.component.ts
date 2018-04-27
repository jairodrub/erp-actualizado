import { Component, OnInit } from '@angular/core';
import { AutenticacionService } from '../../servicios/autenticacion.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations'; // Animaciones

@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styleUrls: ['./listado-usuarios.component.css'],
  animations: [
    trigger('formulario', [ // formulario la definimos en HTML como @formulario
      state('show', style({opacity: 1, height: 80})), // El estado en el que está
      state('hide', style({opacity: 0, height: 0})),
      transition('show => hide', animate('500ms ease-out')), // Cuando pasemos de show a hide...
      transition('hide => show', animate('500ms ease-in')) // Cuando pasemos de hide a show...
    ]), 
    trigger('alerta', [ // formulario la definimos en HTML como @formulario
      state('show', style({opacity: 1})), // El estado en el que está
      state('hide', style({opacity: 0})),
      transition('show => hide', animate('500ms ease-out')), // Cuando pasemos de show a hide...
      transition('hide => show', animate('500ms ease-in')) // Cuando pasemos de hide a show...
    ]) 
  ]// Lleva un array por si lleva varias animaciones
})
export class ListadoUsuariosComponent implements OnInit {

  usuarios:any;
  usuario:any;
  nuevoUsuario:any;
  crearUsuarioForm:FormGroup;
  editarUsuarioForm:FormGroup;
  mostrarFormulario:boolean = false;
  mostrarAlerta:boolean = false;
  enviando:boolean = false;
  mensaje:string = "Error de conexión al servidor";
  editarFila:string;
  id:string;

  constructor(private autenticacionService: AutenticacionService,
              private cuf: FormBuilder, //crear usuario form
              private euf: FormBuilder) { } // editar usuario form

  ngOnInit() {
    this.cargarUsuarios();
    this.crearUsuarioForm = this.cuf.group({
      nombre: [null, Validators.required],
      email: [null, Validators.required],
      password: [null, Validators.required],
      rol: [null, Validators.required]
    })
    this.editarUsuarioForm = this.euf.group({ // enviamos esto:
      nombre: [null, Validators.required],
      email: [null, Validators.required],
      rol: [null, Validators.required]
    })
  }

  get estadoFormulario() { // Creamos un método
    return this.mostrarFormulario ? 'show' : 'hide' // si no se cumple, hide (y no se ve)
  }

  get estadoAlerta() { // Creamos un método
    return this.mostrarAlerta ? 'show' : 'hide' // si no se cumple, hide (y no se ve)
  }

  verFormulario(){
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  cargarUsuarios(){
    this.autenticacionService.getUsuarios()
                             .subscribe((res:any)=>{
                               this.usuarios = res.usuarios;
                             },(error)=>{
                               console.log(error);
                             })
  }

  crearUsuario(){
    this.enviando = true;
    this.nuevoUsuario = this.guardarNuevoUsuario();
    this.autenticacionService.postUsuario(this.nuevoUsuario)
                              .subscribe((res:any)=>{
                                this.enviando = false;
                                this.mostrarAlerta = true;
                                this.mensaje = 'Usuario creado correctamente';
                                this.crearUsuarioForm.reset(); // lo limpia
                                this.cargarUsuarios(); // lo recarga
                                setTimeout(()=>{
                                  this.mostrarAlerta = false;
                                }, 2500);
                                setTimeout(()=>{
                                  this.mensaje = "Error de conexión al servidor";
                                }, 5000)
                              },(error:any)=>{
                              this.mostrarAlerta = true;
                              this.enviando = false;
                              if (error.error.errores.errors.email.message){
                                this.mensaje = error.error.errores.errors.email.message;
                              }
                              setTimeout(()=>{
                                this.mostrarAlerta = false;
                                this.mensaje = "Error de conexión al servidor";
                              }, 2500)
                              })
  }

  guardarNuevoUsuario(){
    const guardarNuevoUsuario = {
      nombre: this.crearUsuarioForm.get('nombre').value,
      email: this.crearUsuarioForm.get('email').value.toLowerCase(),
      password: this.crearUsuarioForm.get('password').value,
      rol: this.crearUsuarioForm.get('rol').value,
    }

    return guardarNuevoUsuario;
  }

  modificarUsuario(id){
    this.editarFila = id;
  }

  cancelarEdicion(){
    this.editarFila = '';
    this.cargarUsuarios();
  }

  editarUsuario(id){
    this.enviando = true;
    this.usuario = this.guardarUsuarioEditado();
    this.autenticacionService.putUsuario(id, this.usuario)
                              .subscribe((res:any)=>{
                                this.enviando = false;
                                this.mostrarAlerta = true;
                                this.mensaje = 'Usuario actualizado correctamente';
                                this.editarFila = ''; // Lo metemos aquí
                                this.cargarUsuarios(); // lo recarga
                                setTimeout(()=>{
                                  this.mostrarAlerta = false;
                                  this.mensaje = "Error de conexión al servidor";
                                }, 2500)
                              },(error:any)=>{
                              this.mostrarAlerta = true;
                              this.enviando = false;
                              if (error.error.errores.errors.email.message){
                                this.mensaje = error.error.errores.errors.email.message;
                              }
                              setTimeout(()=>{
                                this.mostrarAlerta = false;
                              }, 2500)
                              })
              setTimeout(()=>{
                this.mensaje = "Error de conexión al servidor";
              }, 3000)
  }

  guardarUsuarioEditado(){
    const guardarUsuarioEditado = {
      nombre: this.editarUsuarioForm.get('nombre').value,
      email: this.editarUsuarioForm.get('email').value.toLowerCase(),
      rol: this.editarUsuarioForm.get('rol').value,
    }
    return guardarUsuarioEditado; // Tiene que devolver el usuario editado
  }

  getId(id){
    this.id = id;
  }

  borrarUsuario(){
    this.enviando = true;
    this.autenticacionService.deleteUsuario(this.id)
                            .subscribe((res:any)=>{
                              this.enviando = false;
                              this.mostrarAlerta = true;
                              this.mensaje = 'Usuario eliminado correctamente';
                              this.cargarUsuarios(); // lo recarga
                              setTimeout(()=>{ // Para que se reinicialice
                                this.mostrarAlerta = false;
                              }, 2500);
                            },(error:any)=>{
                            this.mostrarAlerta = true;
                            this.enviando = false;
                            setTimeout(()=>{ // Para que se reinicialice
                              this.mostrarAlerta = false;
                            }, 2500);
                            })
                      setTimeout(()=>{ // Para que se reinicialice
                        this.mensaje = "Error de conexión al servidor";
                      }, 3000)
                          
  }
}
