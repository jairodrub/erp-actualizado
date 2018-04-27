import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FacturasService } from '../../servicios/facturas.service'
import { Router, ActivatedRoute } from '@angular/router' // Para navegación programática

@Component({
  selector: 'app-editar-fras',
  templateUrl: './editar-fras.component.html',
  styleUrls: ['./editar-fras.component.css']
})
export class EditarFrasComponent implements OnInit {

  @ViewChild('cif') cifRef: ElementRef; //para enlazarlo con el cif
  @ViewChild('proveedor') proveedorRef: ElementRef; // para enlazarlo con el #proveedor

  facturaForm: FormGroup;
  factura: any;
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
    private facturasService: FacturasService,
    private router: Router,
    private route: ActivatedRoute) { 
      if(!this.factura) { // Para si no existe... que no salga error
        this.factura = {}
    }
  }

  ngOnInit() {
    this.iniciarFormulario();
  }

  iniciarFormulario(){
    this.id = this.route.snapshot.params['id'];
    this.cargarFra(this.id);
    this.facturaForm = this.pf.group({
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

  cargarFra(id){
    this.facturasService.getFacturaId(id)
                           .subscribe((res:any)=>{
                             this.factura = res.factura; // res respuesta
                             console.log(this.factura);
                           })
  }

  editarFra(){
    this.factura = this.guardarFra();
    this.facturasService.putFactura(this.id, this.factura)
                           .subscribe((res:any)=>{
                            this.router.navigate(['/listado-facturas'])
                           })
  }


  guardarFra(){
    const guardarFra = {
      proveedor: this.facturaForm.get('proveedor').value,
      cif: this.facturaForm.get('cif').value,
      fecha: this.facturaForm.get('fecha').value,
      concepto: this.facturaForm.get('concepto').value,
      base: this.facturaForm.get('base').value,
      retencion: this.facturaForm.get('retencion').value,
      tipo: this.facturaForm.get('tipo').value,
      irpf: this.facturaForm.get('irpf').value,
      importe: this.facturaForm.get('importe').value,
      total: this.facturaForm.get('total').value,
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
    this.facturaForm.valueChanges.subscribe(valorForm =>{ //valueChanges y subscribe siempre espera cambios
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
      this.facturaForm.value.irpf = this.formatearMoneda(this.irpf);
      // El valor de irpf será igual al formateo de irpf
      this.facturaForm.value.importe = this.formatearMoneda(this.importe);
      this.facturaForm.value.total = this.formatearMoneda(this.total);
    })
  }

}
