import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { AuthService } from '@app/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
      private authService: AuthService,  
      private route: Router,  
      
  ) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {  

     
      return this.authService.isLogged.pipe(
        take(1),
        map((isLogged: boolean) => {
          console.log(isLogged)
          if(!isLogged) this.route.navigate(['/login'])
          return isLogged 
        })) 
  }

  canActivateChild(route: ActivatedRouteSnapshot,  
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean { 
    return this.canActivate(route); 
  }
  
}
