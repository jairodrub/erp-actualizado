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

  crearSesion(){ // Cuando creemos sesión...
    var ultimoLogin = JSON.parse(localStorage.getItem('ultimoLogin'));
    var ultimoLoginMs = new Date(ultimoLogin).valueOf();
    var fechaActualMs = new Date().valueOf();
    var duracionS = (fechaActualMs - ultimoLoginMs) / 1000;
    
    var s = Math.floor( duracionS % 60);
    var ss = ("0" + s).slice(-2);
    var m = Math.floor(( duracionS % 3600) / 60); // ms que tiene un minuto
    var mm = ("0" + m).slice(-2);
    var h = Math.floor( duracionS / 3600);
    var hh = ("0" + h).slice(-2);

    this.sesion = {
      nombre: this.autenticacionService.nombre,
      logout: new Date(),
      duracion: hh + ' horas ' + mm + ' minutos ' + ss + ' segundos.',
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
