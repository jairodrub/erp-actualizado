import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'; // Tres métodos
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Router } from '@angular/router';

@Injectable()
export class AutenticacionService {

  token: string;
  nombre: string;
  rol: string;

  constructor(private http: HttpClient, private router: Router) {
    this.cargarCredenciales();
   }

   getUsuarios(){ // Cuando sea llamado desde componentes ejecutará el contenido que está ahí
    let url = 'http://localhost:3000/usuario';
    return this.http.get(url) // cuando llamemos a getProveedores ejecuta este resultado
                    .map( (resp:any) => { // Con la flecha deja de protestar
                          //la tipamos con any para que no proteste (angular)
                      return resp;
                    });
  } 

  postUsuario(usuario){
    let url = "http://localhost:3000/usuario"
    return this.http.post(url, usuario)
                    .map( (resp:any) => {
                      return resp;
                    });
  }

  putUsuario(id, usuario){ // Envía la url con http y el usuario
    let url = "http://localhost:3000/usuario/"
    return this.http.put(url+id, usuario)
                    .map( (resp:any) => {
                      return resp;
                    });
  }

  deleteUsuario(id) {
    let url = 'http://localhost:3000/usuario/';
    return this.http.delete(url+id)
                    .map( (resp:any) => {
                      return resp;
                    });
  }

  login(usuario){ // recibimos body y password desde el backend (login)
    let url = "http://localhost:3000/login"
    return this.http.post(url, usuario)
                    .map( (resp:any) => {
                      this.guardarCredenciales(resp.token, resp.nombre, resp.rol); 
                      // token el numero largo de antes (encriptación)
                      return resp;
                    });
  }

  guardarCredenciales(token, nombre, rol){
    localStorage.setItem('token',token); // El token lo grabo en el localStorage
    localStorage.setItem('nombre',nombre); // Almacena también el nombre en el localStorage
    localStorage.setItem('rol',rol);
    this.token = token;
    this.nombre = nombre;
    this.rol = rol;
  }

  cargarCredenciales(){
    if(localStorage.getItem('token')){
      this.token = localStorage.getItem('token');
      this.nombre = localStorage.getItem('nombre');
      this.rol = localStorage.getItem('rol');
    } else {
      this.token = '';
      this.nombre = ''; // Y si no tiene nombre...
      this.rol = '';
    }
  }

  isLogged(){
    return ( this.token.length > 0 ) ? true : false; // Si existe... En ese caso...
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('nombre');
    localStorage.removeItem('rol');
    this.token = '';
    this.nombre = ''; // Para que borre también el nombre al cerrar sesión
    this.rol = '';
    this.router.navigate(['/']);
  }

  getPermLisUsuarios(){ // Para saber si soy administrador o no
    if(this.rol === 'Administrador') {
      return true
    } else { // y si no...
      return false;
    }
  }

  getPermCompras(){
    if(this.rol === 'Administrador' ||
       this.rol === 'Director de Compras' ||
       this.rol === 'Empleado de Compras'){
         return true
       } else { // en caso contrario 
         return false;
       } 
  }

  getPermProveedores(){
    if(this.rol === 'Administrador' ||
       this.rol === 'Director de Compras'){
         return true
       } else { // en caso contrario 
         return false;
       } 
  }

  getSesiones(nombre){ // Cuando sea llamado desde componentes ejecutará el contenido que está ahí
    let url = 'http://localhost:3000/sesion?nombre='+nombre; // Concatenamos nombre
    return this.http.get(url) // cuando llamemos a getProveedores ejecuta este resultado
                    .map( (resp:any) => { // Con la flecha deja de protestar
                          //la tipamos con any para que no proteste (angular)
                      return resp;
                    });
  } 

  // Crea una respuesta y la devuelve

  postSesion(sesion){
    let url = "http://localhost:3000/sesion"
    return this.http.post(url, sesion)
                    .map( (resp:any) => {
                      return resp;
                    });
  }
}
