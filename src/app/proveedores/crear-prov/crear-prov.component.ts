import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProveedoresService } from '../../servicios/proveedores.service'
import { Router } from '@angular/router' // Para navegación programática
import { trigger, state, style, animate, transition } from '@angular/animations'; // Animaciones


@Component({
  selector: 'app-crear-prov',
  templateUrl: './crear-prov.component.html',
  styleUrls: ['./crear-prov.component.css'],
  animations: [
    trigger('alerta', [ // alerta la hemos definido en HTML antes
      state('show', style({opacity: 1})), // El estado en el que está
      state('hide', style({opacity: 0})),
      transition('show => hide', animate('500ms ease-out')), // Cuando pasemos de show a hide...
      transition('hide => show', animate('500ms ease-in')) // Cuando pasemos de hide a show...
    ]) 
  ]// Lleva un array por si lleva varias animaciones
})

export class CrearProvComponent implements OnInit {

  @ViewChild('cif') cifRef: ElementRef;

  proveedorForm: FormGroup;
  proveedor:any;
  provincias:string[] = [
    'Alava','Albacete','Alicante','Almería','Asturias','Avila','Badajoz','Barcelona','Burgos','Cáceres',
    'Cádiz','Cantabria','Castellón','Ceuta','Ciudad Real','Córdoba','La Coruña','Cuenca','Gerona','Gibraltar español','Granada','Guadalajara',
    'Guipúzcoa','Huelva','Huesca','Islas Baleares','Jaén','León','Lérida','Lugo','Madrid','Málaga','Melilla','Murcia','Navarra',
    'Orense','Palencia','Las Palmas','Pontevedra','La Rioja','Salamanca','Segovia','Sevilla','Soria','Tarragona',
    'Santa Cruz de Tenerife','Teruel','Toledo','Valencia','Valladolid','Vizcaya','Zamora','Zaragoza'
  ]

  mensaje: string = 'Error de conexión con el servidor';
  mostrarAlerta:boolean = false;
  enviando:boolean = false;

  constructor(private pf: FormBuilder, // pf producto final
              private proveedoresService: ProveedoresService,
              private router: Router) { 

   }

  ngOnInit() {
    this.proveedorForm = this.pf.group({
      nombre: null,
      cif: null,
      domicilio: null,
      cp: null,
      localidad: null,
      provincia: null,
      telefono: null,
      email: null,
      contacto: null,
    })
  }

  get estadoAlerta() { // Creamos un método
    return this.mostrarAlerta ? 'show' : 'hide' // si no se cumple, hide (y no se ve)
  }

  crearProv(){ // Hay que engancharlo con un backend
    this.mostrarAlerta = false;
    this.enviando = true;
    this.proveedor = this.guardarProv();
    this.proveedoresService.postProveedor(this.proveedor)
                          .subscribe((resp:any)=>{
                            this.router.navigate(['/listado-proveedores']);
                            // cuando haya éxito, nos lleva a la lista de proveedores
                            this.enviando = false;
                          }, (error:any)=>{
                            this.mostrarAlerta = true;
                            this.enviando = false;
                            console.log(error);
                            if (error.error.errores.errors.cif.message){
                              this.mensaje = error.error.errores.errors.cif.message;
                              this.cifRef.nativeElement.focus(); // Para que nos muestre esto
                                                                // además del error
                            }
                          });
  }

  guardarProv(){
    const guardarProv = {
      nombre: this.proveedorForm.get('nombre').value,
      cif: this.proveedorForm.get('cif').value,
      domicilio: this.proveedorForm.get('domicilio').value,
      cp: this.proveedorForm.get('cp').value,
      localidad: this.proveedorForm.get('localidad').value,
      provincia: this.proveedorForm.get('provincia').value,
      telefono: this.proveedorForm.get('telefono').value,
      email: this.proveedorForm.get('email').value,
      contacto: this.proveedorForm.get('contacto').value,
    }
    return guardarProv;
  }
}
