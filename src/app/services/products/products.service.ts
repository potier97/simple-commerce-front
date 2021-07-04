import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomResponse } from '@app/models/custom-response';
import { incrementeProduct, ProductsData } from '@app/models/products'; 
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

  createProduct(newProduct: ProductsData): Observable<CustomResponse>{
    return this.httpClient.post<CustomResponse>(`${environment.API_PATH}/product/`, newProduct)
    .pipe(
      map((res: CustomResponse) => {
        return res;
      }),
      //catchError( err => this.handleError(err))
    );
  }

  increaseProduct(productData: incrementeProduct): Observable<CustomResponse>{
    return this.httpClient.put<CustomResponse>(`${environment.API_PATH}/product/stock/`, productData)
    .pipe(
      map((res: CustomResponse) => {
        return res;
      }),
      //catchError( err => this.handleError(err))
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

  getProduct(id: number): Observable<CustomResponse>{
    return this.httpClient.get<CustomResponse>(`${environment.API_PATH}/product/${id}`)
    .pipe(
      map((res: CustomResponse) => {
        //console.log('Prodcto Obtenido', res) 
        return res;
      }),
      //catchError( err => this.handleError(err))
    );
  }   
 
  updateProduct(newProduct: ProductsData): Observable<CustomResponse>{
    return this.httpClient.put<CustomResponse>(`${environment.API_PATH}/product/`, newProduct)
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
      errorMessage = `Error code: ${err.code}`;
      console.log("Error generado -> ", err)
      //window.alert(errorMessage); 
    }
    return throwError(errorMessage);
  }
}
