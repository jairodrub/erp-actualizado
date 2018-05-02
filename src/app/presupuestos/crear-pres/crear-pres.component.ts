import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PresupuestosService } from '../../servicios/presupuestos.service'
import { Router } from '@angular/router' // Para navegación programática
import { trigger, state, style, animate, transition } from '@angular/animations'; // Animaciones

@Component({
  selector: 'app-crear-pres',
  templateUrl: './crear-pres.component.html',
  styleUrls: ['./crear-pres.component.css'],
  animations: [
    trigger('alerta', [ // alerta la hemos definido en HTML antes
      state('show', style({opacity: 1})), // El estado en el que está
      state('hide', style({opacity: 0})),
      transition('show => hide', animate('500ms ease-out')), // Cuando pasemos de show a hide...
      transition('hide => show', animate('500ms ease-in')) // Cuando pasemos de hide a show...
    ]) 
  ]// Lleva un array por si lleva varias animaciones
})
export class CrearPresComponent implements OnInit {

  @ViewChild('cif') cifRef: ElementRef;
  @ViewChild('proveedor') proveedorRef: ElementRef; // para enlazarlo con el #proveedor

  mensaje: string = 'Error de conexión con el servidor';
  mostrarAlerta:boolean = false;
  enviando:boolean = false;

  presupuestoForm: FormGroup /* objeto */; // Lo que hemos metido en la imagen anterior en html.
  presupuesto:any;
  base:number; // Las tipamos como number
  tipo:number;
  importe:number;
  total:number;
  irpf:number;
  retencion:boolean = false;
  cif:boolean;

 

  constructor(private pf: FormBuilder, // pf producto final
    private presupuestosService: PresupuestosService,
    private router: Router) { }

  ngOnInit() {
    this.iniciarFormulario();
  }

  iniciarFormulario(){
    this.presupuestoForm = this.pf.group({
      proveedor: [ null, Validators.required ], // Metemos el valor inicial en un array... 
                                                    // ...y ponemos Validators.required
      cif: [ '', [Validators.required, Validators.minLength(9)] ], // minLength para número de caracteres

      fecha: null, // Tb separamos por comas porque es un objeto
      concepto: null, // Al ser un objeto, ponemos dos puntos para inicializarlo.
      base: [null, [Validators.required, Validators.max(100000)]], 
      // Para que máximo sea 100000, si pasa no deja registrar. Es obligatorio
      retencion: false,
      tipo: 0.21,
      irpf: this.formatearMoneda(0),
      importe: this.formatearMoneda(0),
      total: this.formatearMoneda(0)
      
    });
  this.detectarCambios();
  }

  get estadoAlerta() { // Creamos un método
    return this.mostrarAlerta ? 'show' : 'hide' // si no se cumple, hide (y no se ve)
  }

  crearFra(){ // Hay que engancharlo con un backend
    this.mostrarAlerta = false;
    this.enviando = true;
    this.presupuesto = this.guardarFra();
    this.presupuestosService.postPresupuesto(this.presupuesto)
                          .subscribe((resp:any)=>{
                            this.router.navigate(['/listado-presupuestos']);
                            // cuando haya éxito, nos lleva a la lista de proveedores
                            this.enviando = false;
                          }, (error:any)=>{
                            this.mostrarAlerta = true;
                            this.enviando = false;
                            console.log(error);
                            if (error.error.errores.errors.cif.message){
                              this.mensaje = error.error.errores.errors.cif.message;
                              // this.cifRef.nativeElement.focus(); // Para que nos muestre esto
                                                                // además del error
                            }
                          });
  }

  guardarFra(){
    const guardarFra = { // creamos un nuevo objeto que lo llamamos tb guardarFra
      proveedor: this.presupuestoForm.get('proveedor').value, // value es el valor que tiene cada uno
      //get ('proveedor') es un selector.
      cif: this.presupuestoForm.get('cif').value,
      fecha: this.presupuestoForm.get('fecha').value,
      concepto: this.presupuestoForm.get('concepto').value,
      base: this.presupuestoForm.get('base').value,
      retencion: this.presupuestoForm.get('retencion').value,
      tipo: this.presupuestoForm.get('tipo').value,
      irpf: this.presupuestoForm.get('irpf').value,
      importe: this.presupuestoForm.get('importe').value,
      total: this.presupuestoForm.get('total').value,
      fechaRegistro: new Date()
    }
    return guardarFra; // al devolverlo, lo devuelve al método guardarFra, que está en la fila 30
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

  formatearMoneda(valor){ // Recibe un valor
    var resultado = new Intl.NumberFormat("es-ES", {style: "currency", currency: "EUR"}).format(valor);
    // Formateamos el valor que nos entre como parámetro y lo devolvemos
    return resultado; // Lo devolvemos
  }

  detectarCambios(){
    this.presupuestoForm.valueChanges.subscribe(valorForm =>{ //valueChanges y subscribe siempre espera cambios
      this.cif = valorForm.cif.startsWith('A') || valorForm.cif.startsWith('B'); //this.cif es una booleana T o F
      this.base = this.redondear (valorForm.base); // En angular poner el this
      this.retencion = valorForm.retencion;
      this.tipo = valorForm.tipo;
      if(this.retencion){
        this.irpf = this.redondear(this.base * -0.15);
      } else {
        this.irpf = 0;
      }
      this.importe = this.redondear(this.base * this.tipo);
      this.total = this.redondear(this.base + this.importe + this.irpf);
      this.presupuestoForm.value.irpf = this.formatearMoneda(this.irpf);
      // El valor de irpf será igual al formateo de irpf
      this.presupuestoForm.value.importe = this.formatearMoneda(this.importe);
      this.presupuestoForm.value.total = this.formatearMoneda(this.total);
    })
  }

  registrarFra() {
    this.presupuesto = this.guardarFra(); // objeto presupuesto
    // Llamamos a un nuevo método (guardarFra) y lo sacamos fuera.
    this.presupuestoForm.reset(); // Para que lo suba al foco
    // this.cifRef.nativeElement.focus(); // Método focus (PONER PUNTERO ENCIMA PARA VER QUÉ ES)
  }



}

