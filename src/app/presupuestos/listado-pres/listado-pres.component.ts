import { Component, OnInit } from '@angular/core';
import { PresupuestosService } from '../../servicios/presupuestos.service';

@Component({
  selector: 'app-listado-pres',
  templateUrl: './listado-pres.component.html',
  styleUrls: ['./listado-pres.component.css']
})
export class ListadoPresComponent implements OnInit {

  presupuestos:any = [];
  id:string;

  constructor(private presupuestosService: PresupuestosService) { }

  ngOnInit() {
    this.cargarPresupuestos();
  }

  cargarPresupuestos(){
    this.presupuestosService.getPresupuestos()
               .subscribe((resp:any)=>{
                  var presupuestos = resp.presupuestos;
                  presupuestos.forEach(presupuesto=>{ // Recibe el array de arriba (23)
                    var num = '0000' + presupuesto.numero + '/18';
                    // Le decimos que nos cree una variable num
                    presupuesto.num = num.slice(-7);
                    this.presupuestos.push(presupuesto); // añadimos cada presupuesto
                  })
               }, error => {
                 console.log(error);
               })
  }


  obtenerId(id){
    this.id = id;
  }

  borrarPresupuesto(){
    this.presupuestosService.deletePresupuesto(this.id)
                .subscribe((resp:any)=>{
                  this.presupuestos();
                  this.cargarPresupuestos();
                },(error:any)=>{
                  console.log(error);
                })
  }

}
