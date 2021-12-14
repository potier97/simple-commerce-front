import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InvoiceResponse } from '@app/models/invoice';
import { environment } from '@environments/environment'; 
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private general_url: string = environment.API_URL;

  constructor(private httpClient: HttpClient) { }

  //Obtener todas las compras ( facturas )
  getAllInvoices(): Observable<InvoiceResponse[]>{
    return this.httpClient.get<InvoiceResponse[]>(`${this.general_url}invoice/`)
    .pipe(
      map((res: InvoiceResponse[]) => {
        //console.log('Listando facturas', res) 
        return res;
      }),
    );
  }
 
  //OBTENER UNA FACTURA POR EL ID
  getInvoiceById(id: number): Observable<InvoiceResponse>{
    return this.httpClient.get<InvoiceResponse>(`${this.general_url}invoice/${id}`)
    .pipe(
      map((res: InvoiceResponse) => {
        //console.log('Factura Obtenida', res) 
        return res;
      }),
    );
  }   

 
  //ACTUALIZAR UNA FACTURA
  deleteInvoice(id: number): Observable<InvoiceResponse>{
    return this.httpClient.delete<InvoiceResponse>(`${this.general_url}invoice/${id}`)
    .pipe(
      map((res: InvoiceResponse) => {
        return res;
      }),
    );
  }
}
