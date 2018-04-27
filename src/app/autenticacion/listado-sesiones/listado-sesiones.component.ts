import { Component, OnInit } from '@angular/core';
import { AutenticacionService } from '../../servicios/autenticacion.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-listado-sesiones',
  templateUrl: './listado-sesiones.component.html',
  styleUrls: ['./listado-sesiones.component.css']
})
export class ListadoSesionesComponent implements OnInit {

  sesiones:any;
  nombre: string;

  constructor(private autenticacionService: AutenticacionService,
              private route: ActivatedRoute) { }
  // Al crear el AutenticaciónService, se importa directamente arriba

  ngOnInit() {
    this.nombre = this.route.snapshot.params['nombre'];
    this.cargarSesiones();
  }

  cargarSesiones(){
    this.autenticacionService.getSesiones(this.nombre)
                             .subscribe((resp:any)=>{
                               this.sesiones = resp.sesiones;
        // = que en sesion.js (routes) del BACKEND [sesiones: sesiones]
                             }, (error)=>{
                               console.log(error);
                             })
  }

}
