import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaidModesResponse } from '@app/models/paid-modes';
import { environment } from '@environments/environment'; 
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaidModesService {

  private general_url: string = environment.API_URL;

  constructor(private httpClient: HttpClient) { }

  getAllPaidModes(): Observable<PaidModesResponse[]>{
    return this.httpClient.get<PaidModesResponse[]>(`${this.general_url}pay`)
    .pipe(
      map((res: PaidModesResponse[]) => {
        //console.log('Listando los prodctos', res) 
        return res;
      }),
    );
  }

  createPaidModes(newProduct: PaidModesResponse): Observable<PaidModesResponse>{
    return this.httpClient.post<PaidModesResponse>(`${this.general_url}pay/`, newProduct)
    .pipe(
      map((res: PaidModesResponse) => {
        return res;
      }),
    );
  }

  deletePaidMode(id: number): Observable<PaidModesResponse>{
    return this.httpClient.delete<PaidModesResponse>(`${this.general_url}pay/${id}`)
    .pipe(
      map((res: PaidModesResponse) => {
        //console.log('Eliminado la oferta', res) 
        return res;
      }),
    );
  }

  getPaidMode(id: number): Observable<PaidModesResponse>{
    return this.httpClient.get<PaidModesResponse>(`${this.general_url}pay/${id}`)
    .pipe(
      map((res: PaidModesResponse) => {
        //console.log('Producto Obtenido', res) 
        return res;
      }),
    );
  }   
 
  updatePaidMode(product: PaidModesResponse): Observable<PaidModesResponse>{
    return this.httpClient.put<PaidModesResponse>(`${this.general_url}pay`, product)
    .pipe(
      map((res: PaidModesResponse) => {
        return res;
      }),
    );
  }
}
