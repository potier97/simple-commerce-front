import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomResponse } from '@app/models/custom-response';
import { OfferData } from '@app/models/offer'; 
import { PreOrderData } from '@app/models/pre-order';
import { environment } from '@environments/environment'; 
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OfferService {

  constructor(private httpClient: HttpClient) { }

  getAllOffers(): Observable<CustomResponse>{
    return this.httpClient.get<CustomResponse>(`${environment.API_PATH}/offer/`)
    .pipe(
      map((res: CustomResponse) => {
        //console.log('Listando las oferta', res) 
        return res;
      }),
      catchError( err => this.handleError(err))
    );
  }

  //Obtrener todos los tipos de ofertas
  getAllTypeOffers(): Observable<CustomResponse>{
    return this.httpClient.get<CustomResponse>(`${environment.API_PATH}/offer/type/`)
    .pipe(
      map((res: CustomResponse) => { 
        return res;
      }),
      //catchError( err => this.handleError(err))
    );
  }

  createOffer(newOffer: OfferData): Observable<CustomResponse>{
    return this.httpClient.post<CustomResponse>(`${environment.API_PATH}/offer/`, newOffer)
    .pipe(
      map((res: CustomResponse) => {
        return res;
      }),
      //catchError( err => this.handleError(err))
    );
  } 
 
  getOffer(id: number): Observable<CustomResponse>{
    return this.httpClient.get<CustomResponse>(`${environment.API_PATH}/offer/${id}`)
    .pipe(
      map((res: CustomResponse) => {
        //console.log('Oferta Obtenido', res) 
        return res;
      }),
      //catchError( err => this.handleError(err))
    );
  }   
 
  updateOffer(offer: OfferData): Observable<CustomResponse>{
    return this.httpClient.put<CustomResponse>(`${environment.API_PATH}/offer/`, offer)
    .pipe(
      map((res: CustomResponse) => {
        return res;
      }),
      //catchError( err => this.handleError(err))
    );
  } 
 
  calculateOffer(preOrder: PreOrderData): Observable<CustomResponse>{
    return this.httpClient.post<CustomResponse>(`${environment.API_PATH}/offer/calculate/`, preOrder)
    .pipe(
      map((res: CustomResponse) => {
        return res;
      }),
      //catchError( err => this.handleError(err))
    );
  }
  
  
  private handleError(err: any): Observable<never>{
    let errorMessage = "Ocurrió un error en Oferta"; 
    if(err){
      errorMessage = `Error code Offer: ${err.code}`;
      console.log("Error generado -> ", err)
      //window.alert(errorMessage); 
    }
    return throwError(errorMessage);
  }

}