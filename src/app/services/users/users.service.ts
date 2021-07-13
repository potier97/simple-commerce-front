import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomResponse } from '@app/models/custom-response';
import { UserData } from '@app/models/user'; 
import { environment } from '@environments/environment'; 
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private httpClient: HttpClient,
          private authService: AuthService
    ) { }

  //Obtener todos los clientes en el sistema
  getAllClients(): Observable<CustomResponse>{
    return this.httpClient.get<CustomResponse>(`${environment.API_PATH}/user/`)
    .pipe(
      map((res: CustomResponse) => {
        //console.log('Listando los cliente', res) 
        return res;
      }),
      catchError( err => this.handleError(err))
    );
  }

  //Obtener datos del Admin 
  getAdminProfile(): Observable<CustomResponse>{ 
    const token = this.authService.getToken();
    const tokenData = {
      token: token
    }  
    return this.httpClient.post<CustomResponse>(`${environment.API_PATH}/user/profile`, tokenData)
    .pipe(
      map((res: CustomResponse) => {
        //console.log('Listando el perfil del usuario', res) 
        return res;
      }),
      catchError( err => this.handleError(err))
    );
  }

  //Obtener todos los tipos de documentos
  getAllDocTypes(): Observable<CustomResponse>{
    return this.httpClient.get<CustomResponse>(`${environment.API_PATH}/user/doctypes`)
    .pipe(
      map((res: CustomResponse) => {
        //console.log('Listando los tipos de documentos del cliente', res) 
        return res;
      }),
      catchError( err => this.handleError(err))
    );
  }

  //Obtener todos los tipos de Usuarios
  getAllUserTypes(): Observable<CustomResponse>{
    return this.httpClient.get<CustomResponse>(`${environment.API_PATH}/user/usertypes`)
    .pipe(
      map((res: CustomResponse) => {
        //console.log('Listando los tipos de usuario del cliente', res) 
        return res;
      }),
      catchError( err => this.handleError(err))
    );
  }

  //Obtener todos los Usuarios Corporativos
  getAllCorpUsers(): Observable<CustomResponse>{
    return this.httpClient.get<CustomResponse>(`${environment.API_PATH}/user/corpUsers`)
    .pipe(
      map((res: CustomResponse) => {
        //console.log('Listando los tipos de usuario del cliente', res) 
        return res;
      }),
      catchError( err => this.handleError(err))
    );
  }

  //Crear un cliente
  createClient(newProduct: UserData): Observable<CustomResponse>{
    return this.httpClient.post<CustomResponse>(`${environment.API_PATH}/user/`, newProduct)
    .pipe(
      map((res: CustomResponse) => {
        return res;
      }),
      //catchError( err => this.handleError(err))
    );
  }

  //Obtener por el documento
  findByDoc(document: string): Observable<CustomResponse>{
    return this.httpClient.post<CustomResponse>(`${environment.API_PATH}/user/doc`, document)
    .pipe(
      map((res: CustomResponse) => {
        return res;
      }),
      //catchError( err => this.handleError(err))
    );
  }
 
  // funcionalidad para eliminado logico de un usuario
  // deleteClient(id: number): Observable<CustomResponse>{
  //   return this.httpClient.delete<CustomResponse>(`${environment.API_PATH}/user/${id}`)
  //   .pipe(
  //     map((res: CustomResponse) => {
  //       //console.log('Eliminado un cliente', res) 
  //       return res;
  //     }),
  //     catchError( err => this.handleError(err))
  //   );
  // }

  getClientById(id: number): Observable<CustomResponse>{
    return this.httpClient.get<CustomResponse>(`${environment.API_PATH}/user/${id}`)
    .pipe(
      map((res: CustomResponse) => {
        //console.log('cliente Obtenido', res) 
        return res;
      }),
      //catchError( err => this.handleError(err))
    );
  }   
 
  updateClient(product: UserData): Observable<CustomResponse>{
    return this.httpClient.put<CustomResponse>(`${environment.API_PATH}/user/`, product)
    .pipe(
      map((res: CustomResponse) => {
        return res;
      }),
      //catchError( err => this.handleError(err))
    );
  }
  
  
  private handleError(err: any): Observable<never>{
    let errorMessage = "Ocurrió un error en Cliente"; 
    if(err){
      errorMessage = `Error code User: ${err.code}`;
      console.log("Error generado -> ", err) 
    }
    return throwError(errorMessage);
  }
}
