import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomResponse } from '@app/models/custom-response';
import { CovenantData } from '@app/models/covenant'; 
import { environment } from '@environments/environment'; 
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CovenantService {

  constructor(private httpClient: HttpClient) { }

  getAllCovenants(): Observable<CustomResponse>{
    return this.httpClient.get<CustomResponse>(`${environment.API_PATH}/covenant/`)
    .pipe(
      map((res: CustomResponse) => {
        //console.log('Listando los convenios', res) 
        return res;
      }),
      catchError( err => this.handleError(err))
    );
  }

  createCovenant(newCovenant: CovenantData): Observable<CustomResponse>{
    return this.httpClient.post<CustomResponse>(`${environment.API_PATH}/covenant/`, newCovenant)
    .pipe(
      map((res: CustomResponse) => {
        //console.log('Obteniendo el convenio creado', res) 
        return res;
      }),
      //catchError( err => this.handleError(err))
    );
  }
 

  deleteCovenant(id: number): Observable<CustomResponse>{
    return this.httpClient.delete<CustomResponse>(`${environment.API_PATH}/covenant/${id}`)
    .pipe(
      map((res: CustomResponse) => {
        //console.log('Respuesta del eliminado del convenio', res) 
        return res;
      }),
      catchError( err => this.handleError(err))
    );
  }

  // getCovenant(id: number): Observable<CustomResponse>{
  //   return this.httpClient.get<CustomResponse>(`${environment.API_PATH}/covenant/${id}`)
  //   .pipe(
  //     map((res: CustomResponse) => {
  //       //console.log('Convenio Obtenido', res) 
  //       return res;
  //     }),
  //     //catchError( err => this.handleError(err))
  //   );
  // }   
 
  updateCovenant(dataCovenant: CovenantData): Observable<CustomResponse>{
    return this.httpClient.put<CustomResponse>(`${environment.API_PATH}/covenant/`, dataCovenant)
    .pipe(
      map((res: CustomResponse) => {
         //console.log('Convenio Actualizado', res) 
        return res;
      }),
      //catchError( err => this.handleError(err))
    );
  }
  
  
  private handleError(err: any): Observable<never>{
    let errorMessage = "Ocurrió un error en convenios"; 
    if(err){
      errorMessage = `Error code Covenant: ${err.code}`;
      //console.log("Error generado -> ", err) 
    }
    return throwError(errorMessage);
  }
}
