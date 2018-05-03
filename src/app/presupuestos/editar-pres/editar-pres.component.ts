import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PresupuestosService } from '../../servicios/presupuestos.service'
import { Router, ActivatedRoute } from '@angular/router' // Para navegación programática

@Component({
  selector: 'app-editar-pres',
  templateUrl: './editar-pres.component.html',
  styleUrls: ['./editar-pres.component.css']
})
export class EditarPresComponent implements OnInit {

  @ViewChild('cif') cifRef: ElementRef; //para enlazarlo con el cif
  @ViewChild('proveedor') proveedorRef: ElementRef; // para enlazarlo con el #proveedor

  presupuestoForm: FormGroup;
  presupuesto: any;
  id: string;

  mensaje: string = 'Error de conexión con el servidor';
  mostrarAlerta:boolean = false;
  enviando:boolean = false;

  base:number;
  tipo:number;
  importe:number;
  total:number;
  irpf:number;
  retencion:boolean = false;
  cif:boolean;

  constructor(private pf: FormBuilder, // pf producto final
    private presupuestosService: PresupuestosService,
    private router: Router,
    private route: ActivatedRoute) { 
      if(!this.presupuesto) { // Para si no existe... que no salga error
        this.presupuesto = {}
    }
  }

  ngOnInit() {
    this.iniciarFormulario();
  }

  iniciarFormulario(){
    this.id = this.route.snapshot.params['id'];
    this.cargarPres(this.id);
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

  cargarPres(id){
    this.presupuestosService.getPresupuestoId(id)
                           .subscribe((res:any)=>{
                             this.presupuesto = res.presupuesto; // res respuesta
                             console.log(this.presupuesto);
                           })
  }

  editarFra(){
    this.presupuesto = this.guardarPres();
    this.presupuestosService.putPresupuesto(this.id, this.presupuesto)
                           .subscribe((res:any)=>{
                            this.router.navigate(['/listado-presupuestos'])
                           })
  }


  guardarPres(){
    const guardarFra = {
      proveedor: this.presupuestoForm.get('proveedor').value,
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
    return guardarFra;
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
      // this.cif = valorForm.cif.startsWith('A') || valorForm.cif.startsWith('B'); //this.cif es una booleana T o F
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

}

}
