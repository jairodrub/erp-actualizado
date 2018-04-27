import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../../servicios/clientes.service';
import { trigger, state, style, animate, transition } from '@angular/animations'; // Animaciones

@Component({
  selector: 'app-listado-clie',
  templateUrl: './listado-clie.component.html',
  styleUrls: ['./listado-clie.component.css'],
  animations: [
    trigger('alerta', [ // alerta la hemos definido en HTML antes
      state('show', style({opacity: 1})), // El estado en el que está
      state('hide', style({opacity: 0})),
      transition('show => hide', animate('500ms ease-out')), // Cuando pasemos de show a hide...
      transition('hide => show', animate('500ms ease-in')) // Cuando pasemos de hide a show...
    ]) 
  ]// Lleva un array por si lleva varias animaciones
})
export class ListadoClieComponent implements OnInit {

  mensaje: string;
  mostrarAlerta:boolean = false;
  clientes:any;
  id:string;

  constructor(private clientesService: ClientesService) { }

  ngOnInit() {
    this.cargarClientes();
  }

  get estadoAlerta() { // Creamos un método
    return this.mostrarAlerta ? 'show' : 'hide' // si no se cumple, hide (y no se ve)
  }

  cargarClientes(){ // Se ejecuta cuando se ejecuta el componente en ngOnInit
    this.clientesService.getClientes()
            .subscribe((resp:any)=>{ // resp es respuesta
                this.clientes = resp.clientes; 

            }, error => {
              console.log(error);
            })
  }

  obtenerId(id){
    this.id = id
  }
  
  borrarCliente() { // quitamos el id del parentesis y lo metemos arriba
    this.clientesService.deleteCliente(this.id)
                           .subscribe((resp:any)=>{
                             this.mensaje = "El cliente ha sido eliminado correctamente";
                             this.mostrarAlerta = true; // En este momento mostrarAlerta es true
                             this.cargarClientes();
                             setTimeout(()=>{ // Apaga el mensaje anterior cuando hayan pasado "x" segundos
                              this.mostrarAlerta = false;
                             }, 2500); // 2 segundos
                           },(error:any)=>{
                             this.mensaje = 'Error de conexión con el servidor';
                             this.mostrarAlerta = true;
                             setTimeout(()=>{
                              this.mostrarAlerta = false;
                            }, 2500);
                           });
  }
}
