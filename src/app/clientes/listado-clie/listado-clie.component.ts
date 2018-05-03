import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../../servicios/clientes.service';
import { FormControl, FormGroup, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-listado-clie',
  templateUrl: './listado-clie.component.html',
  styleUrls: ['./listado-clie.component.css']
})
export class ListadoClieComponent implements OnInit {
  
  buscadorLocalidad: FormControl;
  buscador: FormControl;
  buscadorLocalidadNombre: FormGroup; // Porque agrupa un conjunto de campos
  consulta:any;
  clientes:any;
  mensaje:boolean;
  buscando:boolean = false;
  verBuscadorNombre:boolean = true;
  verBuscadorLocalidad:boolean = false;
  verBuscadorNombreLocalidad:boolean = false; // Para que arranque en false

  constructor(private clientesService: ClientesService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.buscador = new FormControl(); // Para generar... que como solo tiene
                                       // un campo solo tiene el valor del objeto
    this.buscador.valueChanges
                 .subscribe((nombre)=>{ // Nos subscribimos a esos cambios del valor...
                                        // Recibimos el nombre
                  this.buscando = true;
                if( nombre.length !== 0){
                  this.clientesService.getClientes(nombre)
                  .subscribe((res:any)=>{
                    this.buscando = false;
                    this.clientes = res.clientes;
                    if (this.clientes.length === 0){
                      this.mensaje = true;
                    } else {
                      this.mensaje = false;
                    }
                  },(error)=>{
                    this.buscando = false;
                    console.log(error)
                  })
                } else {
                  this.buscando = false;
                  this.clientes = [];
                  this.mensaje = false;
                }

              })
              this.buscadorLocalidad = new FormControl(); // Para generar... que como solo tiene
                                       // un campo solo tiene el valor del objeto
              this.buscadorLocalidad.valueChanges
                 .subscribe(localidad=>{ // Nos subscribimos a esos cambios del valor...
                                        // Recibimos el nombre
                  this.buscando = true;
                if( localidad.length !== 0){
                  this.clientesService.getClientesLocalidad(localidad)
                  .subscribe((res:any)=>{
                    this.buscando = false;
                    this.clientes = res.clientes;
                    if (this.clientes.length === 0){
                      this.mensaje = true;
                    } else {
                      this.mensaje = false;
                    }
                  },(error)=>{
                    this.buscando = false;
                    console.log(error)
                  })
                } else {
                  this.buscando = false;
                  this.clientes = [];
                  this.mensaje = false;
                }

              })
      this.buscadorLocalidadNombre = this.fb.group({ // fb está en el constructor
        nombre: null,
        localidad:null
      })
    }

    crearConsulta(){
      this.mensaje = false;
      this.buscando = true;
      this.consulta = this.guardarConsulta();
      this.clientesService.getClientesNombreLocalidad(this.consulta)
                          .subscribe((resp:any)=>{ // Éxito
                            this.buscando = false;
                            this.clientes = resp.clientes;
                            if(this.clientes.length === 0){
                              this.mensaje = true;
                            }
                            this.buscadorLocalidadNombre.reset();
                          },(error)=>{ // Error
                            this.buscando = false;
                            console.log(error);
                          })
    }

    guardarConsulta(){
      const guardarConsulta = {
        nombre: this.buscadorLocalidadNombre.get('nombre').value,
        localidad: this.buscadorLocalidadNombre.get('localidad').value,
      }
      return guardarConsulta;
    }

    buscarPorNombre(){
      this.verBuscadorNombre = true;
      this.verBuscadorLocalidad = false;
      this.verBuscadorNombreLocalidad = false;
      this.clientes = [];
      this.buscador.setValue('');
    }

    buscarPorLocalidad(){
      this.verBuscadorNombre = false;
      this.verBuscadorLocalidad = true;
      this.verBuscadorNombreLocalidad = false;
      this.clientes = [];
      this.buscadorLocalidad.setValue('');
    }

    buscarPorNombreLocalidad(){
      this.verBuscadorNombre = false;
      this.verBuscadorLocalidad = false;
      this.verBuscadorNombreLocalidad = true;
      this.clientes = [];
      // this.buscadorLocalidad.setValue('');
    }

  }
