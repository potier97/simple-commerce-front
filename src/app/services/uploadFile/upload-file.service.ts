import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomResponse } from '@app/models/custom-response';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  constructor(private httpClient: HttpClient) { }
 

  uploadPayment(newProduct: File | any): Observable<CustomResponse>{
 
    const formData: FormData = new FormData();
    formData.append('file', newProduct) 
    
    return this.httpClient.post<CustomResponse>(`${environment.API_PATH}/agreementPay/`, formData, {
      reportProgress: true,
      responseType: 'json',
    })
    .pipe(
      map((res: CustomResponse) => {
        return res;
      }),
      //catchError( err => this.handleError(err))
    );
  }


}
