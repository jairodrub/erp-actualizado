import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../../servicios/clientes.service';
import { FormControl, FormGroup, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-listado-clie',
  templateUrl: './listado-clie.component.html',
  styleUrls: ['./listado-clie.component.css']
})
export class ListadoClieComponent implements OnInit {

  buscador: FormControl;
  clientes:any;
  mensaje:boolean;

  constructor(private clientesService: ClientesService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.buscador = new FormControl(); // Para generar... que como solo tiene
                                       // un campo solo tiene el valor del objeto
    this.buscador.valueChanges
                 .subscribe((nombre)=>{ // Nos subscribimos a esos cambios del valor...
                                        // Recibimos el nombre
                if( nombre.length !== 0){
                  this.clientesService.getClientes(nombre)
                  .subscribe((res:any)=>{
                    this.clientes = res.clientes;
                    if (this.clientes.length === 0){
                      this.mensaje = true;
                    } else {
                      this.mensaje = false;
                    }
                  },(error)=>{
                    console.log(error)
                  })
                } else {
                  this.clientes = [];
                  this.mensaje = false;
                }

              })
    }

  }
