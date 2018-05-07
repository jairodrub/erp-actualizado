import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
// Esta librería importa HttpClient y establece la forma de crear peticiones de http
import { Observable } from 'rxjs/Observable'; //
import 'rxjs/add/operator/map'; // Tres métodos
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class ClientesService {

  constructor(private http: HttpClient) { }

  getTodosClientes(){ // Cuando sea llamado desde componentes ejecutará el contenido que está ahí
    let url = 'http://localhost:3000/cliente';
    return this.http.get(url) // cuando llamemos a getClientes ejecuta este resultado
                    .map( (resp:any) => { // Con la flecha deja de protestar
                          //la tipamos con any para que no proteste (angular)
                      return resp;
                    });
  } 

  getClientes(nombre){ // Cuando sea llamado desde componentes ejecutará el contenido que está ahí
    let url = 'http://localhost:3000/cliente/nombre/' + nombre;
    return this.http.get(url) // cuando llamemos a getClientes ejecuta este resultado
                    .map( (resp:any) => { // Con la flecha deja de protestar
                          //la tipamos con any para que no proteste (angular)
                      return resp;
                    });
  } 

  getClientesLocalidad(localidad){ // Cuando sea llamado desde componentes ejecutará el contenido que está ahí
    let url = 'http://localhost:3000/cliente/localidad/' + localidad;
    return this.http.get(url) // cuando llamemos a getClientes ejecuta este resultado
                    .map( (resp:any) => { // Con la flecha deja de protestar
                          //la tipamos con any para que no proteste (angular)
                      return resp;
                    });
  } 
  
  getClientesNombreLocalidad(consulta){ // Cuando sea llamado desde componentes 
                                          // ejecutará el contenido que está ahí
    let url = 'http://localhost:3000/cliente/mixto/' + consulta.nombre + '/' + consulta.localidad;
    return this.http.get(url) // cuando llamemos a getClientes ejecuta este resultado
                    .map( (resp:any) => { // Con la flecha deja de protestar
                          //la tipamos con any para que no proteste (angular)
                      return resp;
                    });
  } 

  getClienteId(id) {
    let url = 'http://localhost:3000/cliente/'; // Hay que meter la barra para que no se junte el id
    return this.http.get(url + id) // id la pasamos tb a fila 24
                    .map( (resp:any) => { // Con la flecha deja de protestar
                    //la tipamos con any para que no proteste (angular)
                    return resp;
                    });
  }

  postCliente(cliente){
    let url = "http://localhost:3000/cliente"
    return this.http.post(url, cliente)
                    .map( (resp:any) => {
                      return resp;
                    });
  }

  putCliente(id, cliente) {
    let url = 'http://localhost:3000/cliente/';
    return this.http.put(url+id, cliente)
                    .map( (resp:any) => {
                      return resp;
                    });
  }

  deleteCliente(id) {
    let url = 'http://localhost:3000/cliente/';
    return this.http.delete(url+id)
                    .map( (resp:any) => {
                      return resp;
                    });
  }
}
