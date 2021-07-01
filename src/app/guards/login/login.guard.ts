import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '@app/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(
    private authService: AuthService,    
    private route: Router,    
) { }
  
  canActivate(): Observable<boolean>{ 
    return this.authService.isLogged.pipe(
      take(1),
      map((isLogged: boolean) => {
        if(isLogged) this.route.navigate(['/payment'])
        return !isLogged 
      })) 
  }
  
}
