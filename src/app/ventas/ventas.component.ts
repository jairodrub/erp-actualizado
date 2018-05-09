import { Component, OnInit } from '@angular/core';
import { PresupuestosService } from '../servicios/presupuestos.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {

  chartOptions = {
    responsive: true
  }

  presupuestos:any;
  totalPorCliente:any;
  ptosPrMes:any;
  ptosSgMes:any;
  ptosTrMes:any;
  diaPrMes:any = new Date("2018-04-01").valueOf();
  diaSgMes:any = new Date("2018-05-01").valueOf();
  diaTrMes:any = new Date("2018-06-01").valueOf();
  diaCtMes:any = new Date("2018-07-01").valueOf();
  totalPrMes:number = 0;
  totalSgMes:number = 0;
  totalTrMes:number = 0;
  prMes:string = 'Abril';
  sgMes:string = 'Mayo';
  trMes:string = 'Junio';
  labelTrimestre:string = 'Presupuestos 2T';

  chartPtosTrimestre:any = [];
  chartTotalesClientes: any = [];

  constructor(private presupuestosService: PresupuestosService) { }
  // Nos traemos los presupuestos

  ngOnInit() {
    this.cargarGraficoPresupuestos();
    this.cargarGraficoCliente();
  }

  cargarGraficoPresupuestos(){
    this.presupuestosService.getPresupuestos() // getPresupuestos nos trae todos los presupuestos
                            .subscribe((resp:any)=>{
                              this.presupuestos = resp.presupuestos //En el backend presupuestos:presupuestos
                              this.ptosPrMes = this.presupuestos.filter(element => 
                                // Devuelve los que cumplan lo que pone después de element =>
                                 new Date(element.fecha).valueOf() >= this.diaPrMes
                              && new Date(element.fecha).valueOf() < this.diaSgMes)
                              this.ptosPrMes.forEach(ptoPrMes=>{ // Para cada uno
                                this.totalPrMes += ptoPrMes.total;
                              })
                              this.ptosSgMes = this.presupuestos.filter(element => 
                                // Devuelve los que cumplan lo que pone después de element =>
                                 new Date(element.fecha).valueOf() >= this.diaSgMes
                              && new Date(element.fecha).valueOf() < this.diaTrMes)
                              this.ptosSgMes.forEach(ptoSgMes=>{ // Para cada uno
                                this.totalSgMes += ptoSgMes.total;
                              })
                              this.ptosTrMes = this.presupuestos.filter(element => 
                                // Devuelve los que cumplan lo que pone después de element =>
                                 new Date(element.fecha).valueOf() >= this.diaTrMes
                              && new Date(element.fecha).valueOf() < this.diaCtMes)
                              this.ptosTrMes.forEach(ptoTrMes=>{ // Para cada uno
                                this.totalTrMes += ptoTrMes.total;
                              })
                              // Aquí vamos a implementar el gráfico:
                              this.chartPtosTrimestre = new Chart('grafico1',{
                                type: 'line',
                                data: {
                                  labels: [this.prMes, this.sgMes, this.trMes], 
                                  // Se le pasa un array [] con lo que queremos que aparezca en el eje de las X
                                  datasets: [
                                    { // Si ponemos 3 en la X, ponemos 3 en la Y, de momento
                                      data:[this.totalPrMes, this.totalSgMes, this.totalTrMes],
                                      label: this.labelTrimestre,
                                      borderColor:"#dc143c",
                                      // fill: false // relleno
                                    }
                                  ]
                                }
                              })
                                                 
                              
                            },(error)=>{
                              console.log(error)
                            })
  }

  cargarGraficoCliente(){
    this.presupuestosService.getTotalesPorCliente()
                            .subscribe((resp:any)=>{
                              this.totalPorCliente = resp.datos
                              let clientes = [];
                              let totales = [];
                              this.totalPorCliente.forEach(element=>{
                                clientes.push(element._id.cliente);
                                totales.push(element.total)
                              })
                              // Gráfico:
                              this.chartTotalesClientes = new Chart('grafico2',{
                                type:'pie',
                                data: {
                                  labels: clientes,
                                  datasets: [ // array
                                    { // documento
                                      backgroundColor: ['#d9534f', '#e45954', '#c54b47',
                                       '#5cb85c', '#60c360', '#509e50'],
                                      data: totales
                                    }
                                  ]
                                }
                              })
                            },(error)=>{
                              console.log(error)
                            })
  }

  primerTrimestre(){
    this.diaPrMes = new Date("2018-01-01").valueOf();
    this.diaSgMes = new Date("2018-02-01").valueOf();
    this.diaTrMes = new Date("2018-03-01").valueOf();
    this.diaCtMes = new Date("2018-04-01").valueOf();
    this.totalPrMes = 0;
    this.totalSgMes = 0;
    this.totalTrMes = 0;
    this.prMes = 'Enero';
    this.sgMes = 'Febrero';
    this.trMes = 'Marzo';
    this.labelTrimestre = 'Presupuestos 1T';
    this.chartPtosTrimestre.destroy(); // Para que no se quede guardado de antes
    this.cargarGraficoPresupuestos();
  }

  segundoTrimestre(){
    this.diaPrMes = new Date("2018-04-01").valueOf();
    this.diaSgMes = new Date("2018-05-01").valueOf();
    this.diaTrMes = new Date("2018-06-01").valueOf();
    this.diaCtMes = new Date("2018-07-01").valueOf();
    this.totalPrMes = 0;
    this.totalSgMes = 0;
    this.totalTrMes = 0;
    this.prMes = 'Abril';
    this.sgMes = 'Mayo';
    this.trMes = 'Junio';
    this.labelTrimestre = 'Presupuestos 2T';
    this.chartPtosTrimestre.destroy();
    this.cargarGraficoPresupuestos();
  }

}
