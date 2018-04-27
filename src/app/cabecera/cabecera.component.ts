import { Component, OnInit } from '@angular/core';
import { AutenticacionService } from '../servicios/autenticacion.service';

@Component({
  selector: 'app-cabecera',
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.css']
})
export class CabeceraComponent implements OnInit {

  sesion:any;

  constructor(private autenticacionService: AutenticacionService) { }

  ngOnInit() {
  }

  getLogged(){ // Para que pida si está logueado
    return this.autenticacionService.isLogged();
  }

  crearSesion(){
    this.sesion = {
      nombre: this.autenticacionService.nombre,
      logout: new Date()
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
