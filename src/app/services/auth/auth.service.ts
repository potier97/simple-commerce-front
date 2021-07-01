import { Injectable } from '@angular/core';
import { environment } from '@environments/environment'
import { HttpClient } from '@angular/common/http'
import { LogInResponse, LogInUser } from '@app/models/log-in-user';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators'; 
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from '@angular/router';
 
const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private httpClient: HttpClient,
      private router: Router  
    ) {
     this.validateToken();
   }


  get isLogged(): Observable<boolean>{
    return this.loggedIn.asObservable();
  }
 
 
  login(authData: LogInUser): Observable<LogInResponse | void | any >{
    return this.httpClient.post<LogInResponse>(`${environment.API_PATH}/auth/authenticate`, authData)
    .pipe(
      map( (res: LogInResponse) => {
        console.log('Ingresando al sistema')
        this.loggedIn.next(true);
        this.saveToken(res.jwt);
        return res;
      }),
      catchError( err => this.handleError(err))
    );
  }

  logout(): void{
    console.log("Saliendo...")
    localStorage.removeItem("token");
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  private validateToken(): void{
    const userToken = localStorage.getItem("token") ||  ''; 
    const isExpired = helper.isTokenExpired(userToken);
    //console.log("Estatus token: ", isExpired);
    if(!isExpired) this.loggedIn.next(true)
    else this.logout();
    
  }
  
  private saveToken(token: string): void{
    localStorage.setItem("token", token);
  }


  private handleError(err: any): Observable<never>{
    let errorMessage = "Ocurrió un error"; 
    if(err) errorMessage = `Error code: ${errorMessage}`;
    window.alert(errorMessage); 
    return throwError(errorMessage);
  }

}



 
   