import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartsModule } from 'ng2-charts'


import { AppComponent } from './app.component';
import { InicioComponent } from './inicio/inicio.component';
import { ComprasComponent } from './compras/compras.component';
import { ListadoProvComponent } from './proveedores/listado-prov/listado-prov.component';
import { CabeceraComponent } from './cabecera/cabecera.component';
import { ProveedoresService } from './servicios/proveedores.service';
import { CrearProvComponent } from './proveedores/crear-prov/crear-prov.component';
import { EditarProvComponent } from './proveedores/editar-prov/editar-prov.component';
import { ListadoFrasComponent } from './facturas/listado-fras/listado-fras.component';
import { CrearFrasComponent } from './facturas/crear-fras/crear-fras.component';
import { EditarFrasComponent } from './facturas/editar-fras/editar-fras.component';
import { FacturasService } from './servicios/facturas.service';
import { RegistroComponent } from './autenticacion/registro/registro.component';
import { AutenticacionService } from './servicios/autenticacion.service';
import { LoginComponent } from './autenticacion/login/login.component';
import { VentasComponent } from './ventas/ventas.component';
import { EditarClieComponent } from './clientes/editar-clie/editar-clie.component';
import { CrearClieComponent } from './clientes/crear-clie/crear-clie.component';
import { ListadoClieComponent } from './clientes/listado-clie/listado-clie.component';
import { EditarPresComponent } from './presupuestos/editar-pres/editar-pres.component';
import { CrearPresComponent } from './presupuestos/crear-pres/crear-pres.component';
import { ListadoPresComponent } from './presupuestos/listado-pres/listado-pres.component';
import { ClientesService } from './servicios/clientes.service';
import { PresupuestosService } from './servicios/presupuestos.service';
import { AutenticacionGuard } from './servicios/autenticacion.guard';
import { ListadoUsuariosComponent } from './autenticacion/listado-usuarios/listado-usuarios.component';
import { ListadoSesionesComponent } from './autenticacion/listado-sesiones/listado-sesiones.component';
import { CrearArticuloComponent } from './articulos/crear-articulo/crear-articulo.component';
import { ListadoArticulosComponent } from './articulos/listado-articulos/listado-articulos.component';
import { ArticulosService } from './servicios/articulos.service'

const rutas: Routes =[    //Creacción de rutas. Array para enviarlo a router-outlet.  Rutas friendly según Google
  {path:'' , component: InicioComponent},
  {path:'registro', component: RegistroComponent},
  {path:'inicio-sesion', component: LoginComponent},
  {path:'listado-usuarios', component: ListadoUsuariosComponent, canActivate: [AutenticacionGuard]},
  {path:'listado-sesiones/:nombre', component: ListadoSesionesComponent, canActivate: [AutenticacionGuard]},
  {path:'compras', component: ComprasComponent, canActivate: [AutenticacionGuard]},
  {path:'listado-proveedores', component: ListadoProvComponent, canActivate: [AutenticacionGuard]},
  {path:'crear-proveedor', component: CrearProvComponent, canActivate: [AutenticacionGuard]},
  {path:'editar-proveedor/:id', component: EditarProvComponent, canActivate: [AutenticacionGuard]},
  {path:'listado-facturas', component: ListadoFrasComponent, canActivate: [AutenticacionGuard]},
  {path:'crear-factura', component: CrearFrasComponent, canActivate: [AutenticacionGuard]},
  {path:'editar-factura/:id', component: EditarFrasComponent, canActivate: [AutenticacionGuard]},
  {path:'ventas', component: VentasComponent, canActivate: [AutenticacionGuard]},
  {path:'listado-clientes', component: ListadoClieComponent, canActivate: [AutenticacionGuard]},
  {path:'crear-cliente', component: CrearClieComponent, canActivate: [AutenticacionGuard]},
  {path:'editar-cliente/:id', component: EditarClieComponent, canActivate: [AutenticacionGuard]},
  {path:'listado-presupuestos', component: ListadoPresComponent, canActivate: [AutenticacionGuard]},
  {path:'crear-presupuesto', component: CrearPresComponent, canActivate: [AutenticacionGuard]},
  {path:'editar-presupuesto/:id', component: EditarPresComponent, canActivate: [AutenticacionGuard]},
  {path:'listado-articulos', component: ListadoArticulosComponent, canActivate: [AutenticacionGuard]},
  {path:'crear-articulo', component: CrearArticuloComponent, canActivate: [AutenticacionGuard]},
  {path:'**', component: InicioComponent}, // Esta es la del error
]


@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    ComprasComponent,
    CabeceraComponent,
    ListadoProvComponent,
    CrearProvComponent,
    EditarProvComponent,
    ListadoFrasComponent,
    CrearFrasComponent,
    EditarFrasComponent,
    RegistroComponent,
    LoginComponent,
    VentasComponent,
    EditarClieComponent,
    CrearClieComponent,
    ListadoClieComponent,
    EditarPresComponent,
    CrearPresComponent,
    ListadoPresComponent,
    ListadoUsuariosComponent,
    ListadoSesionesComponent,
    CrearArticuloComponent,
    ListadoArticulosComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(rutas),
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ChartsModule
  ],
  providers: [ProveedoresService, FacturasService, AutenticacionService, ClientesService, PresupuestosService, AutenticacionGuard, ArticulosService],
  bootstrap: [AppComponent]
})
export class AppModule { }
