import { Injectable } from '@angular/core';
import { environment } from '@environments/environment'
import { HttpClient } from '@angular/common/http'
import { LogInResponse, LogInUser } from '@app/models/log-in-user';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators'; 
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from '@angular/router';
//import { Token } from '@app/models/token';
 
const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(false);
  
  private userToken = new BehaviorSubject<string>('');

  constructor(private httpClient: HttpClient,
      private router: Router  
    ) {
     this.validateToken();
   }


  get isLogged(): Observable<boolean>{
    return this.loggedIn.asObservable();
  }
 
  get userTokenValue(): string {
    return this.userToken.getValue();
  }
 
  login(authData: LogInUser): Observable<LogInResponse | void >{
    return this.httpClient.post<LogInResponse>(`${environment.API_PATH}/auth/authenticate`, authData)
    .pipe(
      map( (res: LogInResponse) => {
        console.log('Ingresando al sistema')
        this.loggedIn.next(true);
        this.userToken.next(res.jwt);
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
    this.userToken.next('');
    this.router.navigate(['/login']);
  }

  private validateToken(): void{
    const userToken = localStorage.getItem("token") ||  ''; 
    const isExpired = helper.isTokenExpired(userToken); 
    //console.log("Estatus token: ", isExpired);
    if(!isExpired){
      this.loggedIn.next(true)
      this.userToken.next(userToken);
    } else this.logout();
    
  }

  refreshToken(tokenData: string): Observable<LogInResponse | void | any >{
    return this.httpClient.post<LogInResponse>(`${environment.API_PATH}/auth/refresh`, tokenData)
    .pipe(
      map( (res: LogInResponse) => {  
        this.saveToken(res.jwt);
        return res;
      }),
      catchError( err => this.handleError(err))
    );
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



 
   