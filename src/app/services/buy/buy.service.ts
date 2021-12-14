import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomResponse } from '@app/models/custom-response'; 
import { OrderData } from '@app/models/order';
import { environment } from '@environments/environment'; 
import { Observable } from 'rxjs';
import {  map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BuyService {

  private general_url: string = environment.API_URL;

  constructor(private httpClient: HttpClient) { }
 

  // GENERAR UNA NUEVA COMPRA
  newBuy(newBuy: OrderData): Observable<CustomResponse>{
    return this.httpClient.post<CustomResponse>(`${this.general_url}/buy`, newBuy)
    .pipe(
      map((res: CustomResponse) => {
        return res;
      }),
    );
  } 
  
}
