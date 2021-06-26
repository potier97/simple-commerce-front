import { Injectable } from '@angular/core';
import { environment } from '@environments/environment'
import { HttpClient } from '@angular/common/http'
import { LogInResponse, LogInUser } from '@app/models/log-in-user';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { JwtHelperService } from "@auth0/angular-jwt";
 
const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(true);

  constructor(private httpClient: HttpClient) {
     this.validateToken();
   }


  get isLoggedIn(): Observable<boolean>{
    return this.loggedIn.asObservable();
  }
 
 
  // login(authData: LogInUser): Observable<LogInResponse | void | any>{
  //   return this.httpClient.post<LogInResponse>(`${environment.API_URL}/auth/authentication`, authData)
  //   .pipe(
  //     map( (res: LogInResponse) => {
  //       console.log(res)
  //       this.saveToken(res.token);
  //       this.loggedIn.next(true);
  //       return res;
  //     }),
  //     catchError( (err) => this.handleError(err))
  //   )
  // }

  logout(): void{
    localStorage.removeItem("token");
    this.loggedIn.next(false);
  }

  private validateToken(): void{
    //const userToken = JSON.parse(localStorage.getItem("token") || '{}'); 
    //const isExpired = helper.isTokenExpired(userToken);
    // console.log("Estatus token: ", isExpired);
    // if(!isExpired){
    //   this.loggedIn.next(true)
    // }else{
    //   this.logout();
    // } 
  }
  
  private saveToken(token: string): void{
    localStorage.setItem("token", token);
  }


  private handleError(err: any): Observable<never>{
    let errorMessage = "Ocurrió un error"; 
    if(err){
      errorMessage = `Error code: ${errorMessage}`;
    }
    window.alert(errorMessage); 
    return throwError(errorMessage);
  }

}



 
   