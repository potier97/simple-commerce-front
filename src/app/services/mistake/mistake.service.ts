import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomResponse } from '@app/models/custom-response'; 
import { environment } from '@environments/environment'; 
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MistakeService {
   
  constructor(private httpClient: HttpClient) { }

  //Obtener todos los errores (usando JDBC en el back)
  getAllErrors(): Observable<CustomResponse>{
    return this.httpClient.get<CustomResponse>(`${environment.API_PATH}/mistake/`)
    .pipe(
      map((res: CustomResponse) => {
        //console.log('Listando los errores de pagos', res) 
        return res;
      }),
      catchError( err => this.handleError(err))
    );
  }

  //Obtener un detalle del error (usando JDBC en el back)
  getErrorById(id: string): Observable<CustomResponse>{
    return this.httpClient.get<CustomResponse>(`${environment.API_PATH}/mistake/${id}`)
    .pipe(
      map((res: CustomResponse) => {
        //console.log('Listando el detalle de un error', res) 
        return res;
      }),
      catchError( err => this.handleError(err))
    );
  }
  
  private handleError(err: any): Observable<never>{
    let errorMessage = "Ocurrió un error"; 
    if(err){
      errorMessage = `Error code Mistake: ${err.code}`;
      //g("Error generado en Mistake-> ", err) ;
    }
    return throwError(errorMessage);
  }
}
