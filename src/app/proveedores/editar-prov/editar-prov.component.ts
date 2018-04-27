import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProveedoresService } from '../../servicios/proveedores.service'
import { Router, ActivatedRoute } from '@angular/router' // Para navegación programática
import { AutenticacionService } from '../../servicios/autenticacion.service';


@Component({
  selector: 'app-editar-prov',
  templateUrl: './editar-prov.component.html',
  styleUrls: ['./editar-prov.component.css']
})
export class EditarProvComponent implements OnInit {

  proveedorForm: FormGroup;
  proveedor:any;
  provincias:string[] = [
    'Alava','Albacete','Alicante','Almería','Asturias','Avila','Badajoz','Barcelona','Burgos','Cáceres',
    'Cádiz','Cantabria','Castellón','Ceuta','Ciudad Real','Córdoba','La Coruña','Cuenca','Gerona','Gibraltar español','Granada','Guadalajara',
    'Guipúzcoa','Huelva','Huesca','Islas Baleares','Jaén','León','Lérida','Lugo','Madrid','Málaga','Melilla','Murcia','Navarra',
    'Orense','Palencia','Las Palmas','Pontevedra','La Rioja','Salamanca','Segovia','Sevilla','Soria','Tarragona',
    'Santa Cruz de Tenerife','Teruel','Toledo','Valencia','Valladolid','Vizcaya','Zamora','Zaragoza'
  ]
  id:string;

  constructor(private pf: FormBuilder, // pf producto final
    private proveedoresService: ProveedoresService,
    private router: Router,
    private route: ActivatedRoute,
    private autenticacionService: AutenticacionService) { 
      if(!this.proveedor) { // Para si no existe... que no salga error
        this.proveedor = {};
    }
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.cargarProveedor(this.id);
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

  cargarProveedor(id){ // Lo necesitamos inmediatamente para tener los datos actualizados del proveedor
    this.proveedoresService.getProveedorId(id)
                           .subscribe((res:any)=>{
                             this.proveedor = res.proveedor; // res respuesta
                             console.log(this.proveedor);
                           })
  }

  editarProv(){
    this.proveedor = this.guardarProv();
    this.proveedoresService.putProveedor(this.id, this.proveedor)
                           .subscribe((res:any)=>{
                            this.router.navigate(['/listado-proveedores'])
                           })
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
