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
    //console.log("Interceptor generated", request.url)
    if(request.url.includes("pay") || request.url.includes("product") || request.url.includes("clients") ||
    request.url.includes("offer") || request.url.includes("invoice") || request.url.includes("covenant") || 
    request.url.includes("pay") || request.url.includes("mistake") || request.url.includes("profile") 
    || request.url.includes("agreementPay") || request.url.includes("user") || request.url.includes("buy") ){  
      //console.log("Entró") 
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
                //console.log('Refreshing...')
                const reauthReq = request.clone({
                  setHeaders: {
                    authorization: `Bearer ${data.jwt}`
                  }
                }) 
                return next.handle(reauthReq)
              }))
             
          }else{ 
            //this.authService.logout();
            return throwError(err);
          }
        }))
    }
    return next.handle(request);


  }
}
