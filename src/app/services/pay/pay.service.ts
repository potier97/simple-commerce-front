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
export class PayService {

  constructor(private httpClient: HttpClient) { }

  //OBTENER TODOS LOS PAGOS
  getAllPayments(): Observable<CustomResponse>{
    return this.httpClient.get<CustomResponse>(`${environment.API_PATH}/pay/`)
    .pipe(
      map((res: CustomResponse) => {
        //console.log('Listando todos los pagos', res) 
        return res;
      }),
      catchError( err => this.handleError(err))
    );
  } 

  //OBTENER TODOS LOS TIPOS DE PAGOS
  getAllTypesPayments(): Observable<CustomResponse>{
    return this.httpClient.get<CustomResponse>(`${environment.API_PATH}/pay/methods/`)
    .pipe(
      map((res: CustomResponse) => {
        //console.log('Listando todos los tipos pagos', res) 
        return res;
      }),
      catchError( err => this.handleError(err))
    );
  } 

  //OBTENER UN PAGO POR EL ID
  getPayment(id: number): Observable<CustomResponse>{
    return this.httpClient.get<CustomResponse>(`${environment.API_PATH}/pay/${id}`)
    .pipe(
      map((res: CustomResponse) => {
        //console.log('Pago Obtenido', res) 
        return res;
      }),
      //catchError( err => this.handleError(err))
    );
  }   

  //OBTENER UN PAGO POR LA FECHA
  getPaymentByDate(date: string): Observable<CustomResponse>{
    return this.httpClient.get<CustomResponse>(`${environment.API_PATH}/pay/${date}`)
    .pipe(
      map((res: CustomResponse) => {
        //console.log('Pago Obtenido', res) 
        return res;
      }),
      //catchError( err => this.handleError(err))
    );
  } 
 
  //ACTUALIZAR EL PAGO que FALTA POR SER PAGADO - PENDIENTE - A CREDITO -- ACTUALIZAR UN PAGO - CUOTA
  updatePayment(payment: PaymentData): Observable<CustomResponse>{
    return this.httpClient.put<CustomResponse>(`${environment.API_PATH}/pay/`, payment)
    .pipe(
      map((res: CustomResponse) => {
        return res;
      }),
      //catchError( err => this.handleError(err))
    );
  }
  
  
  private handleError(err: any): Observable<never>{
    let errorMessage = "Ocurrió un error"; 
    if(err){
      errorMessage = `Error code Payment: ${err.code}`;
      console.log("Error generado Pago -> ", err)
      //window.alert(errorMessage); 
    }
    return throwError(errorMessage);
  }
}
