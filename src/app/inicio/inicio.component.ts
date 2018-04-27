import { Component, OnInit } from '@angular/core';
import { AutenticacionService } from '../servicios/autenticacion.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  constructor(private autenticacionService: AutenticacionService) { }

  ngOnInit() {
  }

  getLogged(){ // Para que pida si está logueado
    return this.autenticacionService.isLogged();
  }

}
