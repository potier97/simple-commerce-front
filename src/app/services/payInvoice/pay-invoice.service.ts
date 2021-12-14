import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomResponse } from '@app/models/custom-response';
import { PaymentInvoiceData } from '@app/models/payment-invoice'; 
import { environment } from '@environments/environment'; 
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PayInvoiceService {

  private general_url: string = environment.API_URL;

  constructor(private httpClient: HttpClient) { }
 

  //ACTUALIZAR EL PAGO que FALTA POR SER PAGADO - PENDIENTE - A CREDITO -- ACTUALIZAR UN PAGO - CUOTA
  payInvoice(data: PaymentInvoiceData): Observable<CustomResponse>{
    return this.httpClient.post<CustomResponse>(`${this.general_url}/payinvoice/`, data)
    .pipe(
      map((res: CustomResponse) => {
        //console.log('Pago Realizado', res) 
        return res;
      }),
    );
  }  
   
}