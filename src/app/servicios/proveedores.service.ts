import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
// Esta librería importa HttpClient y establece la forma de crear peticiones de http
import { Observable } from 'rxjs/Observable'; //
import 'rxjs/add/operator/map'; // Tres métodos
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AutenticacionService } from './autenticacion.service';

@Injectable()
export class ProveedoresService {

  token:string; // Nos creamos una propiedad

  constructor(private http: HttpClient,
              private autenticacionService: AutenticacionService) {
              }
  // El constructor funciona como ngOnInit(), se arranca al iniciar

  getProveedores(desde){ // Cuando sea llamado desde componentes ejecutará el contenido que está ahí
    let url = 'http://localhost:3000/proveedor?desde=' + desde;
    return this.http.get(url) // cuando llamemos a getProveedores ejecuta este resultado
                    .map( (resp:any) => { // Con la flecha deja de protestar
                          //la tipamos con any para que no proteste (angular)
                      return resp;
                    });
  } 

  getProveedorId(id) {
    let url = 'http://localhost:3000/proveedor/'; // Hay que meter la barra para que no se junte el id
    return this.http.get(url + id) // id la pasamos tb a fila 24
                    .map( (resp:any) => { // Con la flecha deja de protestar
                    //la tipamos con any para que no proteste (angular)
                    return resp;
                    });
  }

  postProveedor(proveedor){
    let url = 'http://localhost:3000/proveedor';
    return this.http.post(url, proveedor)
                    .map( (resp:any) => {
                      return resp;
                    });
  }

  putProveedor(id, proveedor) {
    let url = 'http://localhost:3000/proveedor/';
    return this.http.put(url+id, proveedor)
                    .map( (resp:any) => {
                      return resp;
                    });
  }

  deleteProveedor(id) {
    this.token = this.autenticacionService.token;
    console.log(this.token);
    let url = 'http://localhost:3000/proveedor/' + id + '?token=' + this.token;
    return this.http.delete(url)
                    .map( (resp:any) => {
                      return resp;
                    });
  }
}
