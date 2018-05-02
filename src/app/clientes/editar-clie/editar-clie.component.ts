import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClientesService } from '../../servicios/clientes.service'
import { Router, ActivatedRoute } from '@angular/router' // Para navegación programática

@Component({
  selector: 'app-editar-clie',
  templateUrl: './editar-clie.component.html',
  styleUrls: ['./editar-clie.component.css']
})
export class EditarClieComponent implements OnInit {

  clienteForm: FormGroup;
  cliente:any;
  provincias:string[] = [
    'Alava','Albacete','Alicante','Almería','Asturias','Avila','Badajoz','Barcelona','Burgos','Cáceres',
    'Cádiz','Cantabria','Castellón','Ceuta','Ciudad Real','Córdoba','La Coruña','Cuenca','Gerona','Gibraltar español','Granada','Guadalajara',
    'Guipúzcoa','Huelva','Huesca','Islas Baleares','Jaén','León','Lérida','Lugo','Madrid','Málaga','Melilla','Murcia','Navarra',
    'Orense','Palencia','Las Palmas','Pontevedra','La Rioja','Salamanca','Segovia','Sevilla','Soria','Tarragona',
    'Santa Cruz de Tenerife','Teruel','Toledo','Valencia','Valladolid','Vizcaya','Zamora','Zaragoza'
  ]
  id:string;

  constructor(private pf: FormBuilder, // pf producto final
    private clientesService: ClientesService,
    private router: Router,
    private route: ActivatedRoute) { 
      if(!this.cliente) { // Para si no existe... que no salga error
        this.cliente = {};
    }
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.cargarCliente(this.id);
    this.clienteForm = this.pf.group({
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

  cargarCliente(id){ // Lo necesitamos inmediatamente para tener los datos actualizados del cliente
    this.clientesService.getClienteId(id)
                        .subscribe((res:any)=>{
                          this.cliente = res.cliente; // res respuesta
                        })
  }

  editarCliente(){
    this.cliente = this.guardarCliente();
    this.clientesService.putCliente(this.id, this.cliente)
                        .subscribe((res:any)=>{
                          this.router.navigate(['/listado-clientes']);
                        })
  }

  guardarCliente(){
    const guardarCliente = {
      nombre: this.clienteForm.get('nombre').value,
      cif: this.clienteForm.get('cif').value,
      domicilio: this.clienteForm.get('domicilio').value,
      cp: this.clienteForm.get('cp').value,
      localidad: this.clienteForm.get('localidad').value,
      provincia: this.clienteForm.get('provincia').value,
      telefono: this.clienteForm.get('telefono').value,
      email: this.clienteForm.get('email').value,
      contacto: this.clienteForm.get('contacto').value
    }
    return guardarCliente;
  }

}