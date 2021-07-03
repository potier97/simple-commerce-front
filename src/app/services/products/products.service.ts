import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomResponse } from '@app/models/custom-response';
import { environment } from '@environments/environment'; 
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private httpClient: HttpClient) { }


  getAllProducts(): Observable<CustomResponse>{
    return this.httpClient.get<CustomResponse>(`${environment.API_PATH}/product/all`)
    .pipe(
      map((res: CustomResponse) => {
        //console.log('Listando los prodctos', res) 
        return res;
      }),
      catchError( err => this.handleError(err))
    );
  }

  deleteProduct(id: number): Observable<CustomResponse>{
    return this.httpClient.delete<CustomResponse>(`${environment.API_PATH}/product/${id}`)
    .pipe(
      map((res: CustomResponse) => {
        //console.log('Listando los prodctos', res) 
        return res;
      }),
      catchError( err => this.handleError(err))
    );
  }
  
  
  private handleError(err: any): Observable<never>{
    let errorMessage = "Ocurrió un error"; 
    if(err) errorMessage = `Error code: ${err.code}`;
    console.log(err)
    //window.alert(errorMessage); 
    return throwError(errorMessage);
  }
}
