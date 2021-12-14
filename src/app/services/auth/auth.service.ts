import { Injectable } from '@angular/core';
import { environment } from '@environments/environment'
import { HttpClient } from '@angular/common/http'
import { LogInResponse, LogInUser, SingUpResponse, SingUpUser } from '@app/models/log-in-user';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators'; 
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from '@angular/router';
//import { Token } from '@app/models/token';
 
const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private general_url: string = environment.API_URL;

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
    return this.httpClient.post<LogInResponse>(`${this.general_url}auth`, authData)
    .pipe(
      map( (res: LogInResponse) => {
        this.loggedIn.next(true);
        this.userToken.next(res.access_token);
        this.saveToken("token", res.access_token);
        this.saveToken("userMail", res.user.email);
        return res;
      }),
    );
  }

  singUp(authData: SingUpUser): Observable<SingUpResponse | void >{
    return this.httpClient.post<SingUpResponse>(`${this.general_url}user`, authData)
    .pipe(
      map( (res: SingUpResponse) => {
        return res;
      }),
    );
  }

  logout(): void{
    //console.log("Saliendo...")
    localStorage.removeItem("token");
    this.loggedIn.next(false);
    this.userToken.next('');
    this.router.navigate(['/login']);
  }

  private validateToken(): void{
    const userToken = localStorage.getItem("token") ||  ''; 
    const isExpired = helper.isTokenExpired(userToken); 
    //console.log("Validando expiración del token -> ", isExpired) 
    if(!isExpired){
      this.loggedIn.next(true)
      this.userToken.next(userToken);
    } else this.logout();
    
  }

  getToken(): string{
    const userToken = localStorage.getItem("token") ||  ''; 
    const isExpired = helper.isTokenExpired(userToken); 
    if(!isExpired) return userToken
    else return ''

  }
 
  private saveToken(name: string, token: string): void{
    localStorage.setItem(name, token);
  }
}



 
   