import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomResponse } from '@app/models/custom-response';
import { InvoiceData } from '@app/models/invoice'; 
import { MonthData } from '@app/models/month';
import { environment } from '@environments/environment'; 
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private httpClient: HttpClient) { }

  //Obtener todas las compras ( facturas )
  getAllInvoices(): Observable<CustomResponse>{
    return this.httpClient.get<CustomResponse>(`${environment.API_PATH}/invoice/`)
    .pipe(
      map((res: CustomResponse) => {
        //console.log('Listando facturas', res) 
        return res;
      }),
      catchError( err => this.handleError(err))
    );
  }

  // CREAR UNA FACTURA
  // createProduct(newProduct: ProductsData): Observable<CustomResponse>{
  //   return this.httpClient.post<CustomResponse>(`${environment.API_PATH}/invoice/`, newProduct)
  //   .pipe(
  //     map((res: CustomResponse) => {
  //       return res;
  //     }),
  //     //catchError( err => this.handleError(err))
  //   );
  // } 
 
  //OBTENER UNA FACTURA POR EL ID
  getInvoiceById(id: number): Observable<CustomResponse>{
    return this.httpClient.get<CustomResponse>(`${environment.API_PATH}/invoice/${id}`)
    .pipe(
      map((res: CustomResponse) => {
        //console.log('Factura Obtenida', res) 
        return res;
      }),
      //catchError( err => this.handleError(err))
    );
  }   

  //BUSCAR FACTURAS POR SU ID
  findInvoiceById(id: number): Observable<CustomResponse>{
    return this.httpClient.post<CustomResponse>(`${environment.API_PATH}/invoice/findId/${id}`, {})
    .pipe(
      map((res: CustomResponse) => {
        //console.log('Factura Obtenida', res) 
        return res;
      }),
      //catchError( err => this.handleError(err))
    );
  } 

  //OBTENER EL DETALLE DE UNA FACTURA POR EL ID
  getDetailsInvoiceById(id: number): Observable<CustomResponse>{
    return this.httpClient.get<CustomResponse>(`${environment.API_PATH}/invoice/details/${id}`)
    .pipe(
      map((res: CustomResponse) => {
        //console.log('Factura Obtenida', res) 
        return res;
      }),
      //catchError( err => this.handleError(err))
    );
  }  
 
  //ACTUALIZAR UNA FACTURA
  updateInvoice(invoice: InvoiceData): Observable<CustomResponse>{
    return this.httpClient.put<CustomResponse>(`${environment.API_PATH}/invoice/`, invoice)
    .pipe(
      map((res: CustomResponse) => {
        return res;
      }),
      //catchError( err => this.handleError(err))
    );
  }

  //Generar las facturas del mes para compras que tengan cuotas pendientes
  generateMonthInvoices(data: MonthData): Observable<CustomResponse>{
    return this.httpClient.post<CustomResponse>(`${environment.API_PATH}/invoicesMonth/`, data)
    .pipe(
      map((res: CustomResponse) => {
        //console.log('Generando facturas del mes actual', res) 
        return res;
      }),
      //catchError( err => this.handleError(err))
    );
  }
  
  
  private handleError(err: any): Observable<never>{
    let errorMessage = "Ocurrió un error"; 
    if(err){
      errorMessage = `Error code: ${err.code}`;
      console.log("Error generado -> ", err)
      //window.alert(errorMessage); 
    }
    return throwError(errorMessage);
  }
}
