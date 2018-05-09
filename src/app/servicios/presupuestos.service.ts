import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
// Esta librería importa HttpClient y establece la forma de crear peticiones de http
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'; // Tres métodos
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class PresupuestosService {

  constructor(private http: HttpClient) { }

  getPresupuestos(){ // Cuando sea llamado desde componentes ejecutará el contenido que está ahí
    let url = 'http://localhost:3000/presupuesto';
    return this.http.get(url) // cuando llamemos a getProveedores ejecuta este resultado
                    .map( (resp:any) => { // Con la flecha deja de protestar
                          //la tipamos con any para que no proteste (angular)
                      return resp;
                    });
  } 

  getTotalesPorCliente() {
    let url = 'http://localhost:3000/presupuesto/cliente/'; // Hay que meter la barra para que no se junte el id
    return this.http.get(url) // id la pasamos tb a fila 24
                    .map( (resp:any) => { // Con la flecha deja de protestar
                    //la tipamos con any para que no proteste (angular)
                    return resp;
                    });
  }

  getPresupuestoId(id) {
    let url = 'http://localhost:3000/presupuesto/'; // Hay que meter la barra para que no se junte el id
    return this.http.get(url + id) // id la pasamos tb a fila 24
                    .map( (resp:any) => { // Con la flecha deja de protestar
                    //la tipamos con any para que no proteste (angular)
                    return resp;
                    });
  }

  postPresupuesto(presupuesto){
    let url = "http://localhost:3000/presupuesto"
    return this.http.post(url, presupuesto)
                    .map( (resp:any) => {
                      return resp;
                    });
  }

  putPresupuesto(id, presupuesto) {
    let url = 'http://localhost:3000/presupuesto/';
    return this.http.put(url+id, presupuesto)
                    .map( (resp:any) => {
                      return resp;
                    });
  }

  deletePresupuesto(id) {
    let url = 'http://localhost:3000/presupuesto/';
    return this.http.delete(url+id)
                    .map( (resp:any) => {
                      return resp;
                    });
  }
}
