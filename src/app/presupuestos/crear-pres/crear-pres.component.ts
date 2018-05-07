import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { PresupuestosService } from '../../servicios/presupuestos.service';
import { ClientesService } from '../../servicios/clientes.service';
import { ArticulosService } from '../../servicios/articulos.service';


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
              private articulosService: ArticulosService) { }

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
      suma:null
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
                    this.formPre.value.items[i].importe = valor.items[i].cantidad 
                                          * this.formPre.value.items[i].precio;
                    suma += valor.items[i].importe; 
                    // De aquí se extrae el importe
                    // La i se va actualizando
                  }
                  this.formPre.value.suma = suma; // forControlName="suma" en HTML
                })
  }

}