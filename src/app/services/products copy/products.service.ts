import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductsResponse } from '@app/models/products';
import { environment } from '@environments/environment'; 
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private general_url: string = environment.API_URL;

  constructor(private httpClient: HttpClient) { }

  getAllProducts(): Observable<ProductsResponse[]>{
    return this.httpClient.get<ProductsResponse[]>(`${this.general_url}/product`)
    .pipe(
      map((res: ProductsResponse[]) => {
        //console.log('Listando los prodctos', res) 
        return res;
      }),
    );
  }

  createProduct(newProduct: ProductsResponse): Observable<ProductsResponse>{
    return this.httpClient.post<ProductsResponse>(`${this.general_url}/product`, newProduct)
    .pipe(
      map((res: ProductsResponse) => {
        return res;
      }),
    );
  }

  deleteProduct(id: number): Observable<ProductsResponse>{
    return this.httpClient.delete<ProductsResponse>(`${this.general_url}/product/${id}`)
    .pipe(
      map((res: ProductsResponse) => {
        //console.log('Eliminado la oferta', res) 
        return res;
      }),
    );
  }

  getProduct(id: number): Observable<ProductsResponse>{
    return this.httpClient.get<ProductsResponse>(`${this.general_url}/product/${id}`)
    .pipe(
      map((res: ProductsResponse) => {
        //console.log('Producto Obtenido', res) 
        return res;
      }),
    );
  }   
 
  updateProduct(product: ProductsResponse): Observable<ProductsResponse>{
    return this.httpClient.put<ProductsResponse>(`${this.general_url}/product/`, product)
    .pipe(
      map((res: ProductsResponse) => {
        return res;
      }),
    );
  }
}
