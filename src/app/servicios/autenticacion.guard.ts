import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AutenticacionService } from './autenticacion.service';

@Injectable()
export class AutenticacionGuard implements CanActivate {

  constructor(private autenticacionService: AutenticacionService) {}

  canActivate(){
    if (this.autenticacionService.isLogged()){
      return true;
    } else{
      return false;
    }
  }

}
