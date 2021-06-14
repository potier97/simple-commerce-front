import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private URL = 'http://localhost:3000/api/user'


  constructor(private httpClient: HttpClient) { }

  singUp(user: any){
    return this.httpClient.post<any>(this.URL + '/singUp', user);
  }


}
 

 