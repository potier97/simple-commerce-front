import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClientsResponse } from '@app/models/clients';
import { CustomResponse } from '@app/models/custom-response';
import { environment } from '@environments/environment'; 
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private general_url: string = environment.API_URL;

  constructor(private httpClient: HttpClient) {}

  //Obtener todos los clientes en el sistema
  getAllClients(): Observable<ClientsResponse[]>{
    return this.httpClient.get<ClientsResponse[]>(`${this.general_url}client`)
    .pipe(
      map((res: ClientsResponse[]) => {
        // console.log('Listando los cliente', res) 
        return res;
      }),
    );
  }

  //Crear un cliente
  createClient(newProduct: ClientsResponse): Observable<CustomResponse>{
    return this.httpClient.post<CustomResponse>(`${this.general_url}client`, newProduct)
    .pipe(
      map((res: CustomResponse) => {
        return res;
      }),
    );
  }

  getClientById(id: number): Observable<ClientsResponse>{
    return this.httpClient.get<ClientsResponse>(`${this.general_url}client/${id}`)
    .pipe(
      map((res: ClientsResponse) => {
        //console.log('cliente Obtenido', res) 
        return res;
      }),
    );
  }   
 
  updateClient(id: number, product: ClientsResponse): Observable<ClientsResponse>{
    return this.httpClient.put<ClientsResponse>(`${this.general_url}client/${id}`, product)
    .pipe(
      map((res: ClientsResponse) => {
        return res;
      }),
    );
  }

  deleteClient(id: number): Observable<ClientsResponse>{
    return this.httpClient.delete<ClientsResponse>(`${this.general_url}client/${id}`)
    .pipe(
      map((res: ClientsResponse) => {
        return res;
      }),
    );
  }
}
