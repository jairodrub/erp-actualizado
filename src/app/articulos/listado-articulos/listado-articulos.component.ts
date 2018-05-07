import { Component, OnInit } from '@angular/core';
import { ArticulosService } from '../../servicios/articulos.service';

@Component({
  selector: 'app-listado-articulos',
  templateUrl: './listado-articulos.component.html',
  styleUrls: ['./listado-articulos.component.css']
})
export class ListadoArticulosComponent implements OnInit {

  articulos:any;

  constructor(private articulosService: ArticulosService) { }

  ngOnInit() {
    this.cargarArticulos();
  }

  cargarArticulos(){
    this.articulosService.getArticulo()
                         .subscribe((resp:any)=>{
                           this.articulos = resp.articulos;
                         },(error)=>{
                           console.log(error)
                         })
  }

}
