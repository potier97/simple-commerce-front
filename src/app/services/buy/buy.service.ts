import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BuyReq, NewBuyResponse } from '@app/models/new-buy';
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
  newBuy(newBuy: NewBuyResponse): Observable<BuyReq>{
    return this.httpClient.post<BuyReq>(`${this.general_url}buy`, newBuy)
    .pipe(
      map((res: BuyReq) => {
        return res;
      }),
    );
  } 
  
}
