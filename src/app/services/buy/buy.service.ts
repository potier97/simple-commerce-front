import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomResponse } from '@app/models/custom-response';
import { PaymentData } from '@app/models/payment'; 
import { environment } from '@environments/environment'; 
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BuyService {

  constructor(private httpClient: HttpClient) { }
 

  // GENERAR UNA NUEVA COMPRA
  createProduct(newBuy: any): Observable<CustomResponse>{
    return this.httpClient.post<CustomResponse>(`${environment.API_PATH}/buy/`, newBuy)
    .pipe(
      map((res: CustomResponse) => {
        return res;
      }),
      catchError( err => this.handleError(err))
    );
  } 
 
  
  private handleError(err: any): Observable<never>{
    let errorMessage = "Ocurrió un error"; 
    if(err){
      errorMessage = `Error code Buy: ${err.code}`;
      console.log("Error generado Al comprar -> ", err)
      //window.alert(errorMessage); 
    }
    return throwError(errorMessage);
  }
}
