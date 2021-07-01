import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '@app/services/auth/auth.service';
import { catchError, concatMap } from 'rxjs/operators';

@Injectable()
export class JwtInterceptorInterceptor implements HttpInterceptor {

  constructor( private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    if(request.url.includes("payment") || request.url.includes("products") || request.url.includes("clients") ||
    request.url.includes("offers") || request.url.includes("invoces") || request.url.includes("covenants") || 
    request.url.includes("pay") || request.url.includes("mistakes") || request.url.includes("profile") ){
      const authToken = this.authService.userTokenValue;
      const authReq = request.clone({
        setHeaders: {
          authorization: `Bearer ${authToken}`
        }
      })
      return next.handle(authReq)
        .pipe(catchError((err: HttpErrorResponse) => {
          if(err.status === 401){ 
            return this.authService.refreshToken(authToken)
              .pipe(concatMap((data: any)  => {
                console.log('Refreshing')
                const reauthReq = request.clone({
                  setHeaders: {
                    authorization: `Bearer ${data.jwt}`
                  }
                }) 
                return next.handle(reauthReq)
              }))
             
          }else{ 
            this.authService.logout();
            return throwError(err);
          }
        }))
    }
    return next.handle(request);


  }
}
