import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { PresupuestosService } from '../../servicios/presupuestos.service';
import { ClientesService } from '../../servicios/clientes.service';
import { ArticulosService } from '../../servicios/articulos.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-crear-pres',
  templateUrl: './crear-pres.component.html',
  styleUrls: ['./crear-pres.component.css']
})
export class CrearPresComponent implements OnInit {

  formPre: FormGroup;
  presupuesto:any;
  clientes:any;
  articulos:any;


  constructor(private fp: FormBuilder, // fp formulario
              private presupuestosService: PresupuestosService,
              private clientesService: ClientesService,
              private articulosService: ArticulosService,
              private router: Router) { }

  ngOnInit() {
    this.cargarDatos();
    this.formPre = this.fp.group({
      cliente: null,
      fecha: null,
      items: this.fp.array([
      // fp Formulario
      // Almacenamos las diferentes líneas que tiene un presupuesto
        this.initItem()
      ]),
      suma:null,
      tipo: 0.21,
      iva: null,
      total: null
    })
  }

  ngAfterViewChecked(){ // Cuando la vista del componente ya está comprobada
    this.detectarCambios();
  }
  
  initItem(){
    return this.fp.group({
      articulo: null,
      cantidad:null,
      precio:null,
      importe:null,
    })
  }

  addItem(){
    const control = <FormArray>this.formPre.controls['items'];
    control.push(this.initItem());
  }

  removeItem(i){
    const control = <FormArray>this.formPre.controls['items'];
    control.removeAt(i); // i es el índice
  }

  cargarDatos(){
    this.clientesService.getTodosClientes()
                .subscribe((resp:any)=>{
                  this.clientes = resp.clientes
                }, (error)=>{
                  console.log(error)
                })
    this.articulosService.getArticulo()
                .subscribe((resp:any)=>{
                  this.articulos = resp.articulos
                }, (error)=>{
                  console.log(error)
                })
  }

  redondear(valor){
    var valor;
    if(valor < 0) {
        var resultado = Math.round(-valor*100)/100 * -1; // -1 para que sea negativo
    } else {
        var resultado = Math.round(valor*100)/100;
    }
    return resultado;
  }

  detectarCambios(){
    this.formPre.valueChanges
                .subscribe(valor =>{ // Como es un solo valor, quitamos ()
                  var importe = 0;
                  var suma = 0;
                  var i;
                  for(i=0; i < valor.items.length; i++){
                    var referencia = valor.items[i].articulo;
                    var articuloCargado = this.articulos.find(function(articulo){
                      return articulo.referencia === referencia;
                    });
                    if(articuloCargado){
                      this.formPre.value.items[i].precio = articuloCargado.precio;
                    }
                    // articuloCargado es el que se va seleccionando en cada momento
                    this.formPre.value.items[i].importe = this.redondear(valor.items[i].cantidad 
                                          * this.formPre.value.items[i].precio);
                    suma += valor.items[i].importe; 
                    // De aquí se extrae el importe
                    // La i se va actualizando
                  }
                  this.formPre.value.suma = suma; // forControlName="suma" en HTML
                  this.formPre.value.iva = this.redondear(this.formPre.value.suma * valor.tipo);
                  this.formPre.value.total = this.redondear(this.formPre.value.suma + this.formPre.value.iva);
                })
  }

  crearPresupuesto(){
    this.presupuesto = this.guardarPresupuesto();
    this.presupuestosService.postPresupuesto(this.presupuesto)
                            .subscribe((resp:any)=>{
                              this.router.navigate(['/listado-presupuestos'])
                            },(error)=>{
                              console.log(error);
                            })
  }

  guardarPresupuesto(){
    const guardarPresupuesto = {
      cliente: this.formPre.get('cliente').value,
      fecha: this.formPre.get('fecha').value,
      items: this.formPre.get('items').value,
      suma: this.formPre.get('suma').value,
      tipo: this.formPre.get('tipo').value,
      iva: this.formPre.get('iva').value,
      total: this.formPre.get('total').value,
    }
  }
}