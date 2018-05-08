import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { PresupuestosService } from '../../servicios/presupuestos.service';
import { ClientesService } from '../../servicios/clientes.service';
import { ArticulosService } from '../../servicios/articulos.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editar-pres',
  templateUrl: './editar-pres.component.html',
  styleUrls: ['./editar-pres.component.css']
})
export class EditarPresComponent implements OnInit {

  formPre: FormGroup; // Propiedades
  presupuesto:any; // Propiedades
  clientes:any; // Propiedades
  articulos:any; // Propiedades
  id:string;

  constructor(private fp: FormBuilder, // fp formulario
              private presupuestosService: PresupuestosService,
              private clientesService: ClientesService,
              private articulosService: ArticulosService,
              private router: Router,
              private route: ActivatedRoute) {
                if(!this.articulos){
                  this.articulos = [];
                }
               }
              
  ngOnInit() {
    this.getId(this.route.snapshot.params['id']) // route es el de private
    this.cargarDatos();
    this.formPre = this.fp.group({
      cliente: null,
      cif: null,
      fecha: null,
      items: this.fp.array([
      // fp Formulario
      // Almacenamos las diferentes líneas que tiene un presupuesto
        this.initItem()
      ]),
      suma:null,
      tipo: 0.21,
      iva: null,
      total: null,
      num:null
    })
  }

  ngAfterViewChecked(){ // Cuando la vista del componente ya está comprobada
    this.detectarCambios();
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
  

  getId(id){ // Primero aquí y luego a ngOnInit(), después seguimos con esto
    this.presupuestosService.getPresupuestoId(id) // En presupuestos.service.ts
                            .subscribe((resp:any)=>{
                              this.presupuesto = resp.presupuesto;
                              this.patchForm();
                            },(error)=>{
                              console.log(error);
                            })
    this.id = id; // Que this.id pase a se id
  }

  patchForm(){
    var numero = '000' + this.presupuesto.numero + '/18';

    this.formPre.patchValue({
      cliente: this.presupuesto.cliente,
      cif: this.presupuesto.cif,
      fecha: this.presupuesto.fecha,
      suma: this.presupuesto.suma,
      tipo: this.presupuesto.tipo,
      iva: this.presupuesto.iva,
      total: this.presupuesto.total,
      num: numero.slice(-7)
    })
    this.setPresupuestoItems();
  }
  
  setPresupuestoItems(){
    let control = <FormArray>this.formPre.controls.items;
    this.presupuesto.items.forEach(element=>{
      control.push(this.fp.group({ // Dentro le pasamos un objeto...
        articulo: element.articulo,
        cantidad: element.cantidad,
        precio: element.precio,
        importe: element.importe
      }))
    })
    this.removeItem(0); // Crea uno de más vacío
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
            .subscribe(valor =>{
              // var nombreCliente = valor.cliente;
              // var clienteCargado = this.clientes.find(cliente=>{
              //   return cliente.nombre === nombreCliente;
              // });
              // if(clienteCargado){
              //   this.formPre.value.cif = clienteCargado.cif;
              // } else {
              //   this.formPre.value.cif = '';
              // }
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
                  this.formPre.value.items[i].importe = this.redondear(valor.items[i].cantidad 
                    * this.formPre.value.items[i].precio);
                }
                suma += valor.items[i].importe; 
              }
              this.formPre.value.suma = suma;
              this.formPre.value.iva = this.redondear(this.formPre.value.suma * valor.tipo);
              this.formPre.value.total = this.redondear(this.formPre.value.suma + this.formPre.value.iva);
            })
}

  editarPresupuesto(){
    this.presupuesto = this.guardarPresupuesto();
    this.presupuestosService.putPresupuesto(this.id, this.presupuesto)
                            .subscribe((resp:any)=>{
                              this.router.navigate(['/listado-presupuestos'])
                            },(error)=>{
                              console.log(error);
                            })
  }

  guardarPresupuesto(){
    const guardarPresupuesto = {
      cliente: this.formPre.get('cliente').value,
      cif: this.formPre.get('cif').value,
      fecha: this.formPre.get('fecha').value,
      items: this.formPre.get('items').value,
      suma: this.formPre.get('suma').value,
      tipo: this.formPre.get('tipo').value,
      iva: this.formPre.get('iva').value,
      total: this.formPre.get('total').value,
    }
    return guardarPresupuesto;
  }

}